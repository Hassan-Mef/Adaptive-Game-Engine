import { DIFFICULTY } from "./difficultySystem";

/* ---------------- CONFIG ---------------- */

const MAX_SUBLEVEL = {
  EASY: 3,
  MEDIUM: 3,
  HARD: 2, // no progression beyond HARD (for now)
};

// thresholds for improvement
const IMPROVEMENT_THRESHOLDS = {
  accuracyUp: 0.05,        // +5%
  shotsPerSecondUp: 0.3,  // noticeable speed increase
};

/* ---------------- HELPERS ---------------- */

function median(values = []) {
  if (!values.length) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2
    ? sorted[mid]
    : (sorted[mid - 1] + sorted[mid]) / 2;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(value, max));
}

/* ---------------- MAIN EVALUATOR ---------------- */

export function evaluateLiveDifficulty(
  previousDifficulty,
  sessionStats,
  previousSessionStats = null
) {
  const { tier, subLevel } = previousDifficulty;

  /* --- Compute current metrics --- */
  const accuracy =
    sessionStats.shotsHit /
    Math.max(sessionStats.shotsFired, 1);

  const shotsPerSecond =
    sessionStats.shotsHit / sessionStats.duration;

  const reactionMedian = median(sessionStats.reactionTimes);

  /* --- Compare with previous session (if exists) --- */
  let improved = false;
  let regressed = false;

  if (previousSessionStats) {
    const prevAccuracy =
      previousSessionStats.shotsHit /
      Math.max(previousSessionStats.shotsFired, 1);

    const prevSPS =
      previousSessionStats.shotsHit /
      previousSessionStats.duration;

    if (
      accuracy - prevAccuracy >= IMPROVEMENT_THRESHOLDS.accuracyUp ||
      shotsPerSecond - prevSPS >= IMPROVEMENT_THRESHOLDS.shotsPerSecondUp
    ) {
      improved = true;
    }

    if (
      accuracy < prevAccuracy - 0.1 ||
      shotsPerSecond < prevSPS - 0.5
    ) {
      regressed = true;
    }

    console.log("Prev Acc:", prevAccuracy.toFixed(2), "Curr Acc:", accuracy.toFixed(2));
    console.log("Prev SPS:", prevSPS.toFixed(2), "Curr SPS:", shotsPerSecond.toFixed(2));
    console.log("Improved:", improved, "Regressed:", regressed);
  }

  /* --- Adjust subLevel --- */
  let newSubLevel = subLevel;

  if (improved) newSubLevel += 1;
  if (regressed) newSubLevel -= 1;

  newSubLevel = clamp(
    newSubLevel,
    0,
    MAX_SUBLEVEL[tier]
  );

  /* --- Promotion logic --- */
  let newTier = tier;
  let promoted = false;
  let demoted = false;

  if (newSubLevel >= MAX_SUBLEVEL[tier]) {
    if (tier === DIFFICULTY.EASY) {
      newTier = DIFFICULTY.MEDIUM;
      newSubLevel = 0;
      promoted = true;
    } else if (tier === DIFFICULTY.MEDIUM) {
      newTier = DIFFICULTY.HARD;
      newSubLevel = 0;
      promoted = true;
    }
  }

  /* Optional future demotion logic */
  // if (tier === DIFFICULTY.MEDIUM && regressed) { ... }

  return {
    tier: newTier,
    subLevel: newSubLevel,
    promoted,
    demoted,
    metrics: {
      accuracy,
      shotsPerSecond,
      reactionMedian,
    },
  };
}
