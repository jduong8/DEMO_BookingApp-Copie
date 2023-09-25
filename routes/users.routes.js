const userController = require('../controllers/user.controller.js')
var express = require('express');
var router = express.Router();

// GET Users List
router.get('/users', userController.findAll);

// POST data
router.post('/users', userController.create);

// PUT data
router.put('/users/:id', userController.update);

// DELETE data
router.delete('/users/:id', userController.delete);

module.exports = router;
