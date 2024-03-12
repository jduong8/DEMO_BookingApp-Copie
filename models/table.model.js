const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Table = sequelize.define(
    "Table",
    {
      seats_count: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      is_available: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      has_seated_guests: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
    },
    {},
  );
  return Table;
};
