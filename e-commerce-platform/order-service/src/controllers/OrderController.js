const { v4: uuidv4 } = require('uuid');
const mysql = require('mysql2/promise');
const { pool } = require('../config/database');

// Create separate connection pool for cart_db to read cart items
const cartPool = mysql.createPool({
  host: process.env.CART_DB_HOST || 'localhost',
  user: process.env.CART_DB_USER || 'root',
  password: process.env.CART_DB_PASSWORD || '',
  database: 'cart_db',
  waitForConnections: true,
  connectionLimit: 5,
  queueLimit: 0
});

class OrderController {
  static async createOrder(req, res) {
    try {
      const userId = req.user.id;
      const { shipping_address } = req.body;

      // Get cart items from cart_db (uses product_name, product_price stored in cart_items)
      const [cartItems] = await cartPool.execute(
        'SELECT product_id, product_name, product_price, quantity FROM cart_items WHERE user_id = ?',
        [userId]
      );

      if (cartItems.length === 0) {
        return res.status(400).json({ error: 'Cart is empty' });
      }

      // Calculate total using product_price from cart_items
      const totalAmount = cartItems.reduce((sum, item) => {
        return sum + (item.product_price * item.quantity);
      }, 0);

      const orderId = uuidv4();

      // Create order in order_db
      await pool.execute(
        'INSERT INTO orders (id, user_id, total_amount, shipping_address) VALUES (?, ?, ?, ?)',
        [orderId, userId, totalAmount, shipping_address]
      );

      // Create order items
      for (const item of cartItems) {
        const itemId = uuidv4();
        await pool.execute(
          'INSERT INTO order_items (id, order_id, product_id, product_name, price, quantity) VALUES (?, ?, ?, ?, ?, ?)',
          [itemId, orderId, item.product_id, item.product_name, item.product_price, item.quantity]
        );
      }

      // Clear cart in cart_db
      await cartPool.execute('DELETE FROM cart_items WHERE user_id = ?', [userId]);

      res.status(201).json({
        message: 'Order created successfully',
        order_id: orderId,
        total_amount: totalAmount
      });
    } catch (error) {
      console.error('Create order error:', error);
      res.status(500).json({ error: 'Failed to create order' });
    }
  }

  static async getOrders(req, res) {
    try {
      const userId = req.user.id;

      const [orders] = await pool.execute(
        'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC',
        [userId]
      );

      res.json({ orders });
    } catch (error) {
      console.error('Get orders error:', error);
      res.status(500).json({ error: 'Failed to get orders' });
    }
  }

  static async getOrderById(req, res) {
    try {
      const userId = req.user.id;
      const { id } = req.params;

      const [orders] = await pool.execute(
        'SELECT * FROM orders WHERE id = ? AND user_id = ?',
        [id, userId]
      );

      if (orders.length === 0) {
        return res.status(404).json({ error: 'Order not found' });
      }

      const [items] = await pool.execute(
        'SELECT * FROM order_items WHERE order_id = ?',
        [id]
      );

      res.json({
        order: orders[0],
        items
      });
    } catch (error) {
      console.error('Get order error:', error);
      res.status(500).json({ error: 'Failed to get order' });
    }
  }

  static async updateOrderStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const [result] = await pool.execute(
        'UPDATE orders SET status = ? WHERE id = ?',
        [status, id]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Order not found' });
      }

      res.json({ message: 'Order status updated' });
    } catch (error) {
      console.error('Update order status error:', error);
      res.status(500).json({ error: 'Failed to update order status' });
    }
  }
}

module.exports = OrderController;
