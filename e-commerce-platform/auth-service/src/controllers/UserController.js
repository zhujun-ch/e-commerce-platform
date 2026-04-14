const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { pool } = require('../config/database');
const { JWT_SECRET } = require('../../src/shared/middleware/AuthMiddleware');

const JWT_EXPIRES_IN = '24h';

class UserController {
  static async register(req, res) {
    try {
      const { email, password, name } = req.body;

      // Check if user exists
      const [existing] = await pool.execute(
        'SELECT id FROM users WHERE email = ?',
        [email]
      );

      if (existing.length > 0) {
        return res.status(400).json({ error: 'Email already registered' });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
      const id = uuidv4();

      // Insert user
      await pool.execute(
        'INSERT INTO users (id, email, password, name) VALUES (?, ?, ?, ?)',
        [id, email, hashedPassword, name || '']
      );

      // Generate token
      const token = jwt.sign({ id, email, role: 'user' }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

      res.status(201).json({
        message: 'User registered successfully',
        token,
        user: { id, email, name, role: 'user' }
      });
    } catch (error) {
      console.error('Register error:', error);
      res.status(500).json({ error: 'Registration failed' });
    }
  }

  static async login(req, res) {
    try {
      const { email, password } = req.body;

      // Find user
      const [users] = await pool.execute(
        'SELECT * FROM users WHERE email = ?',
        [email]
      );

      if (users.length === 0) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const user = users[0];

      // Verify password
      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Generate token
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
      );

      res.json({
        message: 'Login successful',
        token,
        user: { id: user.id, email: user.email, name: user.name, role: user.role }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Login failed' });
    }
  }

  static async getProfile(req, res) {
    try {
      const [users] = await pool.execute(
        'SELECT id, email, name, role, created_at FROM users WHERE id = ?',
        [req.user.id]
      );

      if (users.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json({ user: users[0] });
    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({ error: 'Failed to get profile' });
    }
  }

  static async updateProfile(req, res) {
    try {
      const { name } = req.body;

      await pool.execute(
        'UPDATE users SET name = ? WHERE id = ?',
        [name, req.user.id]
      );

      res.json({ message: 'Profile updated successfully' });
    } catch (error) {
      console.error('Update profile error:', error);
      res.status(500).json({ error: 'Failed to update profile' });
    }
  }

  // Admin: Get all users
  static async getAllUsers(req, res) {
    try {
      const [users] = await pool.execute(
        'SELECT id, email, name, role, created_at FROM users ORDER BY created_at DESC'
      );

      res.json({ users });
    } catch (error) {
      console.error('Get all users error:', error);
      res.status(500).json({ error: 'Failed to get users' });
    }
  }

  // Admin: Update user role
  static async updateUserRole(req, res) {
    try {
      const { id } = req.params;
      const { role } = req.body;

      if (!['user', 'admin'].includes(role)) {
        return res.status(400).json({ error: 'Invalid role' });
      }

      const [result] = await pool.execute(
        'UPDATE users SET role = ? WHERE id = ?',
        [role, id]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json({ message: 'User role updated' });
    } catch (error) {
      console.error('Update user role error:', error);
      res.status(500).json({ error: 'Failed to update user role' });
    }
  }

  // Admin: Delete user
  static async deleteUser(req, res) {
    try {
      const { id } = req.params;

      // Prevent self-deletion
      if (id === req.user.id) {
        return res.status(400).json({ error: 'Cannot delete yourself' });
      }

      const [result] = await pool.execute(
        'DELETE FROM users WHERE id = ?',
        [id]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json({ message: 'User deleted successfully' });
    } catch (error) {
      console.error('Delete user error:', error);
      res.status(500).json({ error: 'Failed to delete user' });
    }
  }
}

module.exports = UserController;
