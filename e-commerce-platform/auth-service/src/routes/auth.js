const express = require('express');
const { body, validationResult } = require('express-validator');
const UserController = require('../controllers/UserController');
const AuthMiddleware = require('../middleware/AuthMiddleware');

const router = express.Router();

// Register
router.post('/register', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('name').optional().trim()
], UserController.register);

// Login
router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').exists()
], UserController.login);

// Get profile (protected)
router.get('/profile', AuthMiddleware.verifyToken, UserController.getProfile);

// Update profile (protected)
router.put('/profile', AuthMiddleware.verifyToken, UserController.updateProfile);

module.exports = router;
