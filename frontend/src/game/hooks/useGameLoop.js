import { useEffect, useRef, useState } from "react";
import { evaluateDifficulty } from "../systems/difficultySystem";
import { evaluateLiveDifficulty } from "../systems/LiveDifficultyEvalutor";

export default function useGameLoop({ duration = 20, onFinish, onRoundEnd }) {
  const [timeLeft, setTimeLeft] = useState(duration);
  const isRunningRef = useRef(false);

  const sessionRef = useRef({
    calibration: null,
    rounds: [],
    finalDifficulty: null,
  });
  // now i have to log the session data at the end of the session
  const MAX_LIVE_ROUNDS = 2;

  const phaseRef = useRef("IDLE");
  // IDLE | CALIBRATION | LIVE | ROUND_END | SESSION_END

  const difficultyRef = useRef(null);
  const calibrationStatsRef = useRef(null);
  const lastLiveStatsRef = useRef(null);
  const livesCompletedRef = useRef(0);

  const eventsRef = useRef([]);

  const statsRef = useRef({
    shotsFired: 0,
    shotsHit: 0,
    score: 0,
    startTime: null,
    reactionTimes: [],
  });

  useEffect(() => {
    if (!isRunningRef.current) return;

    if (timeLeft <= 0) {
      /* ---------- CALIBRATION END ---------- */
      if (phaseRef.current === "CALIBRATION") {
        calibrationStatsRef.current = {
          ...statsRef.current,
          reactionTimes: [...statsRef.current.reactionTimes],
        };
        sessionRef.current.calibration = calibrationStatsRef.current;

        const result = evaluateDifficulty(
          calibrationStatsRef.current,
          duration
        );

        difficultyRef.current = result;

        console.log("[PHASE] Calibration finished");
        console.log("[DIFFICULTY] Initial:", result);

        phaseRef.current = "LIVE";

        statsRef.current = {
          shotsFired: 0,
          shotsHit: 0,
          score: 0,
          reactionTimes: [],
          startTime: Date.now(),
        };

        setTimeLeft(5);
        return;
      }

      /* ---------- LIVE ROUND END ---------- */
      if (phaseRef.current === "LIVE") {
        livesCompletedRef.current += 1; // ✅ ONLY increment here

        const liveStats = { ...statsRef.current, duration };

        const baseline =
          lastLiveStatsRef.current ?? calibrationStatsRef.current;

        const updated = evaluateLiveDifficulty(
          difficultyRef.current,
          liveStats,
          baseline
        );

        difficultyRef.current = {
          tier: updated.tier,
          subLevel: updated.subLevel,
        };

        lastLiveStatsRef.current = liveStats;

        console.log(`[PHASE] Live round ${livesCompletedRef.current} finished`);

        sessionRef.current.rounds.push({
          round: livesCompletedRef.current,
          stats: liveStats,
          difficulty: difficultyRef.current,
        });

        onRoundEnd?.({
          round: livesCompletedRef.current,
          liveStats,
          difficulty: difficultyRef.current,
          promoted: updated.promoted,
          events: [...eventsRef.current],
        });

        isRunningRef.current = false;
        phaseRef.current =
          livesCompletedRef.current >= MAX_LIVE_ROUNDS
            ? "SESSION_END"
            : "ROUND_END";

        return;
      }
    }

    const timer = setTimeout(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft]);

  /* ---------- PUBLIC API ---------- */

  const start = () => {
    livesCompletedRef.current = 0;
    eventsRef.current = [];

    statsRef.current = {
      shotsFired: 0,
      shotsHit: 0,
      score: 0,
      startTime: Date.now(),
      reactionTimes: [],
    };

    phaseRef.current = "CALIBRATION";
    difficultyRef.current = null;

    console.log("[GAME] Started → CALIBRATION");

    setTimeLeft(duration);
    isRunningRef.current = true;

    sessionRef.current = {
      calibration: null,
      rounds: [],
      finalDifficulty: null,
    };
  };

  const resumeNextRound = () => {
    if (phaseRef.current === "SESSION_END") {
      console.log("[SESSION] Completed");

      sessionRef.current.finalDifficulty = difficultyRef.current;

      console.log("[SESSION SUMMARY]", sessionRef.current);

      onFinish?.(sessionRef.current);

      sessionRef.current.finalDifficulty = difficultyRef.current;

      return;
    }

    eventsRef.current = [];

    statsRef.current = {
      shotsFired: 0,
      shotsHit: 0,
      score: 0,
      reactionTimes: [],
      startTime: Date.now(),
    };

    phaseRef.current = "LIVE";
    isRunningRef.current = true;
    setTimeLeft(20);

    console.log(
      `[RESUME] Starting live round ${livesCompletedRef.current + 1}`
    );
  };

  const reset = () => {
    setTimeLeft(duration);
    isRunningRef.current = false;
    phaseRef.current = "IDLE";
    livesCompletedRef.current = 0;
    statsRef.current = {
      shotsFired: 0,
      shotsHit: 0,
      score: 0,
      startTime: null,
      reactionTimes: [],
    };
    calibrationStatsRef.current = null;
    lastLiveStatsRef.current = null;
    difficultyRef.current = null;
    sessionRef.current = {
      calibration: null,
      rounds: [],
      finalDifficulty: null,
    };
    eventsRef.current = [];
  };

  return {
    timeLeft,
    isRunning: isRunningRef,
    phase: phaseRef,
    difficulty: difficultyRef,

    start,
    resumeNextRound,
    reset,
    recordShot: () => isRunningRef.current && statsRef.current.shotsFired++,
    recordHit: () => {
      if (!isRunningRef.current) return;
      statsRef.current.shotsHit++;
      statsRef.current.score += 10;
    },
    onMiss: () => isRunningRef.current && (statsRef.current.score -= 10),
    recordReaction: (t) => statsRef.current.reactionTimes.push(t),

    getStats: () => statsRef.current,
    getCalibrationStats: () => calibrationStatsRef.current,
    getEvents: () => eventsRef.current,
    clearEvents: () => (eventsRef.current = []),
    getRounds: () => sessionRef.current.rounds, // <-- add this
  };
}
