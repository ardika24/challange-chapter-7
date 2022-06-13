"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User_biodata extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User_biodata.belongsTo(models.User_game, {
        foreignKey: { name: "userId" },
        as: "user_game",
      });
    }
  }
  User_biodata.init(
    {
      fullname: DataTypes.STRING,
      birthdate: DataTypes.DATE,
      address: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "User_biodata",
    }
  );
  return User_biodata;
};
