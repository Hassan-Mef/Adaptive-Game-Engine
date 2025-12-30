export function evaluateAchievements({
  liveStats = {},
  difficulty = { tier: "UNKNOWN" },
  promoted = false,
  livesCompleted = 0,
} = {}) {
  const achievements = [];

  const shotsHit = liveStats.shotsHit ?? 0;
  const shotsFired = liveStats.shotsFired ?? 0;

  const accuracy = shotsHit / Math.max(shotsFired, 1);

  if (shotsHit >= 20) {
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
