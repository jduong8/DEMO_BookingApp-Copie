require("dotenv").config();
const placeController = require("../controllers/place.controller.js");
const { place } = require("../db.js");
const verifyJWT = require("../middlewares/jwt.middleware");
const express = require("express");
const router = express.Router();

// Get all places
router.get("/places/all", verifyJWT, placeController.findAll);

// Post new place
router.post("/place", verifyJWT, placeController.create);

router.delete("/places/:id", verifyJWT, placeController.delete);

module.exports = router;
