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

// Admin: Get all users
router.get('/admin/users', AuthMiddleware.verifyToken, AuthMiddleware.requireAdmin, UserController.getAllUsers);

// Admin: Update user role
router.put('/admin/users/:id/role', AuthMiddleware.verifyToken, AuthMiddleware.requireAdmin, UserController.updateUserRole);

// Admin: Delete user
router.delete('/admin/users/:id', AuthMiddleware.verifyToken, AuthMiddleware.requireAdmin, UserController.deleteUser);

module.exports = router;
