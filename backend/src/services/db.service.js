const { sql, getPool } = require('../config/db');

async function executeSP(spName, inputs = {}) {
  const pool = getPool();

  if (!pool) {
    throw new Error('Database pool not initialized');
  }

  const request = pool.request();

  for (const key in inputs) {
    const { type, value } = inputs[key];
    request.input(key, type, value);
  }

  const result = await request.execute(spName);
  return result.recordset;
}

module.exports = {
  executeSP
};
