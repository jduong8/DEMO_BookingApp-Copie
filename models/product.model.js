const CATEGORY = require("./category.model.js");

module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define(
    "Product",
    {
      category: {
        type: DataTypes.ENUM(...Object.values(CATEGORY)),
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
      price: {
        type: DataTypes.DOUBLE,
        allowNull: false,
      },
    },
    {},
  );

  Product.associate = (models) => {
    Product.belongsTo(models.Order, {
      onDelete: "CASCADE",
      foreignKey: "orderId",
      as: "productId",
    });
  };

  return Product;
};
