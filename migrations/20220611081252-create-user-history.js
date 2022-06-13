"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("User_histories", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      start: {
        type: Sequelize.DATE,
      },
      end: {
        type: Sequelize.DATE,
      },
      score: {
        type: Sequelize.INTEGER,
      },
      userId: {
        type: Sequelize.INTEGER,
        onDelete: "CASCADE",
        references: {
          model: "User_games",
          key: "id",
          as: "userId",
        },
      },
      roomId: {
        type: Sequelize.INTEGER,
        onDelete: "CASCADE",
        references: {
          model: "Rooms",
          key: "id",
          as: "roomId",
        },
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("User_histories");
  },
};
