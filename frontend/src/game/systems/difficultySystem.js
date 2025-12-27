export const DIFFICULTY = {
  EASY: "EASY",
  MEDIUM: "MEDIUM",
  HARD: "HARD",
};

/**
 * Evaluate player performance from calibration round
 * @param {Object} stats
 * @param {number} stats.shotsFired
 * @param {number} stats.shotsHit
 * @param {number} duration - calibration duration in seconds
 */
export function evaluateDifficulty(stats, duration = 20) {
  const accuracy =
    stats.shotsHit / Math.max(stats.shotsFired, 1);

  const shotsPerSecond = stats.shotsHit / duration;
  const reactionMedian = median(stats.reactionTimes || []);

  const tier = enforceDifficulty({ accuracy, shotsPerSecond });
  let subLevel = 0;
  console.log(" logs from evaluateDifficulty to verify subLevel initialization ", subLevel);

  return {
    tier,
    subLevel,
    accuracy,
    shotsPerSecond,
    reactionMedian,
  };
}

/**
 * Convert difficulty tier into gameplay parameters
 */
export function getDifficultyProfile(tier) {
  switch (tier) {
    case DIFFICULTY.HARD:
      return {
        targetScale: 0.6,
        spawnInterval: 1.2,
        despawnTime: 2.0,
        movementSpeed: 2.5,
        movingTargets: true,
      };

    case DIFFICULTY.MEDIUM:
      return {
        targetScale: 0.8,
        spawnInterval: 1.6,
        despawnTime: 3.5,
        movementSpeed: 1.2,
        movingTargets: false,
      };

    case DIFFICULTY.EASY:
    default:
      return {
        targetScale: 1.0,
        spawnInterval: 2.2,
        despawnTime: null, // no despawn
        movementSpeed: 0,
        movingTargets: false,
      };
  }
}

export function enforceDifficulty(stats) {
  const { accuracy, shotsPerSecond } = stats;

  if (accuracy < 0.3 || shotsPerSecond < 1.2) {
    return "EASY";
  }

  if (
    accuracy >= 0.3 &&
    accuracy <= 0.6 &&
    shotsPerSecond >= 1.2 &&
    shotsPerSecond <= 2.5
  ) {
    return "MEDIUM";
  }

  if (accuracy > 0.6 && shotsPerSecond > 2.5) {
    return "HARD";
  }

  return "MEDIUM";
}

function median(values) {
  if (!values.length) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}
