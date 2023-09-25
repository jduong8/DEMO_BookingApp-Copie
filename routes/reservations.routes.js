const reservationController = require('../controllers/reservation.controller.js'); // Assurez-vous que le chemin est correct
// Importation des modules nécessaires
var express = require('express');
var router = express.Router();

// GET home page
router.get('/reservations', reservationController.findAll);

// POST data
router.post('/reservations', reservationController.create);

// PUT data
router.put('/reservations/:id', reservationController.update);

// DELETE data
router.delete('/reservations/:id', reservationController.delete);

// Exportation du routeur pour être utilisé dans d'autres parties de l'application
module.exports = router;
