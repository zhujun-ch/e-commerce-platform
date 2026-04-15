/**
 * Common Express boilerplate factory for microservices
 * Extracts shared middleware and configuration from all 5 services
 */

const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

/**
 * Creates a configured Express application with common middleware
 * @param {Object} options - Configuration options
 * @param {string} options.serviceName - Service name for health check
 * @param {Object} options.pool - Database pool for graceful shutdown
 * @param {Function} [options.registerRoutes] - Optional function to register custom routes (receives app)
 * @returns {Object} - Configured Express app
 */
function createExpressApp(options) {
  const { serviceName, pool, registerRoutes, preMiddleware = [] } = options;
  const app = express();

  // Request logging middleware
  app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
  });

  // Pre-middleware (e.g., express.raw() for Stripe webhooks)
  preMiddleware.forEach(mw => app.use(mw));

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

  // Register custom routes if provided
  if (registerRoutes && typeof registerRoutes === 'function') {
    registerRoutes(app);
  }

  // Health check endpoint
  app.get('/health', (req, res) => {
    res.json({ status: 'ok', service: serviceName });
  });

  // Graceful shutdown handlers
  if (pool) {
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
  }

  return app;
}

module.exports = { createExpressApp };
