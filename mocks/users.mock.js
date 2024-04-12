const bcrypt = require("bcrypt");
const USER_ROLE = require("../models/userRole.model.js");

const createClientMock = async () => {
  const clients = [
    {
      firstname: "Alice",
      lastname: "Smith",
      email: "alice@gmail.com",
      phone: "0612345678",
      password: await bcrypt.hash("alice12345678", 10),
      role: USER_ROLE.CLIENT,
    },
    {
      firstname: "Bob",
      lastname: "Johnson",
      email: "bob@gmail.com",
      phone: "0612345678",
      password: await bcrypt.hash("bob12345678", 10),
      role: USER_ROLE.CLIENT,
    },
    {
      firstname: "Carol",
      lastname: "Williams",
      email: "carol@gmail.com",
      phone: "0612345678",
      password: await bcrypt.hash("carol12345678", 10),
      role: USER_ROLE.CLIENT,
    },
    {
      firstname: "David",
      lastname: "Brown",
      email: "david@gmail.com",
      phone: "0612345678",
      password: await bcrypt.hash("david12345678", 10),
      role: USER_ROLE.CLIENT,
    },
  ];

  return clients;
};

const createAdminMock = async () => {
  const admins = [
    {
      firstname: "Super",
      lastname: "Admin",
      email: "master@gmail.com",
      phone: "0612345678",
      password: await bcrypt.hash("master12345678", 10),
      role: USER_ROLE.MASTER,
    },
    {
      firstname: "Clark",
      lastname: "Kent",
      email: "superman@gmail.com",
      phone: "0612345678",
      password: await bcrypt.hash("clark12345678", 10),
      role: USER_ROLE.ADMIN,
    },
  ];

  return admins;
};

module.exports = {
  createClientMock,
  createAdminMock,
};
