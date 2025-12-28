import { useEffect, useRef, useState } from "react";
import { evaluateDifficulty } from "../systems/difficultySystem";
import { evaluateLiveDifficulty } from "../systems/LiveDifficultyEvalutor";
import { evaluateAchievements } from "../systems/achievementSystem";

export default function useGameLoop({ duration = 20, onFinish, onRoundEnd }) {
  const [timeLeft, setTimeLeft] = useState(duration);
  const isRunningRef = useRef(false);

  const MAX_LIVE_ROUNDS = 5;

  const phaseRef = useRef("IDLE");
  // "IDLE" | "CALIBRATION" | "LIVE" | "ROUND_END" \ "SESSION_END"
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
      // --- Calibration finished ---
      if (phaseRef.current === "CALIBRATION") {
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

        pushEvent({ type: "PHASE", label: "Calibration Complete" });
        pushEvent({ type: "DIFFICULTY", label: `Starting ${result.tier}` });

        phaseRef.current = "LIVE";
        console.log("[PHASE] Entered LIVE round");

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
        livesCompletedRef.current += 1;

        const liveStats = { ...statsRef.current, duration };

        const baselineStats =
          lastLiveStatsRef.current ?? calibrationStatsRef.current;

        const prevDifficulty = difficultyRef.current;

        const updatedDifficulty = evaluateLiveDifficulty(
          difficultyRef.current,
          liveStats,
          baselineStats
        );

        difficultyRef.current = {
          tier: updatedDifficulty.tier,
          subLevel: updatedDifficulty.subLevel,
        };

        if (updatedDifficulty.promoted) {
          pushEvent({
            type: "PROMOTION",
            label: `Promoted to ${updatedDifficulty.tier}`,
          });
        } else if (updatedDifficulty.subLevel > prevDifficulty.subLevel) {
          pushEvent({
            type: "SUBLEVEL",
            label: `${updatedDifficulty.tier} +${updatedDifficulty.subLevel}`,
          });
        }

        pushEvent({
          type: "STATUS",
          label: `Difficulty: ${difficultyRef.current.tier} +${difficultyRef.current.subLevel}`,
        });

        lastLiveStatsRef.current = liveStats;

        console.log("[PHASE] Live round finished");

        onRoundEnd?.({
          round: livesCompletedRef.current,
          liveStats,
          difficulty: difficultyRef.current,
          promoted: updatedDifficulty.promoted,
          events: [...eventsRef.current],
        });

        isRunningRef.current = false;
        return;
      }
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

    pushEvent({ type: "PHASE", label: "Calibration Started" });

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
    statsRef.current.reactionTimes.push(reactionTime);
  };

  const pushEvent = (event) => {
    eventsRef.current.push({
      id: Date.now() + Math.random(),
      timestamp: Date.now(),
      ...event,
    });
  };

  const resumeNextRound = () => {
    if (livesCompletedRef.current >= MAX_LIVE_ROUNDS) {
      phaseRef.current = "SESSION_END";
      isRunningRef.current = false;

      onFinish?.({
        calibration: calibrationStatsRef.current,
        rounds: allRoundsRef.current,
        finalDifficulty: difficultyRef.current,
      });

      console.log("[SESSION] Completed");
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

    livesCompletedRef.current += 1;

    phaseRef.current = "LIVE";
    isRunningRef.current = true;
    setTimeLeft(20);

    pushEvent({
      type: "ROUND",
      label: `Live Round ${livesCompletedRef.current}`,
    });

    console.log(`[RESUME] Starting live round ${livesCompletedRef.current}`);
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
    resumeNextRound,

    getCalibrationStats: () => calibrationStatsRef.current,
    getStats: () => statsRef.current,

    getEvents: () => eventsRef.current,
    clearEvents: () => (eventsRef.current = []),
  };
}
