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
  const { shotsFired, shotsHit } = stats;

  // Safety guards
  if (shotsFired === 0) {
    return {
      tier: DIFFICULTY.EASY,
      accuracy: 0,
      shotsPerSecond: 0,
    };
  }

  const accuracy = shotsHit / shotsFired;
  const shotsPerSecond = shotsHit / duration;

  // HARD check
  if (accuracy > 0.1 && shotsPerSecond > 0.5) {
    return {
      tier: DIFFICULTY.HARD,
      accuracy,
      shotsPerSecond,
    };
  }

  // MEDIUM check
  if (
    accuracy >= 0.3 &&
    accuracy <= 0.6 &&
    shotsPerSecond >= 1.2 &&
    shotsPerSecond <= 2.5
  ) {
    return {
      tier: DIFFICULTY.MEDIUM,
      accuracy,
      shotsPerSecond,
    };
  }

  // EASY fallback
  return {
    tier: DIFFICULTY.EASY,
    accuracy,
    shotsPerSecond,
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
