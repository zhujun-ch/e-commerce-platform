require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cartRoutes = require('./routes/cart');
const { initDatabase } = require('./config/database');

const app = express();
const PORT = process.env.PORT || 8003;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/cart', cartRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'cart-service' });
});

// Initialize database and start server
initDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Cart service running on port ${PORT}`);
  });
}).catch(err => {
  console.error('Failed to start cart service:', err);
  process.exit(1);
});

module.exports = app;
