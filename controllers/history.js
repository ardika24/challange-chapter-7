const { response } = require("express");
const moment = require("moment");
const { User_game, User_history } = require("../models");

module.exports = {
  getHistories: (req, res) => {
    User_history.findAll({ include: "User_game", raw: true, nest: true })
      .then((results) => {
        res.render("history_list", {
          arr: results.map((r) => {
            r.start = moment(r.start).format("YYYY-MM-DD HH:mm:ss");
            r.end = moment(r.end).format("YYYY-MM-DD HH:mm:ss");
            return r;
          }),
          resourceName: "Histories",
          cssFile: "dashboard.css",
          pageTitle: "FSW20 - Admin Dashboard",
        });
      })
      .catch((err) => {
        console.log(err);
      });
  },
  getHistory: (req, res) => {
    let history;
    User_history.findByPk(req.params.id, { raw: true })
      .then((result) => {
        result.start = moment(result.start).format("YYYY-MM-DDThh:mm");
        result.end = moment(result.end).format("YYYY-MM-DDThh:mm");
        history = result;
        return User_game.findAll();
      })
      .then((users) => {
        res.render("form-history", {
          editMode: true,
          data: history,
          users,
          cssFile: "dashboard.css",
          pageTitle: "FSW20 - Admin Dashboard",
        });
      })
      .catch((err) => {
        console.log(err);
      });
  },
  getCreateHistory: (req, res) => {
    User_game.findAll()
      .then((users) => {
        res.render("form-history", {
          editMode: false,
          users,
          cssFile: "dashboard.css",
          pageTitle: "FSW20 - Admin Dashboard",
        });
      })
      .catch((err) => {
        console.log(err);
      });
  },
  postCreateHistory: (req, res, next) => {
    const { start, end, score, userId } = req.body;

    User_history.create({
      start: moment(start, "YYYY-MM-DDThh:mm"),
      end: moment(end, "YYYY-MM-DDThh:mm"),
      score,
      userId,
    })
      .then((newHistory) => {
        res.redirect("/histories");
      })
      .catch((err) => {
        return next(err);
      });
  },

  deleteHistory: (req, res) => {
    const { id } = req.params;
    User_history.destroy({
      where: {
        id,
      },
    });
    then((result) => {
      res.redirect("/histories");
    }).catch((err) => {
      console.log(err);
    });
  },
  putUpdateHistory: (req, res) => {
    const { id } = req.params;
    const { start, end, score } = req.body;

    User_history.update({ start, end, score, userId }, { where: { id } })
      .then((result) => {
        res.redirect("/histories");
      })
      .catch((err) => {
        console.log(err);
      });
  },
};
