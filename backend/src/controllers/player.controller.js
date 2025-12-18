const { sql } = require('../config/db');
const { executeSP } = require('../services/db.service');

exports.getPlayerById = async (req, res) => {
  const { id } = req.params;

  try {
    const data = await executeSP('sp_GetPlayerById', {
      PlayerID: { type: sql.Int, value: id }
    });

    res.status(200).json({
      success: true,
      data
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};
