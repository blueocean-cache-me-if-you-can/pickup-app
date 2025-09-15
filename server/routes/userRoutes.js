const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// GET /users - fetch all users
router.get('/', userController.getUsers);
router.post('/signup', userController.signUp);
router.post('/login', userController.login);

module.exports = router;
