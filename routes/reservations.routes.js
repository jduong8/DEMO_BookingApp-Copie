require("dotenv").config();
const reservationController = require("../controllers/reservation.controller.js");
const verifyJWT = require("../middlewares/jwt.middleware");
const express = require("express");
const router = express.Router();

// GET home page
router.get("/reservations/all", verifyJWT, reservationController.findAll);

// POST data
router.post("/reservation/create", verifyJWT, reservationController.create);

// PUT data
router.put(
  "/reservations/:id/info/update",
  verifyJWT,
  reservationController.update,
);
router.put(
  "/reservations/:id/confirmed",
  verifyJWT,
  reservationController.confirmReservation,
);

// DELETE data
router.delete(
  "/reservations/:id/delete",
  verifyJWT,
  reservationController.delete,
);

// Exportation du routeur pour être utilisé dans d'autres parties de l'application
module.exports = router;
