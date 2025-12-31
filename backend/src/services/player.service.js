const bcrypt = require('bcrypt');
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

async function loginPlayer(username, password) {
  const result = await executeSP(
    'sp_LoginPlayer',
    {
      username: { type: sql.VarChar(50), value: username }
    }
  );

  if (!result.recordset || result.recordset.length === 0) {
    throw new Error('Invalid username or password');
  }

  const player = result.recordset[0];

  const passwordMatch = await bcrypt.compare(password, player.password_hash);

  if (!passwordMatch) {
    throw new Error('Invalid username or password');
  }

  return {
    playerId: player.player_id
  };
}

module.exports = {
  getPlayerById,
  registerPlayer,
  loginPlayer   
};

