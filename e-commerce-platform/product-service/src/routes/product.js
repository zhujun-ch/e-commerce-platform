const express = require('express');
const { body, query, param } = require('express-validator');
const ProductController = require('../controllers/ProductController');
const AuthMiddleware = require('../middleware/AuthMiddleware');

const router = express.Router();

// Get all products (with optional filters)
router.get('/', [
  query('category').optional().trim(),
  query('search').optional().trim(),
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('limit').optional().isInt({ min: 1, max: 100 }).toInt()
], ProductController.getAllProducts);

// Get product by ID
router.get('/:id', [
  param('id').trim()
], ProductController.getProductById);

// Create product (admin only)
router.post('/', [
  AuthMiddleware.verifyToken,
  AuthMiddleware.requireAdmin,
  body('name').notEmpty().trim(),
  body('price').isFloat({ min: 0 }),
  body('category').optional().trim(),
  body('description').optional().trim(),
  body('image_url').optional().trim(),
  body('stock').optional().isInt({ min: 0 }).toInt()
], ProductController.createProduct);

// Update product (admin only)
router.put('/:id', [
  AuthMiddleware.verifyToken,
  AuthMiddleware.requireAdmin,
  param('id').trim(),
  body('name').optional().notEmpty().trim(),
  body('price').optional().isFloat({ min: 0 }),
  body('category').optional().trim(),
  body('description').optional().trim(),
  body('image_url').optional().trim(),
  body('stock').optional().isInt({ min: 0 }).toInt()
], ProductController.updateProduct);

// Delete product (admin only)
router.delete('/:id', [
  AuthMiddleware.verifyToken,
  AuthMiddleware.requireAdmin,
  param('id').trim()
], ProductController.deleteProduct);

module.exports = router;
