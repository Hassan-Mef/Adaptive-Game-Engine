const { sql, getPool } = require('../config/db');

/**
 * Execute stored procedure with input & output parameters
 */
async function executeSP(spName, inputs = {}, outputs = {}) {
  const pool = getPool();
  const request = pool.request();

  // Bind INPUT parameters
  for (const key in inputs) {
    const { type, value } = inputs[key];
    request.input(key, type, value);
  }

  // Bind OUTPUT parameters
  for (const key in outputs) {
    const type = outputs[key];
    request.output(key, type);
  }

  const result = await request.execute(spName);

  return {
    recordset: result.recordset,
    output: result.output
  };
}

module.exports = {
  executeSP
};
