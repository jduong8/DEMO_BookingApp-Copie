const { DataTypes } = require("sequelize");
const USER_ROLE = require("./userRole.model.js");

module.exports = (sequelize) => {
  const User = sequelize.define(
    "User",
    {
      user_role: {
        type: DataTypes.ENUM,
        values: [USER_ROLE.MASTER, USER_ROLE.ADMIN, USER_ROLE.CLIENT],
        allowNull: false,
      },
      firstname: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastname: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      user_password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {},
  );
  return User;
};
