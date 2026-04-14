const express = require('express');
const { body, param } = require('express-validator');
const CartController = require('../controllers/CartController');
const AuthMiddleware = require('../shared/middleware/AuthMiddleware');

const router = express.Router();

// All routes require authentication
router.use(AuthMiddleware.verifyToken);

// Get cart
router.get('/', CartController.getCart);

// Add item to cart
router.post('/items', [
  body('product_id').notEmpty().trim(),
  body('quantity').optional().isInt({ min: 1 }).toInt()
], CartController.addItem);

// Update item quantity
router.put('/items/:id', [
  param('id').trim(),
  body('quantity').isInt({ min: 1 }).toInt()
], CartController.updateItem);

// Remove item from cart
router.delete('/items/:id', [
  param('id').trim()
], CartController.removeItem);

// Clear cart
router.delete('/', CartController.clearCart);

module.exports = router;
