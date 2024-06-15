const db = require("../db.js");
const Product = db.Product;
const helpers = require("../helpers/product.methods.js");

class ProductService {
  async getAllProducts() {
    const products = await Product.findAll();

    return products.map((product) => helpers.formatProductPrice(product));
  }

  async getProductById(id) {
    const product = await Product.findByPk(id);
    if (!product) throw new Error("Product not found");

    return helpers.formatProductPrice(product);
  }

  async addProduct(details) {
    const { name, description, price, category } = details;
    helpers.validateProductDetails(name, description, price, category);

    return await Product.create({ name, description, price, category });
  }

  async updateProduct(id, details) {
    const { name, description, price, category } = details;

    const product = await Product.findByPk(id);

    if (!product) throw new Error("Product not found");

    helpers.validateProductDetails(name, description, price, category);

    await product.update({ name, description, price, category });

    return helpers.formatProductPrice(product);
  }

  async deleteProduct(id) {
    const product = await Product.findByPk(id);
    if (!product) throw new Error("Product not found");

    await product.destroy();

    return helpers.formatProductPrice(product);
  }
}

module.exports = ProductService;
