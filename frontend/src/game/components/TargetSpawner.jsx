import { useEffect, useState, useRef } from "react";
import * as THREE from "three";
import Target from "./Target";

const DIFFICULTY_CONFIG = {
  EASY: {
    count: 3,
    size: 1.2,
    move: false,
    despawnTime: null,
  },
  MEDIUM: {
    count: 5,
    size: 0.9,
    move: false,
    despawnTime: 3000,
  },
  HARD: {
    count: 7,
    size: 0.7,
    move: true,
    despawnTime: 1500,
  },
};

export default function TargetSpawner({
  difficulty,
  isRunning,
  camera,
  onHit,
  onMiss,
}) {
  const [targets, setTargets] = useState([]);
  const targetRefs = useRef([]);

  const config = DIFFICULTY_CONFIG[difficulty] ?? DIFFICULTY_CONFIG.EASY;

  /* ---------- SPAWN ---------- */
  useEffect(() => {
    if (!isRunning) {
      setTargets([]);
      targetRefs.current = [];
      return;
    }

    const now = Date.now();
    const spawned = Array.from({ length: config.count }).map((_, i) => ({
      id: `${difficulty}-${i}-${now}`,
      position: randomPosition(),
      spawnedAt: now,
    }));

    setTargets(spawned);
  }, [difficulty, isRunning]);

  /* ---------- DESPAWN / RESPAWN ---------- */
  useEffect(() => {
    if (!isRunning || !config.despawnTime) return;

    const interval = setInterval(() => {
      setTargets((prev) =>
        prev.map((t) => {
          const age = Date.now() - t.spawnedAt;
          if (age > config.despawnTime) {
            onMiss?.();
            return {
              ...t,
              position: randomPosition(),
              spawnedAt: Date.now(),
            };
          }
          return t;
        })
      );
    }, 200);

    return () => clearInterval(interval);
  }, [difficulty, isRunning]);

  /* ---------- HIT CHECK ---------- */
  const checkHits = () => {
    if (!camera) return;

    const raycaster = new THREE.Raycaster();
    const dir = new THREE.Vector3();

    camera.getWorldDirection(dir);
    raycaster.set(camera.position, dir);

    targetRefs.current.forEach((mesh, i) => {
      if (!mesh) return;

      const hits = raycaster.intersectObject(mesh);
      if (hits.length > 0) {
        onHit?.(hits[0].point);

        setTargets((prev) =>
          prev.map((t, idx) =>
            idx === i
              ? {
                  ...t,
                  position: randomPosition(),
                  spawnedAt: Date.now(),
                }
              : t
          )
        );
      }
    });
  };

  /* ---------- EXPOSE SHOOT ---------- */
  useEffect(() => {
    if (!isRunning) return;

    window.__CHECK_HITS__ = checkHits;
    return () => delete window.__CHECK_HITS__;
  }, [isRunning, difficulty, camera]);

  return (
    <>
      {targets.map((t, i) => (
        <Target
          key={t.id}
          ref={(el) => (targetRefs.current[i] = el)}
          position={t.position}
          config={config}
        />
      ))}
    </>
  );
}

function randomPosition() {
  return [
    (Math.random() - 0.5) * 6,
    Math.random() * 2 + 2,
    -(Math.random() * 7 + 5),
  ];
}
