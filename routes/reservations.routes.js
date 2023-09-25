require('dotenv').config();
const reservationController = require('../controllers/reservation.controller.js');
// Importation des modules nécessaires
var express = require('express');
var router = express.Router();
const SECRET_KEY = process.env.SECRET_KEY;


const verifyJWT = (req, res, next) => {
    const token = req.header('Authorization');

    if (!token) return res.status(401).json({ auth: false, message: 'Token required' });

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        req.user = decoded;
        next();
    } catch (e) {
        res.status(400).json({ auth: false, message: 'Incorrect token.' });
    }
};

// GET home page
router.get('/reservations', reservationController.findAll);

// POST data
router.post('/reservations', verifyJWT, reservationController.create);

// PUT data
router.put('/reservations/:id', verifyJWT, reservationController.update);

// DELETE data
router.delete('/reservations/:id', verifyJWT, reservationController.delete);

// Exportation du routeur pour être utilisé dans d'autres parties de l'application
module.exports = router;
