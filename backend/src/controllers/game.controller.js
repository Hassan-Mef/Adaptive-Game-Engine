const gameService = require("../services/game.service");

async function startSession(req, res) {
  const { playerId } = req.body;

  const session = await gameService.startGameSession(playerId);

  res.json({
    success: true,
    sessionId: session.SessionID,
  });
}

async function logRound(req, res) {
  const { sessionId, shotsFired, hits, score, reactionTime, difficulty } =
    req.body;
  try {
    const result = await gameService.logRound(sessionId, {
      shotsFired,
      hits,
      score,
      reactionTime,
      difficulty,
    });
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

async function endSession(req, res) {
  const { sessionId } = req.body;
  try {
    const result = await gameService.endGameSession(sessionId);
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}
/**
 * Get session entry difficulty state
 * Called BEFORE starting a session
 */
async function getSessionEntryState(req, res) {
  try {
    const { playerId } = req.params;

    if (!playerId) {
      return res.status(400).json({
        success: false,
        error: 'playerId is required'
      });
    }

    const state = await gameService.getSessionEntryDifficulty(Number(playerId));

    res.json({
      success: true,
      data: {
        hasHistory: state.HasHistory,
        difficultyScore: state.DifficultyScore,
        recommendedLevelId: state.RecommendedLevelID
      }
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
}


module.exports = {
  startSession,
  logRound,
  endSession,
  getSessionEntryState,
};
