const { v4: uuidv4 } = require('uuid');
const { pool } = require('../config/database');

class ProductController {
  static async getAllProducts(req, res) {
    try {
      const { category, search, page = 1, limit = 20 } = req.query;
      const pageNum = parseInt(page, 10);
      const limitNum = parseInt(limit, 10);
      const offset = (pageNum - 1) * limitNum;

      let query = 'SELECT * FROM products WHERE 1=1';
      const params = [];

      if (category) {
        query += ' AND category = ?';
        params.push(category);
      }

      if (search) {
        query += ' AND (name LIKE ? OR description LIKE ?)';
        params.push(`%${search}%`, `%${search}%`);
      }

      // Get total count
      const [countResult] = await pool.execute(
        query.replace('SELECT *', 'SELECT COUNT(*) as total'),
        params
      );
      const total = countResult[0].total;

      // Get paginated results
      query += ` ORDER BY created_at DESC LIMIT ${limitNum} OFFSET ${offset}`;

      const [products] = await pool.execute(query, params);

      res.json({
        products,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          pages: Math.ceil(total / limitNum)
        }
      });
    } catch (error) {
      console.error('Get products error:', error);
      res.status(500).json({ error: 'Failed to get products' });
    }
  }

  static async getProductById(req, res) {
    try {
      const { id } = req.params;

      const [products] = await pool.execute(
        'SELECT * FROM products WHERE id = ?',
        [id]
      );

      if (products.length === 0) {
        return res.status(404).json({ error: 'Product not found' });
      }

      res.json({ product: products[0] });
    } catch (error) {
      console.error('Get product error:', error);
      res.status(500).json({ error: 'Failed to get product' });
    }
  }

  static async createProduct(req, res) {
    try {
      const { name, description, price, category, image_url, stock = 0 } = req.body;

      const id = uuidv4();

      await pool.execute(
        `INSERT INTO products (id, name, description, price, category, image_url, stock)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [id, name, description || null, price, category || null, image_url || null, stock]
      );

      const [product] = await pool.execute('SELECT * FROM products WHERE id = ?', [id]);

      res.status(201).json({
        message: 'Product created successfully',
        product: product[0]
      });
    } catch (error) {
      console.error('Create product error:', error);
      res.status(500).json({ error: 'Failed to create product' });
    }
  }

  static async updateProduct(req, res) {
    try {
      const { id } = req.params;
      const updates = req.body;

      // Check if product exists
      const [existing] = await pool.execute('SELECT id FROM products WHERE id = ?', [id]);
      if (existing.length === 0) {
        return res.status(404).json({ error: 'Product not found' });
      }

      // Build update query dynamically
      const fields = [];
      const values = [];

      for (const [key, value] of Object.entries(updates)) {
        if (['name', 'description', 'price', 'category', 'image_url', 'stock'].includes(key)) {
          fields.push(`${key} = ?`);
          values.push(value);
        }
      }

      if (fields.length > 0) {
        values.push(id);
        await pool.execute(
          `UPDATE products SET ${fields.join(', ')} WHERE id = ?`,
          values
        );
      }

      const [product] = await pool.execute('SELECT * FROM products WHERE id = ?', [id]);

      res.json({
        message: 'Product updated successfully',
        product: product[0]
      });
    } catch (error) {
      console.error('Update product error:', error);
      res.status(500).json({ error: 'Failed to update product' });
    }
  }

  static async deleteProduct(req, res) {
    try {
      const { id } = req.params;

      const [result] = await pool.execute('DELETE FROM products WHERE id = ?', [id]);

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Product not found' });
      }

      res.json({ message: 'Product deleted successfully' });
    } catch (error) {
      console.error('Delete product error:', error);
      res.status(500).json({ error: 'Failed to delete product' });
    }
  }
}

module.exports = ProductController;
