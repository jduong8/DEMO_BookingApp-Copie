const userController = require('../controllers/user.controller.js')
const verifyJWT = require('../middlewares/jwtMiddleware');
var express = require('express');
var router = express.Router();

// GET Users List
router.get('/users', userController.findAll);

// POST data
router.post('/signup', userController.create);

// Add Super Admin
router.post('/superAdmin', userController.addSuperAdmin);

// Get Token from POST request
router.post('/signin', userController.connect);

// PUT data
router.put('/users/:id', verifyJWT, userController.update);

// DELETE data
router.delete('/users/:id', verifyJWT, userController.delete);

module.exports = router;
