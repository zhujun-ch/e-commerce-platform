require('dotenv').config();
const express = require('express');
const { createExpressApp } = require('../shared/express-common');
const { pool, initDatabase } = require('../shared/database');
const paymentRoutes = require('./routes/payment');

// Webhook needs raw body BEFORE json() parser - Stripe webhooks require raw body for signature verification
const webhookRawBody = express.raw({ type: 'application/json' });

const app = createExpressApp({
  serviceName: 'payment-service',
  pool,
  preMiddleware: [
    (req, res, next) => {
      // Only apply raw body to webhook route
      if (req.path === '/api/payments/webhook') {
        return webhookRawBody(req, res, next);
      }
      next();
    }
  ],
  registerRoutes: (app) => {
    app.use('/api/payments', paymentRoutes);
  }
});

const PORT = process.env.PORT || 8005;

initDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Payment service running on port ${PORT}`);
  });
}).catch(err => {
  console.error('Failed to start payment service:', err);
  process.exit(1);
});

module.exports = app;
