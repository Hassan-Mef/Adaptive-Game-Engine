const leaderboardService = require("../services/leaderboard.service");

async function getLeaderboard(req, res) {
  try {
    const leaderboard = await leaderboardService.getLeaderboard();
    res.json({
      success: true,
      data: leaderboard,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
}

module.exports = {
  getLeaderboard,
};
