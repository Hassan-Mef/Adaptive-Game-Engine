const sql = require('mssql');
const { executeSP } = require('./db.service');

/**
 * Start a new game session
 * Locks difficulty at session start
 */
async function startGameSession(playerId) {
  const result = await executeSP(
    'sp_StartGameSession',
    {
      player_id: { type: sql.Int, value: playerId }
    },
    {
      attempt_id: sql.Int
    }
  );

  return result.output;
}

/**
 * Log a single round inside a session
 */
async function logSessionRound(roundData) {
  await executeSP(
    'sp_LogSessionRound',
    {
      SessionID: { type: sql.Int, value: roundData.sessionId },
      ShotsFired: { type: sql.Int, value: roundData.shotsFired },
      Hits: { type: sql.Int, value: roundData.hits },
      Score: { type: sql.Int, value: roundData.score },
      ReactionTime: { type: sql.Float, value: roundData.reactionTime },
      Difficulty: { type: sql.VarChar(20), value: roundData.difficulty }
    }
  );
}

/**
 * End a game session
 * Triggers difficulty recalculation
 */
async function endGameSession(sessionId) {
  await executeSP(
    'sp_EndGameSession',
    {
      SessionID: { type: sql.Int, value: sessionId }
    }
  );
}

module.exports = {
  startGameSession,
  logSessionRound,
  endGameSession
};
