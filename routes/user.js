const express = require('express');

const userController = require('../controllers/userController');

const router = express.Router();

router.get('/users', userController.getUsers);
router.get('/user/:id', userController.getUser);
router.post('/user', userController.createUser);


module.exports = router;
