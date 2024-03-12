// Importation des modules nécessaires
var express = require("express");
var router = express.Router();

// Routes
const reservationsRouter = require("./reservations.routes.js");
const usersRouter = require("./users.routes.js");
const authRouter = require("./auth.routes.js");
const placeRouter = require("./table.routes.js");
const productRouter = require("./product.routes.js");
const orderRouter = require("./order.routes.js");

router.use(reservationsRouter);
router.use(usersRouter);
router.use(authRouter);
router.use(placeRouter);
router.use(productRouter);
router.use(orderRouter);

// Exportation du routeur pour être utilisé dans d'autres parties de l'application
module.exports = router;
