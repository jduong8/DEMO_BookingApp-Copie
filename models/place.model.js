const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Place = sequelize.define(
    "Place",
    {
      seats_count: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      is_available: {
        type: DataTypes.BOOLEAN,
        value: false,
        allowNull: false,
      },
    },
    {},
  );
  return Place;
};
