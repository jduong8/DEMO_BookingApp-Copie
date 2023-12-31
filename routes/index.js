// Importation des modules nécessaires
var express = require('express');
var router = express.Router();

// Routes
const reservationsRouter = require('./reservations.routes.js');
const usersRouter = require('./users.routes.js');

router.use(reservationsRouter);
router.use(usersRouter)

// Exportation du routeur pour être utilisé dans d'autres parties de l'application
module.exports = router;
