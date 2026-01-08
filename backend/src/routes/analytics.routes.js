const express = require("express");
const router = express.Router();

const authenticateToken = require("../middlewares/auth.middleware");
const analyticsController = require("../controllers/analytics.controller");

// All analytics routes are PROTECTED (dashboard is user-only)
router.use(authenticateToken);

/**
 * Analytics Dashboard APIs
 */
router.get("/difficulty-history", analyticsController.getDifficultyHistory);
router.get("/leaderboard-history", analyticsController.getLeaderboardHistory);
router.get("/level-performance", analyticsController.getLevelPerformance);
router.get("/player-leaderboard", analyticsController.getPlayerLeaderboard);
router.get("/player-achievements", analyticsController.getPlayerAchievements);
router.get("/player-performance", analyticsController.getPlayerPerformance);

module.exports = router;
