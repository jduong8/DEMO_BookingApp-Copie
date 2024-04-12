const CATEGORY = require("../models/category.model.js");

const createProductMock = async () => {
  let products = [];
  const productsByCategory = {
    [CATEGORY.STARTER]: [
      {
        name: "Bruschetta",
        description: "Grilled bread garlic, tomatoes, olive oil.",
        price: 5.99,
      },
      {
        name: "Caprese Salad",
        description: "Mozzarella, tomatoes, basil, balsamic glaze.",
        price: 6.99,
      },
    ],
    [CATEGORY.DISH]: [
      {
        name: "Margherita Pizza",
        description: "Tomato sauce, mozzarella, basil.",
        price: 9.99,
      },
      {
        name: "Pasta Carbonara",
        description: "Pasta, eggs, parmesan, bacon.",
        price: 11.99,
      },
    ],
    [CATEGORY.DESSERT]: [
      {
        name: "Tiramisu",
        description: "Coffee-flavored dessert.",
        price: 6.99,
      },
      {
        name: "Cheesecake",
        description: "Creamy cheesecake.",
        price: 7.99,
      },
    ],
    [CATEGORY.DRINK]: [
      {
        name: "Lemonade",
        price: 3.99,
      },
      {
        name: "Iced Tea",
        price: 2.99,
      },
    ],
  };
  for (const [category, productDetails] of Object.entries(productsByCategory)) {
    productDetails.forEach((product) => {
      products.push({
        ...product,
        category,
      });
    });
  }

  return products;
};

module.exports = createProductMock;
