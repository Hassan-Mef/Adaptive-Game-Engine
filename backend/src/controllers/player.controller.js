const bcrypt = require('bcrypt');
const playerService = require('../services/player.service');

const SALT_ROUNDS = 10;

async function getPlayer(req, res) {
  const { id } = req.params;
  try {
    const player = await playerService.getPlayerById(id);
    res.json({ success: true, data: player });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}
async function createPlayer(req, res) {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({
      success: false,
      error: 'Username, email, and password are required'
    });
  }

  try {
    const passwordHash = await bcrypt.hash(password, 10);

    const result = await playerService.registerPlayer(
      username,
      email,
      passwordHash
    );

    if (!result.new_player_id) {
      return res.status(409).json({
        success: false,
        message: result.status_message
      });
    }

    res.status(201).json({
      success: true,
      playerId: result.new_player_id,
      message: result.status_message
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
}

async function login(req, res) {
  try {
    const { username, password } = req.body;

    const result = await playerService.loginPlayer(username, password);

    res.json({
      success: true,
      playerId: result.playerId
    });
  } catch (err) {
    res.status(401).json({
      success: false,
      error: err.message
    });
  }
}


module.exports = {
  getPlayer,
  createPlayer,
  login
};