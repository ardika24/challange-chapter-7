"use strict";

const bcrypt = require("bcrypt");
const encrypt = (password) => bcrypt.hashSync(password, 10);

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "User_games",
      [
        {
          id: 1,
          username: "superadmin",
          password: encrypt("superman"),
          status: "super",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          username: "marcus",
          password: encrypt("sandi123"),
          status: "player",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 3,
          username: "mahatma",
          password: encrypt("sandi12"),
          status: "player",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("User_games", null, {});
  },
};
