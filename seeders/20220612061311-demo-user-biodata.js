"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "User_biodata",
      [
        {
          fullname: "Marcus Aurelius",
          birthdate: new Date(),
          address: "yunani",
          userId: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          fullname: "Mahatma Gandi",
          birthdate: new Date(),
          userId: 3,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("User_biodata", null, {});
  },
};
