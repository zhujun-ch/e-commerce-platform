const mysql = require('mysql2/promise');

/**
 * Creates a database pool and initialization function for a microservice
 * @param {string} serviceName - The service name used to determine DB name (e.g., 'auth', 'cart')
 * @param {Object} options - Configuration overrides
 * @param {string} [options.host] - Database host
 * @param {string} [options.user] - Database user
 * @param {string} [options.password] - Database password
 * @param {string} [options.database] - Override database name (defaults to ${serviceName}_db)
 * @param {number} [options.connectionLimit] - Connection pool size
 * @returns {Object} { pool, initDatabase }
 */
function createDatabasePool(serviceName, options = {}) {
  const database = options.database || `${serviceName}_db`;

  const pool = mysql.createPool({
    host: options.host || process.env.DB_HOST || 'localhost',
    user: options.user || process.env.DB_USER || 'root',
    password: options.password || process.env.DB_PASSWORD || '',
    database: database,
    waitForConnections: true,
    connectionLimit: options.connectionLimit || 10,
    queueLimit: 0
  });

  /**
   * Initializes database tables by executing the provided SQL
   * @param {string} tableCreationSQL - SQL statement(s) to create tables
   */
  async function initDatabase(tableCreationSQL) {
    if (!tableCreationSQL) {
      console.log('No table creation SQL provided, skipping table initialization');
      return;
    }

    const connection = await pool.getConnection();
    try {
      await connection.execute(tableCreationSQL);
      console.log(`Database ${database} tables initialized`);
    } finally {
      connection.release();
    }
  }

  return { pool, initDatabase };
}

module.exports = { createDatabasePool };
