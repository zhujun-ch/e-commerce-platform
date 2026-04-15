const { v4: uuidv4 } = require('uuid');
const axios = require('axios');
const mysql = require('mysql2/promise');
const { pool } = require('../config/database');
const { SERVICES } = require('../../src/shared/config/services');

// Create separate connection pool for cart_db to read cart items
const cartPool = mysql.createPool({
  host: process.env.CART_DB_HOST || process.env.DB_HOST || 'localhost',
  user: process.env.CART_DB_USER || process.env.DB_USER || 'root',
  password: process.env.CART_DB_PASSWORD || process.env.DB_PASSWORD || '',
  database: process.env.CART_DB_NAME || 'cart_db',
  waitForConnections: true,
  connectionLimit: 5,
  queueLimit: 0
});

class OrderController {
  static async createOrder(req, res) {
    const connection = await pool.getConnection();
    try {
      const userId = req.user.id;
      const { shipping_address } = req.body;

      // Get cart items from cart_db
      const [cartItems] = await cartPool.execute(
        'SELECT product_id, quantity FROM cart_items WHERE user_id = ?',
        [userId]
      );

      if (cartItems.length === 0) {
        connection.release();
        return res.status(400).json({ error: 'Cart is empty' });
      }

      // Fetch real-time product info and prices from product-service
      let totalAmount = 0;
      const itemsWithPrice = [];
      for (const item of cartItems) {
        try {
          const response = await axios.get(`${SERVICES.product.internalUrl}/api/products/${item.product_id}`);
          const product = response.data.product;
          const currentPrice = parseFloat(product.price);
          totalAmount += currentPrice * item.quantity;
          itemsWithPrice.push({
            product_id: item.product_id,
            product_name: product.name,
            currentPrice,
            quantity: item.quantity
          });
        } catch (apiError) {
          console.error(`Failed to fetch price for product ${item.product_id}:`, apiError);
          connection.release();
          return res.status(500).json({ error: `Failed to fetch price for product ${item.product_id}` });
        }
      }

      const orderId = uuidv4();

      // Begin transaction
      await connection.beginTransaction();

      // Create order in order_db using the same connection
      await connection.execute(
        'INSERT INTO orders (id, user_id, total_amount, shipping_address) VALUES (?, ?, ?, ?)',
        [orderId, userId, totalAmount, shipping_address]
      );

      // Create order items using the same connection with real-time prices
      for (const item of itemsWithPrice) {
        const itemId = uuidv4();
        await connection.execute(
          'INSERT INTO order_items (id, order_id, product_id, product_name, price, quantity) VALUES (?, ?, ?, ?, ?, ?)',
          [itemId, orderId, item.product_id, item.product_name, item.currentPrice, item.quantity]
        );
      }

      // Commit transaction
      await connection.commit();

      // Clear cart in cart_db (separate database, outside transaction)
      await cartPool.execute('DELETE FROM cart_items WHERE user_id = ?', [userId]);

      res.status(201).json({
        message: 'Order created successfully',
        order_id: orderId,
        total_amount: totalAmount
      });
    } catch (error) {
      // Rollback transaction on error
      await connection.rollback();
      console.error('Create order error:', error);
      res.status(500).json({ error: 'Failed to create order' });
    } finally {
      // Always release the connection
      connection.release();
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

  // Admin: Get all orders with user info
  static async getAllOrders(req, res) {
    try {
      // Get all orders
      const [orders] = await pool.execute(`
        SELECT * FROM orders ORDER BY created_at DESC
      `);

      // Get order items for each order
      const ordersWithItems = await Promise.all(orders.map(async (order) => {
        const [items] = await pool.execute(
          'SELECT * FROM order_items WHERE order_id = ?',
          [order.id]
        );
        return {
          ...order,
          user_name: 'User', // Placeholder - user info requires separate auth service query
          items
        };
      }));

      res.json({ orders: ordersWithItems });
    } catch (error) {
      console.error('Get all orders error:', error);
      res.status(500).json({ error: 'Failed to get orders' });
    }
  }
}

module.exports = OrderController;
