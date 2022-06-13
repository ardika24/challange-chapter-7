"use strict";
const bcrypt = require("bcrypt");
const { Model } = require("sequelize");
const jwt = require("jsonwebtoken");

module.exports = (sequelize, DataTypes) => {
  class User_game extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User_game.hasOne(models.User_biodata, {
        foreignKey: { name: "userId", type: DataTypes.UUID },
        as: "user_biodata",
        onDelete: "CASCADE",
      });
      this.hasMany(models.User_history, {
        foreignKey: { name: "userId", type: DataTypes.INTEGER },
        onDelete: "CASCADE",
        as: "user_history",
      });
    }

    static #encrypt = (password) => bcrypt.hashSync(password, 10);

    static registerPlayer = async ({ username, password }) => {
      try {
        const user = await this.findOne({ where: { username } });
        if (user) throw "username already exist!";
        return this.create({
          username,
          password: this.#encrypt(password),
          status: "player",
        });
      } catch (error) {
        throw new Error(error);
      }
    };

    verifyPassword = (password) => bcrypt.compareSync(password, this.password);

    static authenticate = async ({ username, password }) => {
      try {
        console.log(username, password);
        const user = await this.findOne({ where: { username } });
        if (!user) return Promise.reject("User not found!");
        if (!user.verifyPassword(password))
          return Promise.reject("Wrong password");
        return Promise.resolve(user);
      } catch (err) {
        return Promise.reject(err);
      }
    };

    generateToken = () => {
      const payload = {
        id: this.id,
        username: this.username,
      };

      const secret = "apahayo";

      const token = jwt.sign(payload, secret);
      return token;
    };
  }
  User_game.init(
    {
      username: DataTypes.STRING,
      password: DataTypes.STRING,
      status: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "User_game",
    }
  );
  return User_game;
};
