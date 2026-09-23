const express = require('express')
const router = express.Router()
const userController = require('../controllers/user.controllers');
const { verifyToken } = require('../middlewares/auth.middleware');

// Protect all user endpoints - requires a valid JWT
router.use(verifyToken);

// Retrieve all users
router.get('/', userController.findAll);

// Create a new user
router.post('/', userController.create);

// Retrieve a single user with id
router.get('/:id', userController.findOne);

// Update a user with id
router.put('/:id', userController.update);

// Delete a user with id
router.delete('/:id', userController.delete);

module.exports = router