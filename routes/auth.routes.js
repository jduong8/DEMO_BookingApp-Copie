const authController = require("../controllers/auth.controller.js");
const {
  signUpValidationRules,
  signInValidationRules,
  validate,
} = require("../middlewares/authenticationValidator.middleware.js");
const express = require("express");
const router = express.Router();

// POST User
router.post(
  "/signup",
  signUpValidationRules(),
  validate,
  authController.signUp,
);

// Get Token from POST request
router.post(
  "/signin",
  signInValidationRules(),
  validate,
  authController.connect,
);

// Send request for reset password
router.post("/auth/forget-password", authController.forgotPassword);

module.exports = router;
