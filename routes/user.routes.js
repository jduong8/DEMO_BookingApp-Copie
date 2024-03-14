const userController = require("../controllers/user.controller.js");
const verifyJWT = require("../middlewares/jwt.middleware.js");
const checkRole = require("../middlewares/checkRole.middleware.js");
const checkAuthorOrAdmin = require("../middlewares/checkAuthorOrAdmins.middleware.js");
const USER_ROLE = require("../models/userRole.model.js");
const db = require("../db.js");
var express = require("express");
var router = express.Router();

// GET Users List
router.get("/users/all", verifyJWT, userController.getAllUsers);

// GET Own Info
router.get("/user/me", verifyJWT, userController.getUserInfo);

// POST to Update password
router.post(
  "/user/me/update-password",
  verifyJWT,
  userController.updatePassword,
);

// Add Super Admin
router.post("/user/generate/superAdmin", userController.addSuperAdmin);

// Update User role
router.put(
  "/users/:userId/role/admin",
  verifyJWT,
  checkRole([USER_ROLE.MASTER]),
  userController.updateUserRole,
);
router.put(
  "/users/:userId/role/client",
  verifyJWT,
  checkRole([USER_ROLE.MASTER]),
  userController.updateUserRole,
);

// Update user informations
router.put("/users/:id/update", verifyJWT, userController.updateUserInfo);

// DELETE user
router.delete(
  "/users/:id/delete",
  verifyJWT,
  checkAuthorOrAdmin(db.user),
  userController.deleteUser,
);

module.exports = router;
