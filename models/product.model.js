const { DataTypes } = require("sequelize");
const CATEGORY = require("./category.model.js");

module.exports = (sequelize) => {
  const Product = sequelize.define(
    "Product",
    {
      category: {
        type: DataTypes.ENUM,
        values: [
          CATEGORY.STARTER,
          CATEGORY.DISH,
          CATEGORY.DESSERT,
          CATEGORY.DRINK,
        ],
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

  return Product;
};
