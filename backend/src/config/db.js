const sql = require('mssql');

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  server: process.env.DB_SERVER,
  port: parseInt(process.env.DB_PORT),
  options: {
    encrypt: false,
    trustServerCertificate: true
  }
};

let poolPromise;

async function connectDB() {
  try {
    const pool = await sql.connect(config);
    console.log('✅ Connected to MS SQL Server');
    poolPromise = pool;
  } catch (err) {
    console.error('❌ DB connection failed:', err.message);
    process.exit(1); // HARD FAIL (correct behavior)
  }
}

// connect immediately
connectDB();

module.exports = {
  sql,
  getPool: () => poolPromise
};
