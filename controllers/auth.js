const { User_game } = require("../models");
const passport = require("../lib/passport");

function format(user) {
  const { id, username } = user;
  return {
    id,
    username,
    accesToken: user.generateToken(),
  };
}

module.exports = {
  loginForm: (req, res) => {
    res.render("login", {
      cssFile: "game.css",
      pageTitle: "FSW20 - Login",
    });
  },

  register: (req, res) => {
    res.render("register", {
      cssFile: "game.css",
      pageTitle: "FSW20 - Register",
    });
  },

  registerLocal: (req, res, next) => {
    User_game.registerPlayer(req.body)
      .then(() => {
        res.redirect("/auth/login");
      })
      .catch((err) => next(err));
  },

  loginLocal: passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/auth/login",
    failureFlash: true,
  }),
};
