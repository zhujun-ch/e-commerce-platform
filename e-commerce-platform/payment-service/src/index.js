require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const paymentRoutes = require('./routes/payment');
const { pool, initDatabase } = require('./config/database');

const app = express();
const PORT = process.env.PORT || 8005;

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Rate limiting - 100 requests per minute per IP
const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// Middleware
app.use(cors());
app.use(express.json());

// Webhook needs raw body (before rate limiting since webhooks come from Stripe)
app.use('/api/payments/webhook', express.raw({ type: 'application/json' }));

// Routes
app.use('/api/payments', paymentRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'payment-service' });
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, closing gracefully...');
  await pool.end();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT received, closing gracefully...');
  await pool.end();
  process.exit(0);
});

// Initialize database and start server
initDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Payment service running on port ${PORT}`);
  });
}).catch(err => {
  console.error('Failed to start payment service:', err);
  process.exit(1);
});

module.exports = app;
