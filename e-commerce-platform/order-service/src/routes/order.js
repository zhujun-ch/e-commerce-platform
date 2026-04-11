const express = require('express');
const { body, param } = require('express-validator');
const OrderController = require('../controllers/OrderController');
const AuthMiddleware = require('../middleware/AuthMiddleware');

const router = express.Router();

// All routes require authentication
router.use(AuthMiddleware.verifyToken);

// Create order
router.post('/', [
  body('shipping_address').notEmpty().trim()
], OrderController.createOrder);

// Get user's orders
router.get('/', OrderController.getOrders);

// Get order by ID
router.get('/:id', [
  param('id').trim()
], OrderController.getOrderById);

// Update order status (admin)
router.put('/:id/status', [
  AuthMiddleware.requireAdmin,
  param('id').trim(),
  body('status').isIn(['pending', 'paid', 'shipped', 'delivered', 'cancelled'])
], OrderController.updateOrderStatus);

// Admin: Get all orders
router.get('/admin/all', [
  AuthMiddleware.requireAdmin
], OrderController.getAllOrders);

module.exports = router;
