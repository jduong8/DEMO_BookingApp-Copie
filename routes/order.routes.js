require("dotenv").config();
const orderController = require("../controllers/order.controller.js");
const verifyJWT = require("../middlewares/jwt.middleware");
const express = require("express");
const router = express.Router();

// Get all orders
router.get("/orders/all", verifyJWT, orderController.getAllOrder);

// Get orders for table
router.get(
  "/tables/:tableId/orders",
  verifyJWT,
  orderController.getAllOrderForTable,
);

// Create new order
router.post("/order/create", verifyJWT, orderController.createOrder);

// Update order with id
router.put("/order/update/:id", verifyJWT, orderController.updateOrder);

// Create new order
router.delete("/order/delete/:id", verifyJWT, orderController.deleteOrder);

module.exports = router;
