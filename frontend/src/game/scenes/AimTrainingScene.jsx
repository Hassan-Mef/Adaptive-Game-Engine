  import { useEffect, useRef, useState } from "react";
  import { PointerLockControls } from "@react-three/drei";
  import * as THREE from "three";
  import { useThree, useLoader } from "@react-three/fiber";
  import { Sky } from "@react-three/drei";
  import Gun from "../components/Gun/Gun";
  import usePlayer from "../hooks/usePlayer";
  import { LevelLayout } from "../components/Environment/index";
  import useGameLoop from "../hooks/useGameLoop";
  import TargetSpawner from "../components/TargetSpawner";

  export default function AimTrainingScene({
    onStatsUpdate,
    onGameReady,
    onRoundEnd,
    initialDifficulty,
    onSessionFinish,
  }) {
    const { camera } = useThree();
    const [particles, setParticles] = useState([]);

    const game = useGameLoop({
      duration: 5,
      onFinish: onSessionFinish,
      onRoundEnd,
    });

    // INITIALIZE GAME ON MOUNT
    useEffect(() => {
      onGameReady?.({
        getEvents: game.getEvents,
        clearEvents: game.clearEvents,
        resumeNextRound: game.resumeNextRound,
      });

      // Start with the difficulty passed from App
      game.start(initialDifficulty);
    }, []);

    // AUDIO POOLING
    const audioBuffer = useLoader(THREE.AudioLoader, "/Gun/Gun_shot.mp3");
    const gunSounds = useRef([]);
    const soundIndex = useRef(0);
    const POOL_SIZE = 5;

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

    const handleShoot = () => {
      if (!game.isRunning) return; // Use state here

      game.recordShot();

      if (gunSounds.current.length) {
        gunSounds.current[soundIndex.current].stop();
        gunSounds.current[soundIndex.current].play();
        soundIndex.current = (soundIndex.current + 1) % POOL_SIZE;
      }

      Gun.shoot();
      const hit = window.__CHECK_HITS__?.();
      if (!hit) game.onMiss();
    };

    useEffect(() => {
      if (!game.isRunning) return;
      window.addEventListener("mousedown", handleShoot);
      return () => window.removeEventListener("mousedown", handleShoot);
    }, [game.isRunning]); // Depends on state

    useEffect(() => {
      const stats = game.getStats();
      onStatsUpdate?.({
        timeLeft: game.timeLeft,
        ...stats,
      });
    }, [game.timeLeft, game.isRunning]);

    usePlayer();

    return (
      <>
        <Sky sunPosition={[10, 15, 20]} turbidity={8} rayleigh={2} />
        <hemisphereLight
          intensity={0.6}
          skyColor={"#b1e1ff"}
          groundColor={"#444"}
        />
        <directionalLight castShadow position={[10, 15, 10]} intensity={1.8} />
        <ambientLight intensity={0.4} />
        <LevelLayout />
        <Gun />
        <TargetSpawner
          difficulty={game.difficulty.current}
          isRunning={game.isRunning}
          camera={camera}
          onHit={(point, reactionTime) => {
            game.recordHit();
            game.recordReaction(reactionTime);
          }}
          onMiss={() => game.onMiss()}
        />
        <PointerLockControls enabled={game.isRunning} />
      </>
    );
  }
