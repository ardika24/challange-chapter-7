const { User_game, Room, User_history } = require("../models");

function format(user) {
  const { id, username } = user;
  return {
    id,
    username,
    accessToken: user.generateToken(),
  };
}

module.exports = {
  registerApi: (req, res, next) => {
    User_game.registerPlayer(req.body)
      .then((result) => {
        res.json(result);
      })
      .catch((err) => {
        res.status(422).send(err.message);
      });
  },

  loginApi: async (req, res) => {
    const user = await User_game.authenticate(req.body);
    const { id, username } = user;
    res.json({
      id,
      username,
      accessToken: user.generateToken(),
    });
  },

  createRoom: async (req, res) => {
    try {
      const { room_name } = req.body;
      const room = await Room.findOne({ where: { room_name } });
      if (room) {
        if (room.player2)
          throw new Error(`Room '${room.room_name}' is full at the moment`);
        return res.json({
          message: `Room '${room.room_name}' is available`,
          room_id: room.id,
        });
      }

      const newRoom = await Room.create({
        room_name,
      });
      res.json({
        message: `Room ${newRoom.room_name} is created'`,
        room_id: newRoom.id,
      });
    } catch (err) {
      res.json(err.message);
    }
  },

  play: async (req, res) => {
    try {
      const { roomId } = req.params;
      const { hand: curlPlayerHand } = req.body;
      const curlPlayer = req.user.username;
      let { room_name, player1, player2, rounds } = await Room.findByPk(
        roomId,
        {
          raw: true,
        }
      );
      console.log("This Player =>", curlPlayer);

      let isActivePlayer = curlPlayer === player1 || curlPlayer === player2;

      if (player2 && !isActivePlayer) {
        throw new Error(`Room '${room_name}' is not available`);
      } else {
        if (player1) {
          if (!player2 && !isActivePlayer) {
            player2 = curlPlayer;
            await Room.update({ player2 }, { where: { id: roomId } });
            isActivePlayer = true;
          }
        } else {
          if (!isActivePlayer) {
            player1 = curlPlayer;
            await Room.update({ player1 }, { where: { id: roomId } });
            isActivePlayer = true;
          }
        }
      }

      function getActiveRound(rounds) {
        return rounds.findIndex((round) => round.some((hand) => hand === null));
      }
      console.log("active round ->", getActiveRound(rounds));

      if (isActivePlayer) {
        const activeRound = getActiveRound(rounds);

        if (activeRound === -1) {
          let player1Score = 0;
          let player2Score = 0;
          rounds.forEach((round) => {
            if (checkWinnerRound(round) === "player 1 wins") {
              player1Score += 3;
              player2Score -= 1;
            } else if (checkWinnerRound(round) === "player 2 wins") {
              player1Score -= 1;
              player2Score += 3;
            } else if (checkWinnerRound(round) === "draw") {
              player1Score += 1;
              player2Score += 1;
            }
          });
          const player_1 = await User_game.findOne({
            where: { username: player1 },
            raw: true,
          });
          const player_2 = await User_game.findOne({
            where: { username: player2 },
            raw: true,
          });
          const historyPlayer1 = await User_history.findOne({
            where: { userId: player_1.id, roomId },
            raw: true,
          });
          if (historyPlayer1)
            await User_history.update(
              { score: player1Score },
              { where: { userId: player_1.id, roomId } }
            );
          else
            await User_history.create({
              userId: player_1.id,
              roomId,
              score: player1Score,
            });
          const historyPlayer2 = await User_history.findOne({
            where: { userId: player_2.id, roomId },
            raw: true,
          });
          if (historyPlayer2)
            await User_history.update(
              { score: player2Score },
              { where: { userId: player_2.id, roomId } }
            );
          else
            await User_history.create({
              userId: player_2.id,
              roomId,
              score: player2Score,
            });

          return res.json({
            message: "This match is finish",
            results: rounds,
          });
        }
        const curlPlayerHandIdx = curlPlayer === player1 ? 0 : 1;
        console.log("curlPlayerHandIdx ==>", curlPlayerHandIdx);
        const opponentHandIdx = curlPlayer === player1 ? 1 : 0;
        const isCurlPlayerHasAlreadyChosen =
          rounds[activeRound][curlPlayerHandIdx];

        if (!isCurlPlayerHasAlreadyChosen) {
          const updatedRounds = [...rounds];
          updatedRounds[activeRound][curlPlayerHandIdx] = curlPlayerHand;
          await Room.update(
            { rounds: updatedRounds },
            { where: { id: roomId } }
          );
        }
        await ensureOppenentHasChosen(roomId, activeRound, opponentHandIdx);
        const { rounds: results } = await Room.findByPk(roomId, { raw: true });
        res.json({
          message: `Round ${activeRound + 1} is already finish`,
          result: results[activeRound],
          winner: checkWinnerRound(results[activeRound]),
        });
      }

      function checkWinnerRound(round) {
        const handPlayer1 = round[0].toUpperCase();
        const handPlayer2 = round[1].toUpperCase();
        if (handPlayer1 === handPlayer2) return "Draw";
        else if (handPlayer1 === "Rock" && handPlayer2 === "Scissors")
          return "Player 1 Wins";
        else if (handPlayer1 === "Rock" && handPlayer2 === "Paper")
          return "Player 2 Wins";
        else if (handPlayer1 === "Paper" && handPlayer2 === "Rock")
          return "Player 1 Wins";
        else if (handPlayer1 === "Paper" && handPlayer2 === "Scissors")
          return "Player 2 Wins";
        else if (handPlayer1 === "Scissors" && handPlayer2 === "Paper")
          return "Player 1 Wins";
        else if (handPlayer1 === "Scissors" && handPlayer2 === "Rock")
          return "Player 2 Wins";
        else return "Invalid";
      }

      function ensureOppenentHasChosen(roomId, activeRound, handIdx) {
        return new Promise(function (resolve, reject) {
          (async function waitForOpponentHand() {
            const { rounds } = await Room.findByPk(roomId, { raw: true });

            if (rounds[activeRound][handIdx]) return resolve();
            setTimeout(waitForOpponentHand, 1000);
          })();
        });
      }
    } catch (err) {
      res.json(err.message);
    }
  },

  whoami: (req, res) => {
    const currentUser = req.user;
    res.json(currentUser);
  },
};
