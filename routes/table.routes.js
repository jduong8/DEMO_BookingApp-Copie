require("dotenv").config();
const tableController = require("../controllers/table.controller.js");
const verifyJWT = require("../middlewares/jwt.middleware.js");
const checkRole = require("../middlewares/checkRole.middleware.js");
const USER_ROLE = require("../models/userRole.model.js");
const express = require("express");
const router = express.Router();

// Get all places
router.get("/tables/all", verifyJWT, tableController.getAllTables);

// Create new table
router.post(
  "/table/create",
  verifyJWT,
  checkRole([USER_ROLE.ADMIN, USER_ROLE.MASTER]),
  tableController.addNewTable,
);

// Update table with id
router.put(
  "/table/update/:id",
  verifyJWT,
  checkRole([USER_ROLE.ADMIN, USER_ROLE.MASTER]),
  tableController.updateSeatsCount,
);

// Update seated guests status to true
router.put(
  "/table/:id/update/status",
  verifyJWT,
  checkRole([USER_ROLE.ADMIN, USER_ROLE.MASTER]),
  tableController.updateSeatedGuestsStatus,
);

// Delete table with id
router.delete(
  "/table/delete/:id",
  verifyJWT,
  checkRole([USER_ROLE.ADMIN, USER_ROLE.MASTER]),
  tableController.deleteTable,
);

module.exports = router;
