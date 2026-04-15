require('dotenv').config();
const { createExpressApp } = require('../shared/express-common');
const { pool, initDatabase } = require('../shared/database');
const authRoutes = require('./routes/auth');

const app = createExpressApp({
  serviceName: 'auth-service',
  pool,
  registerRoutes: (app) => {
    app.use('/api/auth', authRoutes);
  }
});

const PORT = process.env.PORT || 8001;

initDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Auth service running on port ${PORT}`);
  });
}).catch(err => {
  console.error('Failed to start auth service:', err);
  process.exit(1);
});

module.exports = app;
