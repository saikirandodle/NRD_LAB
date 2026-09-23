const express = require('express')
const router = express.Router()
const authController = require('../controllers/auth.controllers');

// Register a new user
router.post('/signup', authController.signup);

// Authenticate and get a JWT
router.post('/signin', authController.signin);

module.exports = router
