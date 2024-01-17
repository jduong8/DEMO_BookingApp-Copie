const userController = require('../controllers/user.controller.js')
const verifyJWT = require('../middlewares/jwt.middleware');
var express = require('express');
var router = express.Router();

// GET Users List
router.get('/users', verifyJWT, userController.findAll);

// GET Users Infor
router.get('/user/me', verifyJWT, userController.getUserInfo);

// POST to Update password
router.post('/user/me/update-password', verifyJWT, userController.updatePassword);

// Add Super Admin
router.post('/superAdmin', userController.addSuperAdmin);

// PUT data
router.put('/users/:id', verifyJWT, userController.update);

// DELETE data
router.delete('/users/:id', verifyJWT, userController.delete);

module.exports = router;
