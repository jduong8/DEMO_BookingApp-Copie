const productController = require("../controllers/product.controller.js");
const verifyJWT = require("../middlewares/jwt.middleware");
const checkRole = require("../middlewares/checkRole.middleware.js");
const USER_ROLE = require("../models/userRole.model.js");
var express = require("express");
var router = express.Router();

// Get all products
router.get("/products/all", productController.getAllProducts);

// Get product detail by id
router.get("/product/:id", productController.getOneProduct);

// Create new product
router.post(
  "/products/create",
  verifyJWT,
  checkRole([USER_ROLE.ADMIN, USER_ROLE.MASTER]),
  productController.addNewProduct,
);

// Update product with id
router.put(
  "/products/update/:id",
  verifyJWT,
  checkRole([USER_ROLE.ADMIN, USER_ROLE.MASTER]),
  productController.updateProduct,
);

// Delete product with id
router.delete(
  "/products/delete/:id",
  verifyJWT,
  checkRole([USER_ROLE.ADMIN, USER_ROLE.MASTER]),
  productController.deleteProduct,
);

module.exports = router;
