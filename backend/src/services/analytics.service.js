const { getPool } = require("../config/db");


/**
 * Read-only Analytics Service
 * Uses SQL VIEWS only
 */

exports.fetchDifficultyHistory = async (playerId) => {
  const pool = await getPool();

  const result = await pool
    .request()
    .input("playerId", playerId)
    .query(`
      SELECT *
      FROM vw_DifficultyHistory
      WHERE player_id = @playerId
      ORDER BY session_start DESC
    `);

  return result.recordset;
};

exports.fetchLeaderboardHistory = async () => {
  const pool = await getPool();

  const result = await pool.request().query(`
    SELECT *
    FROM vw_LeaderboardHistory
    ORDER BY log_timestamp DESC
  `);

  return result.recordset;
};

exports.fetchLevelPerformance = async () => {
  const pool = await getPool();

  const result = await pool.request().query(`
    SELECT *
    FROM vw_LevelPerformanceOverview
    ORDER BY difficulty_level
  `);

  return result.recordset;
};

exports.fetchPlayerLeaderboard = async () => {
  const pool = await getPool();

  const result = await pool.request().query(`
    SELECT *
    FROM vw_PlayerLeaderboard
    ORDER BY leaderboard_rank
  `);

  return result.recordset;
};

exports.fetchPlayerAchievements = async (playerId) => {
  const pool = await getPool();

  const result = await pool
    .request()
    .input("playerId", playerId)
    .query(`
      SELECT *
      FROM vw_PlayerAchievements
      WHERE username = (
        SELECT username FROM Players WHERE player_id = @playerId
      )
      ORDER BY earned_date DESC
    `);

  return result.recordset;
};

exports.fetchPlayerPerformance = async (playerId) => {
  const pool = await getPool();

  const result = await pool
    .request()
    .input("playerId", playerId)
    .query(`
      SELECT *
      FROM vw_PlayerPerformanceSummary
      WHERE username = (
        SELECT username FROM Players WHERE player_id = @playerId
      )
      ORDER BY session_end DESC
    `);

  return result.recordset;
};
