require("dotenv").config();
const reservationController = require("../controllers/reservation.controller.js");
const verifyJWT = require("../middlewares/jwt.middleware.js");
const checkRole = require("../middlewares/checkRole.middleware.js");
const checkAuthorOrAdmin = require("../middlewares/checkAuthorOrAdmins.middleware.js");
const USER_ROLE = require("../models/userRole.model.js");
const db = require("../db.js");
const express = require("express");
const router = express.Router();

// GET All reservations
router.get(
  "/reservations/all",
  verifyJWT,
  checkRole([USER_ROLE.ADMIN, USER_ROLE.MASTER, USER_ROLE.CLIENT]),
  reservationController.getAllReservations,
);

// Create new reservation
router.post(
  "/reservation/create",
  verifyJWT,
  reservationController.createNewReservation,
);

// Update own reservation
router.put(
  "/reservations/:id/info/update",
  verifyJWT,
  checkAuthorOrAdmin(db.reservation, "Reservation"),
  reservationController.updateReservation,
);

// Update reservation status
router.put(
  "/reservations/:id/confirmed",
  verifyJWT,
  checkRole([USER_ROLE.ADMIN, USER_ROLE.MASTER]),
  reservationController.confirmReservation,
);

// DELETE reservation
router.delete(
  "/reservations/:id/delete",
  verifyJWT,
  checkRole([USER_ROLE.ADMIN, USER_ROLE.MASTER]),
  reservationController.deleteReservation,
);

// Exportation du routeur pour être utilisé dans d'autres parties de l'application
module.exports = router;
