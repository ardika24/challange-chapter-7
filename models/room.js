"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Room extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasMany(models.User_history, {
        foreignKey: { name: "roomId", type: DataTypes.INTEGER },
        onDelete: "CASCADE",
      });
    }
  }
  Room.init(
    {
      room_name: DataTypes.STRING,
      player1: DataTypes.STRING,
      player2: DataTypes.STRING,
      rounds: {
        type: DataTypes.ARRAY(DataTypes.ARRAY(DataTypes.STRING)),
        defaultValue: [
          [null, null],
          [null, null],
          [null, null],
        ],
      },
    },
    {
      sequelize,
      modelName: "Room",
    }
  );
  return Room;
};
