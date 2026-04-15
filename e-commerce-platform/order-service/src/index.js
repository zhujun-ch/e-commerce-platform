require('dotenv').config();
const { createExpressApp } = require('../shared/express-common');
const { pool, initDatabase } = require('../shared/database');
const orderRoutes = require('./routes/order');

const app = createExpressApp({
  serviceName: 'order-service',
  pool,
  registerRoutes: (app) => {
    app.use('/api/orders', orderRoutes);
  }
});

const PORT = process.env.PORT || 8004;

initDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Order service running on port ${PORT}`);
  });
}).catch(err => {
  console.error('Failed to start order service:', err);
  process.exit(1);
});

module.exports = app;
