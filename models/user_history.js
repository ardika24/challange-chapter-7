"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User_history extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.User_game, {
        foreignKey: { name: "userId" },
      });
      this.belongsTo(models.Room, {
        foreignKey: { name: "roomId" },
      });
    }
  }
  User_history.init(
    {
      start: DataTypes.DATE,
      end: DataTypes.DATE,
      score: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "User_history",
    }
  );
  return User_history;
};
