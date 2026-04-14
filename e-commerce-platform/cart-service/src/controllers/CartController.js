const { v4: uuidv4 } = require('uuid');
const axios = require('axios');
const { pool } = require('../config/database');
const { SERVICES } = require('../../../shared/config/services');

class CartController {
  static async getCart(req, res) {
    try {
      const userId = req.user.id;

      // Get cart items - only store product_id and quantity
      const [items] = await pool.execute(
        `SELECT id, product_id, quantity
         FROM cart_items
         WHERE user_id = ?`,
        [userId]
      );

      // Fetch current product details from product-service
      let total = 0;
      const enrichedItems = [];

      for (const item of items) {
        try {
          const response = await axios.get(`${SERVICES.product.internalUrl}/api/products/${item.product_id}`);
          const product = response.data.product;
          enrichedItems.push({
            id: item.id,
            product_id: item.product_id,
            product_name: product.name,
            product_image_url: product.image_url,
            product_price: product.price,
            quantity: item.quantity
          });
          total += parseFloat(product.price) * item.quantity;
        } catch (apiError) {
          console.error(`Failed to fetch product ${item.product_id}:`, apiError);
          enrichedItems.push({
            id: item.id,
            product_id: item.product_id,
            product_name: 'Unknown',
            product_image_url: '',
            product_price: 0,
            quantity: item.quantity
          });
        }
      }

      res.json({
        items: enrichedItems,
        total: total.toFixed(2)
      });
    } catch (error) {
      console.error('Get cart error:', error);
      res.status(500).json({ error: 'Failed to get cart' });
    }
  }

  static async addItem(req, res) {
    try {
      const userId = req.user.id;
      const { product_id, quantity = 1 } = req.body;

      // Fetch product info from product-service API
      let product;
      try {
        const response = await axios.get(`${SERVICES.product.internalUrl}/api/products/${product_id}`);
        product = response.data.product;
      } catch (apiError) {
        if (apiError.response && apiError.response.status === 404) {
          return res.status(404).json({ error: 'Product not found' });
        }
        console.error('Product service error:', apiError);
        return res.status(500).json({ error: 'Failed to fetch product info' });
      }

      // Check if item already in cart
      const [existing] = await pool.execute(
        'SELECT id, quantity FROM cart_items WHERE user_id = ? AND product_id = ?',
        [userId, product_id]
      );

      if (existing.length > 0) {
        // Update quantity
        const newQuantity = existing[0].quantity + quantity;
        await pool.execute(
          'UPDATE cart_items SET quantity = ? WHERE id = ?',
          [newQuantity, existing[0].id]
        );
      } else {
        // Insert new item - only store product_id and quantity
        const id = uuidv4();
        await pool.execute(
          `INSERT INTO cart_items (id, user_id, product_id, quantity)
           VALUES (?, ?, ?, ?)`,
          [id, userId, product_id, quantity]
        );
      }

      res.json({ message: 'Item added to cart' });
    } catch (error) {
      console.error('Add item error:', error);
      res.status(500).json({ error: 'Failed to add item' });
    }
  }

  static async updateItem(req, res) {
    try {
      const userId = req.user.id;
      const { id } = req.params;
      const { quantity } = req.body;

      const [result] = await pool.execute(
        'UPDATE cart_items SET quantity = ? WHERE id = ? AND user_id = ?',
        [quantity, id, userId]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Cart item not found' });
      }

      res.json({ message: 'Cart item updated' });
    } catch (error) {
      console.error('Update item error:', error);
      res.status(500).json({ error: 'Failed to update cart item' });
    }
  }

  static async removeItem(req, res) {
    try {
      const userId = req.user.id;
      const { id } = req.params;

      const [result] = await pool.execute(
        'DELETE FROM cart_items WHERE id = ? AND user_id = ?',
        [id, userId]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Cart item not found' });
      }

      res.json({ message: 'Item removed from cart' });
    } catch (error) {
      console.error('Remove item error:', error);
      res.status(500).json({ error: 'Failed to remove item' });
    }
  }

  static async clearCart(req, res) {
    try {
      const userId = req.user.id;

      await pool.execute('DELETE FROM cart_items WHERE user_id = ?', [userId]);

      res.json({ message: 'Cart cleared' });
    } catch (error) {
      console.error('Clear cart error:', error);
      res.status(500).json({ error: 'Failed to clear cart' });
    }
  }
}

module.exports = CartController;
