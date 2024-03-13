const productController = require("../controllers/product.controller.js");
const verifyJWT = require("../middlewares/jwt.middleware");
var express = require("express");
var router = express.Router();

// Get all products
router.get("/products/all", productController.getAllProduct);

// Get product detail by id
router.get("/product/:id", productController.getOneProduct);

// Create new product
router.post("/products/create", verifyJWT, productController.create);

// Update update with id
router.put("/products/update/:id", verifyJWT, productController.update);

// Delete product with id
router.delete("/products/delete/:id", verifyJWT, productController.delete);

module.exports = router;
