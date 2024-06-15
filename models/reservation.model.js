const RESERVATION_STATUS = require("./reservationStatus.model.js");

module.exports = (sequelize, DataTypes) => {
  const Reservation = sequelize.define(
    "Reservation",
    {
      number_of_customers: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      time: {
        type: DataTypes.TIME,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM(...Object.values(RESERVATION_STATUS)),
        allowNull: false,
      },
    },
    {},
  );

  Reservation.associate = (models) => {
    Reservation.belongsTo(models.User, {
      foreignKey: "userId",
      as: "user",
    });
    Reservation.belongsTo(models.Table, {
      foreignKey: "tableId",
      as: "table",
    });
  };

  return Reservation;
};
