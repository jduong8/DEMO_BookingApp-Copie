"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const timestamp = new Date();
    await queryInterface.bulkInsert(
      "Places",
      [
        {
          seats_count: 2,
          is_available: true,
          createdAt: timestamp,
          updatedAt: timestamp,
        },
        {
          seats_count: 4,
          is_available: true,
          createdAt: timestamp,
          updatedAt: timestamp,
        },
        {
          seats_count: 4,
          is_available: true,
          createdAt: timestamp,
          updatedAt: timestamp,
        },
        {
          seats_count: 2,
          is_available: true,
          createdAt: timestamp,
          updatedAt: timestamp,
        },
        {
          seats_count: 6,
          is_available: true,
          createdAt: timestamp,
          updatedAt: timestamp,
        },
        {
          seats_count: 2,
          is_available: true,
          createdAt: timestamp,
          updatedAt: timestamp,
        },
        {
          seats_count: 2,
          is_available: true,
          createdAt: timestamp,
          updatedAt: timestamp,
        },
        {
          seats_count: 2,
          is_available: true,
          createdAt: timestamp,
          updatedAt: timestamp,
        },
        {
          seats_count: 4,
          is_available: true,
          createdAt: timestamp,
          updatedAt: timestamp,
        },
        {
          seats_count: 2,
          is_available: true,
          createdAt: timestamp,
          updatedAt: timestamp,
        },
      ],
      {},
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Places", null, {});
  },
};
