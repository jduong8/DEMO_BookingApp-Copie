"use strict";
const USER_ROLE = require("../models/userRole.model.js");
const bcrypt = require("bcrypt");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Création de clients
    const adminstrators = [
      {
        user_role: USER_ROLE.MASTER,
        firstname: "Super",
        lastname: "Admin",
        email: "master@gmail.com",
        phone: "2345678901",
        user_password: "master12345678",
      },
      {
        user_role: USER_ROLE.ADMIN,
        firstname: "Clark",
        lastname: "Kent",
        email: "superman@gmail.com",
        phone: "1234567890",
        user_password: "clark12345678",
      },
    ];

    for (const admin of adminstrators) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(admin.user_password, salt);
      await queryInterface.bulkInsert(
        "Users",
        [
          {
            user_role: admin.user_role,
            firstname: admin.firstname,
            lastname: admin.lastname,
            email: admin.email,
            phone: admin.phone,
            user_password: hashedPassword,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
        {},
      );
    }

    // Création de clients
    const clients = [
      {
        firstname: "Alice",
        lastname: "Smith",
        email: "alice@gmail.com",
        phone: "2345678901",
        user_password: "alice12345678",
      },
      {
        firstname: "Bob",
        lastname: "Johnson",
        email: "bob@gmail.com",
        phone: "3456789012",
        user_password: "bob12345678",
      },
      {
        firstname: "Carol",
        lastname: "Williams",
        email: "carol@gmail.com",
        phone: "4567890123",
        user_password: "carol12345678",
      },
      {
        firstname: "David",
        lastname: "Brown",
        email: "david@gmail.com",
        phone: "5678901234",
        user_password: "david12345678",
      },
    ];

    for (const client of clients) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(client.user_password, salt);
      await queryInterface.bulkInsert(
        "Users",
        [
          {
            user_role: USER_ROLE.CLIENT,
            firstname: client.firstname,
            lastname: client.lastname,
            email: client.email,
            phone: client.phone,
            user_password: hashedPassword,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
        {},
      );
    }
  },

  async down(queryInterface, Sequelize) {},
};
