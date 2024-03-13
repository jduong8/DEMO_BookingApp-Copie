require("dotenv").config();
const tableController = require("../controllers/table.controller.js");
const verifyJWT = require("../middlewares/jwt.middleware.js");
const express = require("express");
const router = express.Router();

// Get all places
router.get("/tables/all", verifyJWT, tableController.findAll);

// Create new table
router.post("/table/create", verifyJWT, tableController.addNewTable);

// Update table with id
router.put("/table/update/:id", verifyJWT, tableController.updateSeatsCount);

// Update seated guests status to true
router.put(
  "/table/:id/update/status",
  verifyJWT,
  tableController.updateSeatedGuestsStatus,
);

// Delete table with id
router.delete("/table/delete/:id", verifyJWT, tableController.delete);

module.exports = router;
