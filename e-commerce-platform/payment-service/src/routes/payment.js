const express = require('express');
const { body, param } = require('express-validator');
const PaymentController = require('../controllers/PaymentController');
const AuthMiddleware = require('../shared/middleware/AuthMiddleware');

const router = express.Router();

// Webhook (no auth required)
router.post('/webhook', PaymentController.handleWebhook);

// All other routes require authentication
router.use(AuthMiddleware.verifyToken);

// Create payment
router.post('/create', [
  body('order_id').notEmpty().trim(),
  body('payment_method').optional().trim()
], PaymentController.createPayment);

// Get payment status
router.get('/:id', [
  param('id').trim()
], PaymentController.getPayment);

// Request refund
router.post('/refund', [
  body('payment_id').notEmpty().trim(),
  body('amount').optional().isFloat({ min: 0 }),
  body('reason').optional().trim()
], PaymentController.refundPayment);

module.exports = router;
