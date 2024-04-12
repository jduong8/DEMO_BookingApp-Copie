const ProductService = require("../services/product.service");
const productService = new ProductService();

exports.getAllProducts = async (req, res, next) => {
  try {
    const products = await productService.getAllProducts();
    res.send(products);
  } catch (error) {
    next(error);
  }
};

exports.getOneProduct = async (req, res, next) => {
  try {
    const product = await productService.getProductById(req.params.id);
    res.status(200).json(product);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

exports.addNewProduct = async (req, res, next) => {
  try {
    const product = await productService.addProduct(req.body);
    res.status(201).send(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateProduct = async (req, res, next) => {
  try {
    const updatedProduct = await productService.updateProduct(
      req.params.id,
      req.body,
    );
    res.status(200).json({
      message: "Product updated successfully.",
      product: updatedProduct,
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    const deletedProductDetails = await productService.deleteProduct(
      req.params.id,
    );
    res.status(200).json({
      message: "Product deleted successfully.",
      product: deletedProductDetails,
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
