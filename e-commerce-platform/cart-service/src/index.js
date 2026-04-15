require('dotenv').config();
const { createExpressApp } = require('../shared/express-common');
const { pool, initDatabase } = require('../shared/database');
const cartRoutes = require('./routes/cart');

const app = createExpressApp({
  serviceName: 'cart-service',
  pool,
  registerRoutes: (app) => {
    app.use('/api/cart', cartRoutes);
  }
});

const PORT = process.env.PORT || 8003;

initDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Cart service running on port ${PORT}`);
  });
}).catch(err => {
  console.error('Failed to start cart service:', err);
  process.exit(1);
});

module.exports = app;
