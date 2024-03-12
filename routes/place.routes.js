require("dotenv").config();
const placeController = require("../controllers/place.controller.js");
const verifyJWT = require("../middlewares/jwt.middleware");
const express = require("express");
const router = express.Router();

// Get all places
router.get("/places/all", verifyJWT, placeController.findAll);

// Post new place
router.post("/place", verifyJWT, placeController.create);

module.exports = router;
