// const { poolPromise } = require('../config/db');

// exports.getPlayerById = async (req, res) => {
//   const { id } = req.params;

//   try {
//     const pool = await poolPromise;

//     // TEMP query (we will replace with SP)
//     const result = await pool
//       .request()
//       .input('PlayerID', id)
//       .query('SELECT @PlayerID AS PlayerID');

//     res.status(200).json({
//       success: true,
//       data: result.recordset
//     });

//   } catch (err) {
//     res.status(500).json({
//       success: false,
//       error: err.message
//     });
//   }
// };



const { poolPromise, sql } = require('../config/db');

exports.getPlayerById = async (req, res) => {
  const { id } = req.params;

  try {
    const pool = await poolPromise;

    const result = await pool
      .request()
      .input('PlayerID', sql.Int, id)
      .execute('sp_GetPlayerById');

    res.status(200).json({
      success: true,
      data: result.recordset
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};
