const analyticsService = require("../services/analytics.service");

/**
 * Difficulty history per session
 */
exports.getDifficultyHistory = async (req, res) => {
  console.log("JWT user object:", req.user); // 🔴 ADD THIS

  const playerId = req.user.playerId;

  const data = await analyticsService.fetchDifficultyHistory(playerId);

  res.json({
    success: true,
    data,
  });
};


/**
 * Leaderboard history (ranking snapshots)
 */
exports.getLeaderboardHistory = async (req, res, next) => {
  try {
    const data = await analyticsService.fetchLeaderboardHistory();
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

/**
 * Performance by difficulty level
 */
exports.getLevelPerformance = async (req, res, next) => {
  try {
    const data = await analyticsService.fetchLevelPerformance();
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

/**
 * Global leaderboard
 */
exports.getPlayerLeaderboard = async (req, res, next) => {
  try {
    const data = await analyticsService.fetchPlayerLeaderboard();
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

/**
 * Achievements earned
 */
exports.getPlayerAchievements = async (req, res, next) => {
  try {
    const data = await analyticsService.fetchPlayerAchievements(req.user.player_id);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

/**
 * Advanced performance metrics
 */
exports.getPlayerPerformance = async (req, res, next) => {
  try {
    console.log("JWT user object:", req.user); // 🔴 ADD THIS
    const data = await analyticsService.fetchPlayerPerformance(req.user.player_id);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};
