const { v4: uuidv4 } = require("uuid");
const moment = require("moment");
const { User_game, User_biodata, User_history } = require("../models");

module.exports = {
  getUsers: (req, res) => {
    User_game.findAll()
      .then((results) => {
        res.render("list_user", {
          users: results,
          resourceName: "Users",
          cssFile: "dashboard.css",
          pageTitle: "FSW20 - Admin Dashboard",
        });
      })
      .catch((err) => {
        console.log(err);
      });
  },

  getUser: (req, res) => {
    User_game.findByPk(req.params.id)
      .then((result) => {
        res.render("form_user", {
          editMode: true,
          data: result,
          cssFile: "dashboard.css",
          pageTitle: "FSW20 - Admin Dashboard",
        });
      })
      .catch((err) => {
        console.log(err);
      });
  },

  getCreateUser: (req, res) => {
    res.render("form_user", {
      editMode: false,
      cssFile: "dashboard.css",
      pageTitle: "FSW20 - Admin Dashboard",
    });
  },

  postCreateUser: (req, res) => {
    const { username, password, status } = req.body;
    User_game.findOne({ where: { username } })
      .then((registeredUser) => {
        if (registeredUser) {
          const err = new Error("username isn't available, pick another!");
          return next(err);
        } else {
          return User_game.create({
            id: uuidv4(),
            username,
            password,
            status,
          });
        }
      })
      .then((newUser) => {
        res.redirect("/users");
      })
      .catch((err) => {
        return next(err);
      });
  },

  postReqUser: (req, res, next) => {
    const { username, password } = req.body;

    User_game.findOne({ where: { username } })
      .then((registeredUser) => {
        if (registeredUser) {
          const err = new Error("username isn't available, pick another!");
          return next(err);
        } else {
          return User_game.create({
            id: uuidv4(),
            username,
            password,
            status: "player",
          });
        }
      })
      .then((newUser) => {
        res.redirect("/users/login");
      })
      .catch((err) => {
        return next(err);
      });
  },

  deleteUser: (req, res) => {
    const { id } = req.params;
    User_game.destroy({
      where: {
        id,
      },
    })
      .then((result) => {
        res.redirect("/users");
      })
      .catch.log(err);
  },

  putUpdateUser: (req, res) => {
    const { id } = req.params;
    const { username, password, status } = req.body;

    User_game.update({ username, password, status }, { where: { id } })
      .then((result) => {
        res.redirect("/users");
      })
      .catch((err) => {
        console.log(err);
      });
  },

  postAuthUser: (req, res, next) => {
    const { username, password } = req.body;

    User_game.findOne({ where: { username, password } })
      .then((user) => {
        if (user) {
          if (user.status === "super") res.redirect("/users");
          res.redirect("/game");
        } else {
          const err = new Error(
            "username and password wrong! Please input again!"
          );
          err.status = 401;
          return next(err);
        }
      })
      .catch((err) => {
        return next(err);
      });
  },

  getLogin: (req, res) => {
    res.render("login", {
      cssFile: "game.css",
      pageTitle: "Login",
    });
  },

  getRegister: (req, res) => {
    res.render("register", {
      cssFile: "game.css",
      pageTitle: "Register",
    });
  },

  getBio: (req, res) => {
    const userId = req.params.id;
    let bio;
    User_biodata.findOne({
      where: { userId },
    })
      .then((result) => {
        bio = result;
        return User_game.findAll({ where: { id: userId } });
      })
      .then((users) => {
        res.render("form_bio", {
          editMode: true,
          data: bio,
          users,
          cssFile: "dashboard.css",
          pageTitle: "FSW20 -Admin Dashboard",
        });
      })
      .catch((err) => {
        console.log(err);
      });
  },

  getHistory: (req, res) => {
    const userId = req.params.id;
    User_history.findAll({
      where: { userId },
      include: "User_game",
      raw: true,
      nest: true,
    })
      .then((result) => {
        res.render("history_list", {
          arr: result.map((r) => {
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
};
