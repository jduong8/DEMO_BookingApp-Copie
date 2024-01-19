"use strict";
const RESERVATION_STATUS = require("../models/reservationStatus.model.js");

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Reservations",
      [
        {
          number_of_customers: 4,
          reservation_date: new Date(2024, 1, 14),
          reservation_time: "12:30",
          reservation_name: "Bob Johnson",
          reservation_note: "Table près de la fenêtre, si possible.",
          reservation_status: RESERVATION_STATUS.PENDING,
          userId: 3,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          number_of_customers: 2,
          reservation_date: new Date(2024, 1, 15),
          reservation_time: "13:30",
          reservation_name: "Carol Williams",
          reservation_note: "Table tranquille.",
          reservation_status: RESERVATION_STATUS.PENDING,
          userId: 4,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          number_of_customers: 8,
          reservation_date: new Date(2024, 1, 14),
          reservation_time: "19:30",
          reservation_name: "Alice Smith",
          reservation_note: "Anniversaire et avec siege enfant",
          reservation_status: RESERVATION_STATUS.CONFIRMED,
          userId: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          number_of_customers: 6,
          reservation_date: new Date(2024, 1, 15),
          reservation_time: "20:00",
          reservation_name: "David Brown",
          reservation_note: "Table ronde si possible",
          reservation_status: RESERVATION_STATUS.CONFIRMED,
          userId: 5,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        // Ajoutez deux autres réservations ici avec des données différentes
      ],
      {},
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Reservations", null, {});
  },
};
