const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Order = sequelize.define(
    "Order",
    {
      quantity: {
        type: DataTypes.INTEGER,
      },
    },
    {},
  );
  return Order;
};
