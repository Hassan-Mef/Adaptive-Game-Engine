import { useEffect, useRef, useState } from "react";
import { evaluateDifficulty } from "../systems/difficultySystem";
import { evaluateLiveDifficulty } from "../systems/LiveDifficultyEvalutor";
import { evaluateAchievements } from "../systems/achievementSystem";
import { GAME_CONFIG } from "../systems/gameConfig";

export default function useGameLoop({ duration = 20, onFinish, onRoundEnd }) {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isRunning, setIsRunning] = useState(false);

  const sessionRef = useRef({
    calibration: null,
    rounds: [],
    finalDifficulty: null,
  });

  const MAX_LIVE_ROUNDS = GAME_CONFIG.MAX_LIVE_ROUNDS;
  const phaseRef = useRef("IDLE");
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

  /** Helper to log events */
  const pushEvent = (event) => {
    eventsRef.current.push({
      id: Date.now() + Math.random(),
      timestamp: Date.now(),
      ...event,
    });
  };

  useEffect(() => {
    if (!isRunning) return;

    if (timeLeft <= 0) {
      /** ---------- CALIBRATION END ---------- */
      if (phaseRef.current === "CALIBRATION") {
        calibrationStatsRef.current = { ...statsRef.current };
        sessionRef.current.calibration = calibrationStatsRef.current;

        const result = evaluateDifficulty(
          calibrationStatsRef.current,
          duration
        );
        difficultyRef.current = result;

        console.log("[PHASE] Calibration finished");
        console.log("[DIFFICULTY] Initial:", result);

        pushEvent({ type: "PHASE", label: "Calibration Complete" });
        pushEvent({ type: "DIFFICULTY", label: `Starting ${result.tier}` });

        phaseRef.current = "LIVE";

        statsRef.current = {
          shotsFired: 0,
          shotsHit: 0,
          score: 0,
          reactionTimes: [],
          startTime: Date.now(),
        };

        setTimeLeft(GAME_CONFIG.LIVE_ROUND_DURATION);
        return;
      }

      /** ---------- LIVE ROUND END ---------- */
      if (phaseRef.current === "LIVE") {
        livesCompletedRef.current += 1;
        const liveStats = { ...statsRef.current, duration };
        const baseline =
          lastLiveStatsRef.current ?? calibrationStatsRef.current;

        const updated = evaluateLiveDifficulty(
          difficultyRef.current,
          liveStats,
          baseline
        );

        // Snapshot current difficulty for this specific round BEFORE updating Ref
        const currentDifficultySnapshot = { ...difficultyRef.current };

        // Update difficulty Ref for next round
        difficultyRef.current = {
          tier: updated.tier,
          subLevel: updated.subLevel,
        };
        lastLiveStatsRef.current = liveStats;

        console.log(`[PHASE] Live round ${livesCompletedRef.current} finished`);
        pushEvent({
          type: "ROUND",
          label: `Live Round ${livesCompletedRef.current} finished`,
        });
        pushEvent({
          type: "DIFFICULTY",
          label: `Difficulty: ${difficultyRef.current.tier} +${difficultyRef.current.subLevel}`,
        });

        // Evaluate achievements for this round
        const achievements = evaluateAchievements(liveStats, difficultyRef.current);
        achievements.forEach((ach) =>
          pushEvent({ type: "ACHIEVEMENT", label: ach.name })
        );

        // Save round data to session with Snapshots
        sessionRef.current.rounds.push({
          round: livesCompletedRef.current,
          stats: liveStats,
          difficulty: currentDifficultySnapshot, 
          events: [...eventsRef.current],
          achievements,
        });

        // Callback for round end
        onRoundEnd?.({
          round: livesCompletedRef.current,
          liveStats,
          difficulty: difficultyRef.current,
          promoted: updated.promoted,
          events: [...eventsRef.current],
          achievements,
        });

        // Prepare next phase
        if (livesCompletedRef.current >= MAX_LIVE_ROUNDS) {
          phaseRef.current = "SESSION_END";
          sessionRef.current.finalDifficulty = { ...difficultyRef.current }; // Snapshot
          setIsRunning(false);

          console.log("[SESSION] Completed");
          console.log("[SESSION SUMMARY]", sessionRef.current);
          
          // IMPORTANT: Send a shallow copy so App receives a fresh object
          onFinish?.({ ...sessionRef.current });
        } else {
          phaseRef.current = "ROUND_END";
          setIsRunning(false);
        }

        return;
      }
    }

    const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, isRunning]);

  /** ---------- PUBLIC API ---------- */
  const start = (initialDifficulty = null) => {
    livesCompletedRef.current = 0;
    statsRef.current = {
      shotsFired: 0,
      shotsHit: 0,
      score: 0,
      startTime: Date.now(),
      reactionTimes: [],
    };
    eventsRef.current = [];

    if (initialDifficulty) {
      difficultyRef.current = initialDifficulty;
      phaseRef.current = "LIVE";
      setTimeLeft(GAME_CONFIG.LIVE_ROUND_DURATION);
    } else {
      difficultyRef.current = null;
      phaseRef.current = "CALIBRATION";
      setTimeLeft(duration);
    }

    sessionRef.current = {
      calibration: null,
      rounds: [],
      finalDifficulty: difficultyRef.current,
    };

    setIsRunning(true);

    console.log(
      initialDifficulty
        ? `[RESUME] Starting live round 1 with preloaded difficulty`
        : "[GAME] Started → CALIBRATION"
    );
    pushEvent({ type: "PHASE", label: phaseRef.current });
  };

  const resumeNextRound = () => {
    if (phaseRef.current === "SESSION_END") {
      console.log("[SESSION] Already Completed");
      console.log("[SESSION SUMMARY]", sessionRef.current);
      onFinish?.({ ...sessionRef.current });
      return;
    }

    statsRef.current = {
      shotsFired: 0,
      shotsHit: 0,
      score: 0,
      reactionTimes: [],
      startTime: Date.now(),
    };

    phaseRef.current = "LIVE";
    setTimeLeft(GAME_CONFIG.LIVE_ROUND_DURATION);
    setIsRunning(true);

    console.log(`[RESUME] Starting live round ${livesCompletedRef.current + 1}`);
    pushEvent({
      type: "ROUND",
      label: `Live Round ${livesCompletedRef.current + 1}`,
    });
  };

  return {
    timeLeft,
    isRunning,
    phase: phaseRef,
    difficulty: difficultyRef,
    start,
    resumeNextRound,
    recordShot: () => isRunning && statsRef.current.shotsFired++,
    recordHit: () => {
      if (isRunning) {
        statsRef.current.shotsHit++;
        statsRef.current.score += 10;
      }
    },
    onMiss: () => {
      if (isRunning) statsRef.current.score -= 10;
    },
    recordReaction: (t) => statsRef.current.reactionTimes.push(t),
    getStats: () => statsRef.current,
    getCalibrationStats: () => calibrationStatsRef.current,
    getEvents: () => eventsRef.current,
    clearEvents: () => (eventsRef.current = []),
    getRounds: () => sessionRef.current.rounds,
  };
}