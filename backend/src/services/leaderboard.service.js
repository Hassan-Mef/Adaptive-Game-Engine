const sql = require("mssql");
const { getPool } = require("../config/db");

async function getLeaderboard() {
  const pool = await getPool();

  const result = await pool.request().query(`
    SELECT *
    FROM vw_PlayerLeaderboard
    ORDER BY leaderboard_rank ASC
  `);

  return result.recordset;
}

module.exports = {
  getLeaderboard,
};
