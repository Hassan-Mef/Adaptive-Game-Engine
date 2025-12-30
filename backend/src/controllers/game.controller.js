const gameService = require('../services/game.service');

async function startSession(req, res) {
  const { playerId } = req.body;

  const session = await gameService.startGameSession(playerId);

  res.json({
    success: true,
    sessionId: session.SessionID,
  });
}

async function logRound(req, res) {
  const { sessionId, shotsFired, hits, score, reactionTime, difficulty } = req.body;
  try {
    const result = await gameService.logRound(sessionId, { shotsFired, hits, score, reactionTime, difficulty });
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

module.exports = { startSession, logRound, endSession };
