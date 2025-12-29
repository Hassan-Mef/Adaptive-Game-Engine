export function evaluateAchievements({
  liveStats,
  difficulty,
  promoted,
  livesCompleted,
}) {
  const achievements = [];

  const accuracy =
    liveStats.shotsHit / Math.max(liveStats.shotsFired, 1);

  if (liveStats.shotsHit >= 20) {
    achievements.push("Warmup Complete");
  }

  if (accuracy >= 0.8) {
    achievements.push("Sharpshooter");
  }

  if (promoted) {
    achievements.push(`Promoted to ${difficulty.tier}`);
  }

  if (livesCompleted === 3) {
    achievements.push("3 Rounds Survived");
  }

  return achievements;
}
