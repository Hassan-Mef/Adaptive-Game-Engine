import { useEffect, useState, useRef } from "react";
import * as THREE from "three";
import Target from "./Target";

const DIFFICULTY_CONFIG = {
  EASY: { count: 3, size: 1.2, move: false },
  MEDIUM: { count: 5, size: 0.9, move: false },
  HARD: { count: 7, size: 0.7, move: true },
};

export default function TargetSpawner({
  difficulty,
  isRunning,
  camera,
  onHit,
}) {
  const [targets, setTargets] = useState([]);
  const targetRefs = useRef([]);

  const config =
    DIFFICULTY_CONFIG[difficulty] ?? DIFFICULTY_CONFIG.EASY;

  useEffect(() => {
    if (!isRunning) {
      setTargets([]);
      targetRefs.current = [];
      return;
    }

    const spawned = Array.from({ length: config.count }).map((_, i) => ({
      id: `${difficulty}-${i}-${Date.now()}`,
      position: randomPosition(),
    }));

    setTargets(spawned);
  }, [difficulty, isRunning]);

  const checkHits = () => {
    if (!camera) return;

    const raycaster = new THREE.Raycaster();
    const dir = new THREE.Vector3();

    camera.getWorldDirection(dir);
    raycaster.set(camera.position, dir);

    targetRefs.current.forEach((mesh) => {
      if (!mesh) return;

      const hits = raycaster.intersectObject(mesh);
      if (hits.length > 0) {
        onHit?.(hits[0].point);
        mesh.position.set(...randomPosition());
      }
    });
  };

  useEffect(() => {
    if (!isRunning) return;

    window.__CHECK_HITS__ = checkHits;

    return () => {
      if (window.__CHECK_HITS__ === checkHits) {
        delete window.__CHECK_HITS__;
      }
    };
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
