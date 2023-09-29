'use strict';
const bcrypt = require('bcrypt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Hashage du mot de passe
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('securepassword', salt);
    await queryInterface.bulkInsert('Users', [
      {
        user_role: 'Admin',
        firstname: 'Clark',
        lastname: 'Kent',
        email: 'superman@example.com',
        phone: '1234567890',
        user_password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      // On ajoute d'autres utilisateurs si nécessaire...
    ], {});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
