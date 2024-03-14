"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const timestamp = new Date();
    let data = [];

    // Structure définissant le nombre de tables pour chaque configuration de sièges.
    const tableConfigurations = [
      { seatCount: 2, tableCount: 4 },
      { seatCount: 4, tableCount: 3 },
      { seatCount: 6, tableCount: 2 },
      { seatCount: 8, tableCount: 1 },
    ];

    // Génération des données de tables
    tableConfigurations.forEach((config) => {
      for (let i = 0; i < config.tableCount; i++) {
        data.push({
          seats_count: config.seatCount,
          is_available: true,
          has_seated_guests: false,
          createdAt: timestamp,
          updatedAt: timestamp,
        });
      }
    });

    await queryInterface.bulkInsert("Tables", data, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Tables", null, {});
  },
};
