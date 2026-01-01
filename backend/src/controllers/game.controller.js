const gameService = require("../services/game.service");

async function startSession(req, res) {
  const playerId = req.user.playerId;

  const attemptId = await gameService.startGameSession(playerId);

  res.json({
    success: true,
    sessionId: attemptId,
  });
}

async function logRound(req, res) {
  try {
    await gameService.logSessionRound(req.body);

    res.json({
      success: true
    });
  } catch (err) {
    console.error("[LOG ROUND ERROR]", err);
    res.status(500).json({
      success: false,
      error: err.message
    });
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
    const playerId = req.user.playerId;

    if (!playerId) {
      return res.status(400).json({
        success: false,
        error: "playerId is required",
      });
    }

    const state = await gameService.getSessionEntryDifficulty(Number(playerId));

    res.json({
      success: true,
      data: {
        hasHistory: state.HasHistory,
        difficultyScore: state.DifficultyScore,
        recommendedLevelId: state.RecommendedLevelID,
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
}

/**
 * Get session summary
 */

async function getSessionSummary(req, res) {
  try {
    const { attemptId } = req.params;

    const summary = await gameService.getSessionSummary(attemptId);

    if (!summary) {
      return res.status(404).json({
        success: false,
        error: "Session not found",
      });
    }

    res.json({
      success: true,
      data: summary,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
}

module.exports = {
  startSession,
  logRound,
  endSession,
  getSessionEntryState,
  getSessionSummary,
};
