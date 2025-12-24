import { useEffect, useRef, useState } from "react";

export default function useGameLoop({ duration = 20, onFinish }) {
  const [timeLeft, setTimeLeft] = useState(duration);
  const isRunningRef = useRef(false);

  const statsRef = useRef({
    shotsFired: 0,
    shotsHit: 0,
    score: 0,
    startTime: null,
  });

  useEffect(() => {
    if (!isRunningRef.current) return;

    if (timeLeft <= 0) {
      isRunningRef.current = false;
      onFinish?.(statsRef.current);
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
    start,
    recordShot,
    recordHit,
    getStats: () => statsRef.current,
  };
}
