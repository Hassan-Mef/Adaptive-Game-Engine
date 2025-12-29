import { useEffect, useRef, useState } from "react";
import { evaluateDifficulty } from "../systems/difficultySystem";
import { evaluateLiveDifficulty } from "../systems/LiveDifficultyEvalutor";
import { GAME_CONFIG } from "../systems/gameConfig";

export default function useGameLoop({ duration = 20, onFinish, onRoundEnd }) {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isRunning, setIsRunning] = useState(false); // STATE to trigger effects

  const sessionRef = useRef({ calibration: null, rounds: [], finalDifficulty: null });
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

  useEffect(() => {
    if (!isRunning) return;

    if (timeLeft <= 0) {
      if (phaseRef.current === "CALIBRATION") {
        calibrationStatsRef.current = { ...statsRef.current };
        sessionRef.current.calibration = calibrationStatsRef.current;
        const result = evaluateDifficulty(calibrationStatsRef.current, duration);
        difficultyRef.current = result;
        
        phaseRef.current = "LIVE";
        statsRef.current = { shotsFired: 0, shotsHit: 0, score: 0, reactionTimes: [], startTime: Date.now() };
        setTimeLeft(GAME_CONFIG.CALIBRATION_DURATION);
        return;
      }

      if (phaseRef.current === "LIVE") {
        livesCompletedRef.current += 1;
        const liveStats = { ...statsRef.current, duration };
        const baseline = lastLiveStatsRef.current ?? calibrationStatsRef.current;
        const updated = evaluateLiveDifficulty(difficultyRef.current, liveStats, baseline);

        difficultyRef.current = { tier: updated.tier, subLevel: updated.subLevel };
        lastLiveStatsRef.current = liveStats;

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

        if (livesCompletedRef.current >= MAX_LIVE_ROUNDS) {
          phaseRef.current = "SESSION_END";
          sessionRef.current.finalDifficulty = difficultyRef.current;
          setIsRunning(false);
          onFinish?.(sessionRef.current);
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

  const start = (initialDifficulty = null) => {
    livesCompletedRef.current = 0;
    statsRef.current = { shotsFired: 0, shotsHit: 0, score: 0, startTime: Date.now(), reactionTimes: [] };
    
    if (initialDifficulty) {
      difficultyRef.current = initialDifficulty;
      phaseRef.current = "LIVE";
      setTimeLeft(GAME_CONFIG.LIVE_ROUND_DURATION); // Adjust for Live round duration
    } else {
      difficultyRef.current = null;
      phaseRef.current = "CALIBRATION";
      setTimeLeft(duration);
    }

    sessionRef.current = { calibration: null, rounds: [], finalDifficulty: difficultyRef.current };
    setIsRunning(true);
  };

  const resumeNextRound = () => {
    statsRef.current = { shotsFired: 0, shotsHit: 0, score: 0, reactionTimes: [], startTime: Date.now() };
    phaseRef.current = "LIVE";
    setTimeLeft(5);
    setIsRunning(true);
  };

  return {
    timeLeft,
    isRunning,
    phase: phaseRef,
    difficulty: difficultyRef,
    start,
    resumeNextRound,
    recordShot: () => isRunning && statsRef.current.shotsFired++,
    recordHit: () => { if (isRunning) { statsRef.current.shotsHit++; statsRef.current.score += 10; } },
    onMiss: () => { if (isRunning) statsRef.current.score -= 10; },
    recordReaction: (t) => statsRef.current.reactionTimes.push(t),
    getStats: () => statsRef.current,
    getCalibrationStats: () => calibrationStatsRef.current,
    getEvents: () => eventsRef.current,
    clearEvents: () => (eventsRef.current = []),
    getRounds: () => sessionRef.current.rounds,
  };
}