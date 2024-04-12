module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define(
    "Order",
    {
      quantity: {
        type: DataTypes.INTEGER,
      },
    },
    {},
  );

  Order.associate = (models) => {
    Order.belongsTo(models.Table, {
      foreignKey: "tableId",
      as: "table",
    });
    Order.belongsTo(models.Product, {
      foreignKey: "tableId",
      as: "product",
    });
  };

  return Order;
};
