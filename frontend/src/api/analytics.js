import api from "./API"; // your axios instance with JWT

export const getDifficultyHistory = () =>
  api.get("/analytics/difficulty-history");

export const getLevelPerformance = () =>
  api.get("/analytics/level-performance");

export const getPlayerPerformance = () =>
  api.get("/analytics/player-performance");

export const getPlayerAchievements = () =>
  api.get("/analytics/achievements");

export const getPlayerLeaderboard = () =>
  api.get("/analytics/player-leaderboard");
