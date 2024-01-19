const { DataTypes } = require("sequelize");
const RESERVATION_STATUS = require("./reservationStatus.model.js");

module.exports = (sequelize) => {
  const Reservation = sequelize.define(
    "Reservation",
    {
      number_of_customers: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      reservation_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      reservation_time: {
        type: DataTypes.TIME,
        allowNull: false,
      },
      reservation_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      reservation_note: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      reservation_status: {
        type: DataTypes.ENUM,
        values: [
          RESERVATION_STATUS.PENDING,
          RESERVATION_STATUS.CONFIRMED,
          RESERVATION_STATUS.CANCELLATION_REQUESTED,
        ],
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {},
  );
  return Reservation;
};
