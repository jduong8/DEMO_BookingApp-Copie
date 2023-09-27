require('dotenv').config();
const reservationController = require('../controllers/reservation.controller.js');
const verifyJWT = require('../middlewares/jwtMiddleware');
const express = require('express');
const router = express.Router();

// GET home page
router.get('/reservations/all', verifyJWT, reservationController.findAll);

// POST data
router.post('/reservations', verifyJWT, reservationController.create);

// PUT data
router.put('/reservations/:id', verifyJWT, reservationController.update);

// DELETE data
router.delete('/reservations/:id', verifyJWT, reservationController.delete);

// Exportation du routeur pour être utilisé dans d'autres parties de l'application
module.exports = router;
