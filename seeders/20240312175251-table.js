"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const timestamp = new Date();
    await queryInterface.bulkInsert(
      "Tables",
      [
        {
          seats_count: 2,
          is_available: true,
          has_seated_guests: false,
          createdAt: timestamp,
          updatedAt: timestamp,
        },
        {
          seats_count: 4,
          is_available: true,
          has_seated_guests: false,
          createdAt: timestamp,
          updatedAt: timestamp,
        },
        {
          seats_count: 4,
          is_available: true,
          has_seated_guests: false,
          createdAt: timestamp,
          updatedAt: timestamp,
        },
        {
          seats_count: 2,
          is_available: true,
          has_seated_guests: false,
          createdAt: timestamp,
          updatedAt: timestamp,
        },
        {
          seats_count: 6,
          is_available: true,
          has_seated_guests: false,
          createdAt: timestamp,
          updatedAt: timestamp,
        },
        {
          seats_count: 2,
          is_available: true,
          has_seated_guests: false,
          createdAt: timestamp,
          updatedAt: timestamp,
        },
        {
          seats_count: 2,
          is_available: true,
          has_seated_guests: false,
          createdAt: timestamp,
          updatedAt: timestamp,
        },
        {
          seats_count: 2,
          is_available: true,
          has_seated_guests: false,
          createdAt: timestamp,
          updatedAt: timestamp,
        },
        {
          seats_count: 4,
          is_available: true,
          has_seated_guests: false,
          createdAt: timestamp,
          updatedAt: timestamp,
        },
        {
          seats_count: 2,
          is_available: true,
          has_seated_guests: false,
          createdAt: timestamp,
          updatedAt: timestamp,
        },
      ],
      {},
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Tables", null, {});
  },
};
