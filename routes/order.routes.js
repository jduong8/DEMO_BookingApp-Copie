require("dotenv").config();
const orderController = require("../controllers/order.controller.js");
const verifyJWT = require("../middlewares/jwt.middleware");
const checkRole = require("../middlewares/checkRole.middleware.js");
const USER_ROLE = require("../models/userRole.model.js");
const express = require("express");
const router = express.Router();

// Get all orders
router.get(
  "/orders/all",
  verifyJWT,
  checkRole([USER_ROLE.ADMIN, USER_ROLE.MASTER]),
  orderController.getAllOrder,
);

// Get orders for table
router.get(
  "/tables/:tableId/orders",
  verifyJWT,
  checkRole([USER_ROLE.ADMIN, USER_ROLE.MASTER]),
  orderController.getAllOrderForTable,
);

// Create new order
router.post(
  "/order/create",
  verifyJWT,
  checkRole([USER_ROLE.ADMIN, USER_ROLE.MASTER]),
  orderController.createOrder,
);

// Update order with id
router.put(
  "/order/update/:id",
  verifyJWT,
  checkRole([USER_ROLE.ADMIN, USER_ROLE.MASTER]),
  orderController.updateOrder,
);

// Create new order
router.delete(
  "/order/delete/:id",
  verifyJWT,
  checkRole([USER_ROLE.ADMIN, USER_ROLE.MASTER]),
  orderController.deleteOrder,
);

module.exports = router;
