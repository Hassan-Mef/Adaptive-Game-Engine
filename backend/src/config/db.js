const sql = require('mssql');

let pool;

/**
 * Initialize a single MSSQL connection pool
 */
async function initDB() {
  try {
    pool = new sql.ConnectionPool({
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      server: process.env.DB_SERVER,
      database: process.env.DB_NAME,
      port: Number(process.env.DB_PORT),
      options: {
        encrypt: false,
        trustServerCertificate: true
      }
    });

    await pool.connect();

    console.log('✅ MSSQL pool connected');
  } catch (err) {
    console.error('❌ DB connection failed:', err);
    process.exit(1);
  }
}

function getPool() {
  if (!pool) {
    throw new Error('DB not initialized');
  }
  return pool;
}

module.exports = {
  sql,
  initDB,
  getPool
};
