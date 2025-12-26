import { useEffect, useRef, useState } from "react";
import { evaluateDifficulty } from "../systems/difficultySystem";

export default function useGameLoop({ duration = 20, onFinish }) {
  const [timeLeft, setTimeLeft] = useState(duration);
  const isRunningRef = useRef(false);

  const phaseRef = useRef("IDLE");
  const difficultyRef = useRef(null);

  const statsRef = useRef({
    shotsFired: 0,
    shotsHit: 0,
    score: 0,
    startTime: null,
  });

  useEffect(() => {
    if (!isRunningRef.current) return;

    if (timeLeft <= 0) {
      // --- Calibration finished ---
      if (phaseRef.current === "CALIBRATION") {
        const result = evaluateDifficulty(statsRef.current, duration);

        difficultyRef.current = result;
        phaseRef.current = "LIVE";

        // reset for live round
        statsRef.current.shotsFired = 0;
        statsRef.current.shotsHit = 0;
        statsRef.current.score = 0;

        setTimeLeft(60); // LIVE duration
        return;
      }

      // --- Live round finished ---
      if (phaseRef.current === "LIVE") {
        isRunningRef.current = false;
        phaseRef.current = "END";
        onFinish?.({
          ...statsRef.current,
          difficulty: difficultyRef.current,
        });
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
    };

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

  return {
    timeLeft,
    isRunning: isRunningRef,
    phase: phaseRef,
    difficulty: difficultyRef,

    start,
    recordShot,
    recordHit,
    getStats: () => statsRef.current,
  };
}
