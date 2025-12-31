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

  // ✅ READ OUTPUT PARAM
  return result.output.attempt_id;
}


/**
 * Log a single round inside a session
 * Matches sp_LogSessionRound EXACTLY
 */
async function logSessionRound(roundData) {
  await executeSP(
    'sp_LogSessionRound',
    {
      attempt_id:           { type: sql.Int,   value: roundData.attemptId },
      round_index:          { type: sql.Int,   value: roundData.roundIndex },
      difficulty_tier:      { type: sql.VarChar(10), value: roundData.difficultyTier },
      difficulty_sublevel:  { type: sql.Float, value: roundData.difficultySublevel },
      accuracy:             { type: sql.Float, value: roundData.accuracy },
      shots_fired:          { type: sql.Int,   value: roundData.shotsFired },
      shots_hit:            { type: sql.Int,   value: roundData.shotsHit },
      avg_reaction_time:    { type: sql.Float, value: roundData.avgReactionTime },
      round_duration:       { type: sql.Float, value: roundData.roundDuration }
    }
  );
}

/**
 * End a game session
 * Aggregates session stats from Session_Rounds
 */
async function endGameSession(attemptId) {
  await executeSP(
    'sp_EndGameSession',
    {
      attempt_id: { type: sql.Int, value: attemptId }
    }
  );
}


/**
 * Get session entry difficulty state
 * Used at game start
 */
async function getSessionEntryDifficulty(playerId) {
  const result = await executeSP(
    'sp_RecommendDifficultyLevel',
    {
      PlayerID: { type: sql.Int, value: playerId }
    },
    {
      HasHistory: sql.Bit,
      DifficultyScore: sql.Int,
      RecommendedLevelID: sql.Int
    }
  );

  return result.output;
}

/** Get session summary */

async function getSessionSummary(attemptId) {
  const result = await executeSP(
    'sp_GetSessionSummary',
    {
      attempt_id: { type: sql.Int, value: attemptId }
    }
  );

  return result.recordset[0];
}



module.exports = {
  startGameSession,
  logSessionRound,
  endGameSession,
  getSessionEntryDifficulty,
  getSessionSummary
};
