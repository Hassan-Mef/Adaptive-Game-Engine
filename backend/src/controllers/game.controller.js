const {poolPromise , sql } = require('../config/db');

exports.recordAttempt = async (req, res) => {
  const { playerId, score, accuracy, timeTaken } = req.body;

    // Basic validation
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
    const pool = await poolPromise;

    const result = await pool
      .request()
      .input('PlayerID', sql.Int, playerId)
      .input('Score', sql.Int, score)
      .input('Accuracy', sql.Float, accuracy)
      .input('TimeTaken', sql.Float, timeTaken)
      .execute('sp_RecordAttempt');

    res.status(200).json({
      success: true,
      difficulty: result.recordset[0]
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};