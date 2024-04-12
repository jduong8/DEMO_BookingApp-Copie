const USER_ROLE = require("./userRole.model.js");

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      role: {
        type: DataTypes.ENUM(...Object.values(USER_ROLE)),
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
      phone: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {},
  );

  User.associate = (models) => {
    User.hasMany(models.Reservation, {
      onDelete: "CASCADE",
      foreignKey: "userId",
      as: "reservation",
    });
  };

  return User;
};
