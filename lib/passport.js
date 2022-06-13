const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const { Strategy: JwtStrategy, ExtractJwt } = require("passport-jwt");
const { User_game } = require("../models");

/* passport JWT Options */

const option = {
  jwtFromRequest: ExtractJwt.fromHeader("authorization"),
  secretOrKey: "apahayo",
};

passport.use(
  new JwtStrategy(option, async (playload, done) => {
    User_game.findByPk(playload.id)
      .then((user) => done(null, user))
      .catch((err) => done(err, false));
  })
);

// local-strategy

async function authenticate(username, password, done) {
  try {
    const user = await User_game.authenticate({ username, password });

    return done(null, user);
  } catch (err) {
    return done(null, false, { message: err.message });
  }
}

passport.use(
  new localStrategy(
    { usernameField: "username", passwordField: "password" },
    authenticate
  )
);

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) =>
  done(null, await User_game.findByPk(id))
);

module.exports = passport;
