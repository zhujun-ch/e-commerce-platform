require('dotenv').config();
const { createExpressApp } = require('../shared/express-common');
const { pool, initDatabase } = require('../shared/database');
const productRoutes = require('./routes/product');

const app = createExpressApp({
  serviceName: 'product-service',
  pool,
  registerRoutes: (app) => {
    app.use('/api/products', productRoutes);
  }
});

const PORT = process.env.PORT || 8002;

initDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Product service running on port ${PORT}`);
  });
}).catch(err => {
  console.error('Failed to start product service:', err);
  process.exit(1);
});

module.exports = app;
