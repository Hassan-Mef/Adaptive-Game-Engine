const gameService = require('../services/game.service');

/**
 * Start a new game session
 * Returns attemptId
 */
async function startSession(req, res) {
  try {
    const { playerId } = req.body;

    const attemptId = await gameService.startGameSession(playerId);

    res.json({
      success: true,
      attemptId
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}


/**
 * Log a single round
 */
async function logRound(req, res) {
  try {
    const {
      attemptId,
      roundIndex,
      difficultyTier,
      difficultySublevel,
      accuracy,
      shotsFired,
      shotsHit,
      avgReactionTime,
      roundDuration
    } = req.body;

    await gameService.logSessionRound({
      attemptId,
      roundIndex,
      difficultyTier,
      difficultySublevel,
      accuracy,
      shotsFired,
      shotsHit,
      avgReactionTime,
      roundDuration
    });

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

/**
 * End a game session
 */
async function endSession(req, res) {
  try {
    const { attemptId } = req.body;

    await gameService.endGameSession(attemptId);

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

module.exports = {
  startSession,
  logRound,
  endSession
};
