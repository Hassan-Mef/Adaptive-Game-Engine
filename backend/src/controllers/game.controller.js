const { sql } = require('../config/db');
const { executeSP } = require('../services/db.service');

exports.recordAttempt = async (req, res) => {
  const { playerId, score, accuracy, timeTaken } = req.body;

  if (
    playerId === undefined ||
    score === undefined ||
    accuracy === undefined ||
    timeTaken === undefined
  ) {
    return res.status(400).json({
      success: false,
      error: 'Missing required fields'
    });
  }

  try {
    const result = await executeSP('sp_RecordAttempt', {
      PlayerID: { type: sql.Int, value: playerId },
      Score: { type: sql.Int, value: score },
      Accuracy: { type: sql.Float, value: accuracy },
      TimeTaken: { type: sql.Float, value: timeTaken }
    });

    res.status(200).json({
      success: true,
      difficulty: result[0]
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};
