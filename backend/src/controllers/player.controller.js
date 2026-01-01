const bcrypt = require("bcrypt");
const playerService = require("../services/player.service");
const jwt = require("jsonwebtoken");

const SALT_ROUNDS = 10;

async function getPlayer(req, res) {
  const { id } = req.params;
  try {
    const player = await playerService.getPlayerStats(id);
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
      error: "Username, email, and password are required",
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
        message: result.status_message,
      });
    }

    res.status(201).json({
      success: true,
      playerId: result.new_player_id,
      message: result.status_message,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
}

async function login(req, res) {
  try {
    const { username, password } = req.body;

    const result = await playerService.loginPlayer(username, password);

    // 🔐 Create JWT
    const token = jwt.sign(
      {
        playerId: result.playerId,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN || "1d",
      }
    );

    res.json({
      success: true,
      token,
      user: {
        id: result.playerId,
        username: result.username,
      },
    });
  } catch (err) {
    res.status(401).json({
      success: false,
      error: err.message,
    });
  }
}

/**
 * Get player dashboard statistics
 */
async function getPlayerStats(req, res) {
  const { id } = req.params;

  try {
    const stats = await playerService.getPlayerStats(id);

    if (!stats) {
      return res.status(404).json({
        success: false,
        error: "Player stats not found",
      });
    }

    res.json({
      success: true,
      data: stats,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
}

module.exports = {
  getPlayer,
  createPlayer,
  login,
  getPlayerStats,
};
