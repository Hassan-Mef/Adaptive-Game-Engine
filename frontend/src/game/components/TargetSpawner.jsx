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

  const tier = difficulty?.tier ?? "EASY";
  const subLevel = difficulty?.subLevel ?? 0;

  const baseConfig = DIFFICULTY_CONFIG[tier];

  // 🎯 apply soft difficulty
  const config = {
    ...baseConfig,

    // smaller targets as subLevel increases
    size: Math.max(0.4, baseConfig.size - subLevel * 0.05),

    // faster despawn as subLevel increases
    despawnTime: baseConfig.despawnTime
      ? Math.max(800, baseConfig.despawnTime - subLevel * 250)
      : null,

    // slowly increase target count
    count: Math.min(10, baseConfig.count + Math.floor(subLevel / 2)),
  };

  /* ---------- SPAWN ---------- */
  useEffect(() => {
    if (!isRunning) {
      setTargets([]);
      targetRefs.current = [];
      return;
    }

    const now = Date.now();
    const spawned = Array.from({ length: config.count }).map((_, i) => ({
      id: `${tier}-${i}-${now}`,
      position: randomPosition(),
      spawnedAt: now,
    }));

    setTargets(spawned);
    console.log(
      "[SPAWNER]",
      `Spawned ${config.count} targets | Tier=${tier} | Sub=${subLevel}`,
      config
    );
  }, [tier, subLevel, isRunning]);

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
  }, [tier, subLevel, isRunning]);

  /* ---------- HIT CHECK ---------- */
  const checkHits = () => {
    if (!camera) return false;

    const raycaster = new THREE.Raycaster();
    const dir = new THREE.Vector3();
    camera.getWorldDirection(dir);
    raycaster.set(camera.position, dir);

    const now = Date.now();
    let hitSomething = false;

    targetRefs.current.forEach((mesh) => {
      if (!mesh || hitSomething) return;

      const hits = raycaster.intersectObject(mesh);
      if (hits.length > 0) {
        hitSomething = true;

        const spawnedAt = mesh.userData.spawnedAt;
        if (!spawnedAt) return;

        const reactionTime = now - spawnedAt;

        onHit?.(hits[0].point, reactionTime);

        // respawn visually
        mesh.userData.spawnedAt = now;
        mesh.position.set(...randomPosition());
      }
    });

    return hitSomething;
  };

  /* ---------- EXPOSE SHOOT ---------- */
  useEffect(() => {
    if (!isRunning) return;

    window.__CHECK_HITS__ = checkHits;

    return () => {
      if (window.__CHECK_HITS__ === checkHits) {
        delete window.__CHECK_HITS__;
      }
    };
  }, [isRunning, tier, camera]);

  return (
    <>
      {targets.map((t, i) => (
        <Target
          key={t.id}
          ref={(el) => {
            if (el) {
              el.userData.spawnedAt = t.spawnedAt;
              targetRefs.current[i] = el;
            }
          }}
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
