class Game {
  #gameOver;
  constructor(gameIndicator) {
    this.#gameOver = false;
    this.gameIndicator = gameIndicator;
  }

  getWinner(
    player_a,
    player_b,
    VS_INDICATOR,
    PLAYER_WIN_INDICATOR,
    COM_WIN_INDICATOR
  ) {
    if (this.#gameOver) {
      console.log("Game is over. Please click RESTART button to play again!");
      return;
    }
    let winner;

    if (
      (player_a.getHand() == "rock" && player_b.getHand() == "scissors") ||
      (player_a.getHand() == "paper" && player_b.getHand() == "rock") ||
      (player_a.getHand() == "scissors" && player_b.getHand() == "paper")
    ) {
      winner = player_a;
      console.log(`The Winner is: ${winner.getName().toUpperCase()}!`);
      this.#setPlayerAWin();
    } else if (
      (player_b.getHand() == "rock" && player_a.getHand() == "scissors") ||
      (player_b.getHand() == "paper" && player_a.getHand() == "rock") ||
      (player_b.getHand() == "scissors" && player_a.getHand() == "paper")
    ) {
      winner = player_b;
      console.log(`The Winner is: ${winner.getName().toUpperCase()}!`);
      this.#setPlayerBWin();
    } else {
      winner = "draw";
      console.log(`The Winner is: None, it's a DRAW!`);
      this.#setDraw();
    }

    this.#setGameOver();
    return winner;
  }
  isOver() {
    return this.#gameOver;
  }
  #setGameOver() {
    this.#gameOver = true;
  }
  #setPlayerAWin() {
    if (this.#gameOver) {
      console.log("Game is over. Please click RESTART button to play again!");
      return;
    }
    // Hide VS Indicator
    this.gameIndicator.vs.classList.add("d-none");
    // Show Player A Win Indicator
    this.gameIndicator.player_a_win.classList.remove("d-none");
  }
  #setPlayerBWin() {
    if (this.#gameOver) {
      console.log("Game is over. Please click RESTART button to play again!");
      return;
    }
    // Hide VS Indicator
    this.gameIndicator.vs.classList.add("d-none");
    // Show Player B Win Indicator
    this.gameIndicator.player_b_win.classList.remove("d-none");
  }
  #setDraw() {
    if (this.#gameOver) {
      console.log("Game is over. Please click RESTART button to play again!");
      return;
    }
    // Hide VS Indicator
    this.gameIndicator.vs.classList.add("d-none");
    // Show Draw Indicator
    this.gameIndicator.draw.classList.remove("d-none");
  }
  restart() {
    this.#gameOver = false;
    // Show VS Indicator
    this.gameIndicator.vs.classList.remove("d-none");
    // Hide Draw Indicator
    if (!this.gameIndicator.draw.classList.contains("d-none")) {
      this.gameIndicator.draw.classList.add("d-none");
    }
    // Hide Player A Win Indicator
    if (!this.gameIndicator.player_a_win.classList.contains("d-none")) {
      this.gameIndicator.player_a_win.classList.add("d-none");
    }
    // Hide Player B Win Indicator
    if (!this.gameIndicator.player_b_win.classList.contains("d-none")) {
      this.gameIndicator.player_b_win.classList.add("d-none");
    }
    console.log(`Restarting the game... Now you can play again, GOOD LUCK!`);
  }
}
class Player {
  constructor(name, handsDOM) {
    this.name = name;
    this.handsDOM = handsDOM;
  }

  getName() {
    return this.name;
  }

  setHand(hand) {
    console.log(
      `${this.name.toUpperCase()} throw a hand: ${hand.toUpperCase()}!`
    );
    this.hand = hand;
    this.selectedHandDOM = Array.from(this.handsDOM).filter(
      (h) => h.dataset.hand == this.hand
    )[0];
    // console.log(selectedHand);
    this.selectedHandDOM.classList.add("tangan-selected");
  }

  randomHand() {
    const HANDS = ["rock", "paper", "scissors"];
    this.hand = HANDS[Math.floor(Math.random() * 3)];

    this.selectedHandDOM = Array.from(this.handsDOM).filter(
      (h) => h.dataset.hand == this.hand
    )[0];
    // console.log(selectedHand);
    this.selectedHandDOM.classList.add("tangan-selected");
    console.log(
      `${this.name.toUpperCase()} throw a hand: ${this.hand.toUpperCase()}!`
    );
  }

  resetHand() {
    this.selectedHandDOM.classList.remove("tangan-selected");
  }

  getHand() {
    return this.hand;
  }
}
document.addEventListener("DOMContentLoaded", function (event) {
  //the event occurred
  const HUMAN_HANDS_DOM = document
    .getElementById("player")
    .getElementsByClassName("tangan");
  const COM_HANDS_DOM = document
    .getElementById("com")
    .getElementsByClassName("tangan");
  const HUMAN = new Player("Player 1", HUMAN_HANDS_DOM);
  const COM = new Player("Computer", COM_HANDS_DOM);
  // console.log(HUMAN_HANDS_DOM);
  // console.log(COM_HANDS_DOM);
  const GAME_INDICATOR = {
    vs: document.getElementById("vs"),
    draw: document.getElementById("draw").parentElement,
    player_a_win: document.getElementById("player-win").parentElement,
    player_b_win: document.getElementById("com-win").parentElement,
  };
  const GAME = new Game(GAME_INDICATOR);

  // let hands = document
  //   .getElementById("player")
  //   .getElementsByClassName("tangan");
  for (let i = 0; i < HUMAN_HANDS_DOM.length; i++) {
    HUMAN_HANDS_DOM[i].addEventListener("click", function () {
      if (!GAME.isOver()) {
        let hand = this.getAttribute("data-hand");
        HUMAN.setHand(hand);
        COM.randomHand();
        GAME.getWinner(HUMAN, COM);
      } else {
        console.log("Game is over. Please click RESTART button to play again!");
      }
    });
  }

  document.getElementById("restart").addEventListener("click", function () {
    GAME.restart();
    HUMAN.resetHand();
    COM.resetHand();
  });
});
