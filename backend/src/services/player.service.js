const sql = require('mssql');
const { executeSP } = require('./db.service');

async function registerPlayer(username, email, passwordHash) {
  const result = await executeSP(
    'sp_RegisterPlayer',
    {
      username: { type: sql.VarChar(50), value: username },
      email: { type: sql.VarChar(100), value: email },
      password_hash: { type: sql.VarChar(255), value: passwordHash }
    },
    {
      new_player_id: sql.Int,
      status_message: sql.VarChar(100)
    }
  );

  return result.output;
}

async function getPlayerById(playerId) {
  const result = await executeSP(
    'sp_GetPlayerStats',
    {
      PlayerID: { type: sql.Int, value: playerId }
    }
  );

  return result.recordset;
}

module.exports = {
  registerPlayer,
  getPlayerById
};
