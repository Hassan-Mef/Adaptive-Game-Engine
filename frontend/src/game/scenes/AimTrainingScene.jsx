import { useEffect, useRef, useState } from "react";
import { PointerLockControls, PositionalAudio } from "@react-three/drei";
import * as THREE from "three";
import { useThree, useLoader } from "@react-three/fiber";
import { Sky } from "@react-three/drei";
import Gun from "../components/Gun/Gun";
import ImpactParticles from "../components/ImpactParticles";
import usePlayer from "../hooks/usePlayer";
import { LevelLayout } from "../components/Environment/index";
import useGameLoop from "../hooks/useGameLoop";
import { GAME_PHASE } from "../systems/gamePhases";
import TargetSpawner from "../components/TargetSpawner";
import { evaluateDifficulty } from "../systems/difficultySystem";

export default function AimTrainingScene({ onStatsUpdate }) {
  const { camera } = useThree();
  // const scoreRef = useRef(0);
  const [particles, setParticles] = useState([]);

  // game Phase

  const game = useGameLoop({
    duration: 20, // calibration duration only
    onFinish: () => {
      console.log("CALIBRATION STATS:", game.getCalibrationStats());
      console.log("LIVE STATS:", game.getStats());
      console.log("FINAL DIFFICULTY:", game.difficulty.current);
    },
  });

  const difficulty = game.difficulty.current;

  // gun sfx
  const gunshotSound = useRef();
  const audioBuffer = useLoader(THREE.AudioLoader, "/Gun/Gun_shot.mp3");

  const gunSounds = useRef([]);
  const POOL_SIZE = 5;

  const handleHit = (hitPosition) => {
    // Add new particle burst
    setParticles((prev) => [
      ...prev,
      { position: hitPosition, id: Date.now() },
    ]);
  };

  useEffect(() => {
    const listener = new THREE.AudioListener();
    camera.add(listener);

    for (let i = 0; i < POOL_SIZE; i++) {
      const sound = new THREE.Audio(listener);
      sound.setBuffer(audioBuffer);
      sound.setVolume(0.5);
      gunSounds.current.push(sound);
    }
  }, [audioBuffer, camera]);

  useEffect(() => {
    onStatsUpdate?.({
      timeLeft: game.timeLeft,
      ...game.getStats(),
    });
  }, [game.timeLeft]);

  const soundIndex = useRef(0);

  const handleShoot = () => {
    console.log(game.isRunning.current);
    //console.log(game.phase.current); // "CALIBRATION" | "LIVE" | "END"

    if (!game.isRunning.current) return;

    game.recordShot();

    if (gunSounds.current.length) {
      gunSounds.current[soundIndex.current].stop();
      gunSounds.current[soundIndex.current].play();
      soundIndex.current = (soundIndex.current + 1) % POOL_SIZE;
    }

    Gun.shoot();

    const raycaster = new THREE.Raycaster();
    const cameraDirection = new THREE.Vector3();
    camera.getWorldDirection(cameraDirection);
    cameraDirection.normalize();
    raycaster.set(camera.position, cameraDirection);

    const hit = window.__CHECK_HITS__?.();

    if (!hit) {
      game.onMiss();
    }
  };
  // start game ONCE
  useEffect(() => {
    game.start();
  }, []);

  // handle shooting lifecycle
  useEffect(() => {
    if (!game.isRunning.current) {
      //console.log(game.difficulty.current);
      return;
    }

    window.addEventListener("mousedown", handleShoot);
    return () => window.removeEventListener("mousedown", handleShoot);
  }, [game.timeLeft]); // timeLeft changes → effect re-evaluates

  useEffect(() => {
    const stats = game.getStats();
    const times = stats.reactionTimes || [];

    const avgReaction =
      times.length > 0
        ? Math.round(times.reduce((a, b) => a + b, 0) / times.length)
        : null;

    onStatsUpdate?.({
      timeLeft: game.timeLeft,
      ...stats,
      avgReaction,
    });
  }, [game.timeLeft]);

  usePlayer();
  return (
    <>
      <Sky
        sunPosition={[10, 15, 20]}
        turbidity={8}
        rayleigh={2}
        mieCoefficient={0.005}
        mieDirectionalG={0.8}
      />

      <hemisphereLight
        intensity={0.6}
        skyColor={"#b1e1ff"}
        groundColor={"#444"}
      />
      <directionalLight
        castShadow
        position={[10, 15, 10]}
        intensity={1.8}
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={1}
        shadow-camera-far={50}
        shadow-camera-left={-15}
        shadow-camera-right={15}
        shadow-camera-top={15}
        shadow-camera-bottom={-15}
      />
      <ambientLight intensity={0.4} />

      {/* <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[50, 50]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh> */}
      <LevelLayout />

      <Gun />

      <TargetSpawner
        difficulty={game.difficulty.current}
        isRunning={game.isRunning.current}
        camera={camera}
        onHit={(point, reactionTime) => {
          game.recordHit();
          game.recordReaction(reactionTime);
          handleHit(point);
        }}
        onMiss={() => {
          game.onMiss();
          // future: penalties, reaction stats
        }}
      />

      {/* {particles.map((p) => (
        <ImpactParticles
          key={p.id}
          position={p.position}
          onComplete={() =>
            setParticles((prev) =>
              prev.filter((particle) => particle.id !== p.id)
            )
          }
        />
      ))} */}

      <PointerLockControls />
    </>
  );
}
