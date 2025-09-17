const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// GET /users - fetch all users

router.post('/signup', userController.signUp);
router.post('/login', userController.login);
//router.get('/', userController.getUsersList);
router.get('/', userController.getUsers);
router.patch('/', userController.patchUsers);

module.exports = router;
