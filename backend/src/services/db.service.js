const { sql, getPool } = require('../config/db');

/**
 * Generic stored procedure executor
 * Supports INPUT + OUTPUT parameters
 */
async function executeSP(spName, inputs = {}, outputs = {}) {
  const pool = getPool();
  const request = pool.request();

  // Bind INPUT params
  for (const key in inputs) {
    request.input(key, inputs[key].type, inputs[key].value);
  }

  // Bind OUTPUT params
  for (const key in outputs) {
    request.output(key, outputs[key]);
  }

  const result = await request.execute(spName);

  return {
    recordset: result.recordset,
    output: result.output
  };
}

module.exports = { executeSP };
