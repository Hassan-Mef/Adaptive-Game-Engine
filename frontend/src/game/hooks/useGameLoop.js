import { useEffect, useRef, useState } from "react";
import { evaluateDifficulty } from "../systems/difficultySystem";
import { evaluateLiveDifficulty } from "../systems/LiveDifficultyEvalutor";
import { evaluateAchievements } from "../systems/achievementSystem";

export default function useGameLoop({ duration = 20, onFinish }) {
  const [timeLeft, setTimeLeft] = useState(duration);
  const isRunningRef = useRef(false);

  const phaseRef = useRef("IDLE");
  const difficultyRef = useRef(null);
  const calibrationStatsRef = useRef(null);
  const lastLiveStatsRef = useRef(null);
  const livesCompletedRef = useRef(0);

  const statsRef = useRef({
    shotsFired: 0,
    shotsHit: 0,
    score: 0,
    startTime: null,
    reactionTimes: [], // NEW: store reaction times
  });

  useEffect(() => {
    if (!isRunningRef.current) return;

    if (timeLeft <= 0) {
      // --- Calibration finished ---
      if (phaseRef.current === "CALIBRATION") {
        // lock calibration stats
        calibrationStatsRef.current = {
          ...statsRef.current,
          reactionTimes: [...statsRef.current.reactionTimes],
        };

        const result = evaluateDifficulty(
          calibrationStatsRef.current,
          duration
        );

        difficultyRef.current = result;
        console.log("[PHASE] Calibration finished");
        console.log("[DIFFICULTY] Initial difficulty:", result);

        // ➜ move to LIVE
        phaseRef.current = "LIVE";

        console.log("[PHASE] Entered LIVE round");

        // reset ONLY live stats
        statsRef.current = {
          shotsFired: 0,
          shotsHit: 0,
          score: 0,
          reactionTimes: [],
          startTime: Date.now(),
        };

        setTimeLeft(20);
        return;
      }

      // --- Live round finished ---
      if (phaseRef.current === "LIVE") {
        const liveStats = {
          ...statsRef.current,
          duration,
        };

        const baselineStats =
          lastLiveStatsRef.current ?? calibrationStatsRef.current;

        const updatedDifficulty = evaluateLiveDifficulty(
          difficultyRef.current,
          liveStats,
          baselineStats
        );

        difficultyRef.current = {
          tier: updatedDifficulty.tier,
          subLevel: updatedDifficulty.subLevel,
        };

        lastLiveStatsRef.current = liveStats;

        console.log("[PHASE] Live round finished");
        console.log("[LIVE-EVAL] Stats:", liveStats);
        console.log("[LIVE-EVAL] Previous difficulty:", difficultyRef.current);

        livesCompletedRef.current += 1;
        phaseRef.current = "LIVE";

        statsRef.current = {
          shotsFired: 0,
          shotsHit: 0,
          score: 0,
          reactionTimes: [],
          startTime: Date.now(),
        };
        console.log(
          `[CHAIN] Starting Live #${livesCompletedRef.current + 1}`,
          difficultyRef.current
        );

        setTimeLeft(20);

        if (livesCompletedRef.current >= 5) {
          phaseRef.current = "END";
          isRunningRef.current = false;
        }

        onFinish?.({
          ...liveStats,
          difficulty: difficultyRef.current,
          promoted: updatedDifficulty.promoted,
          livesCompleted: livesCompletedRef.current,
        });

        console.log("[LIVE-EVAL] Updated difficulty:", updatedDifficulty);

        const achievements = evaluateAchievements({
          liveStats,
          difficulty: difficultyRef.current,
          promoted: updatedDifficulty.promoted,
          livesCompleted: livesCompletedRef.current,
        });

        console.log("[ACHIEVEMENTS]", achievements);
      }

      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft]);

  const start = () => {
    statsRef.current = {
      shotsFired: 0,
      shotsHit: 0,
      score: 0,
      startTime: Date.now(),
      reactionTimes: [],
    };

    console.log("[GAME] Started → CALIBRATION");

    phaseRef.current = "CALIBRATION";
    difficultyRef.current = null;

    setTimeLeft(duration);
    isRunningRef.current = true;
  };

  const recordShot = () => {
    if (!isRunningRef.current) return;
    statsRef.current.shotsFired++;
  };

  const recordHit = () => {
    if (!isRunningRef.current) return;
    statsRef.current.shotsHit++;
    statsRef.current.score += 10;
  };

  const onMiss = () => {
    if (!isRunningRef.current) return;
    statsRef.current.score -= 10;
  };

  const recordReaction = (reactionTime) => {
    if (!statsRef.current.reactionTimes) {
      statsRef.current.reactionTimes = [];
    }

    statsRef.current.reactionTimes.push(reactionTime);
  };

  return {
    timeLeft,
    isRunning: isRunningRef,
    phase: phaseRef,
    difficulty: difficultyRef,

    start,
    recordShot,
    recordHit,
    onMiss,
    recordReaction,
    getCalibrationStats: () => calibrationStatsRef.current,
    getStats: () => statsRef.current,
  };
}
