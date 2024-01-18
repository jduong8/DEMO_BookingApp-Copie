const authController = require("../controllers/auth.controller.js");
const express = require("express");
const router = express.Router();

// POST User
router.post("/signup", authController.create);

// Get Token from POST request
router.post("/signin", authController.connect);

// Send request for reset password
router.post("/auth/forget-password", authController.forgotPassword);

module.exports = router;
