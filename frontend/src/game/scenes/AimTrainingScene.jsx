import { useEffect, useRef, useState } from "react";
import { PointerLockControls, PositionalAudio } from "@react-three/drei";
import * as THREE from "three";
import { useThree, useLoader } from "@react-three/fiber";
import Target from "../components/Target";
import { Sky } from "@react-three/drei";
import Gun from "../components/Gun/Gun";
import ImpactParticles from "../components/ImpactParticles";
import usePlayer from "../hooks/usePlayer";
import { LevelLayout } from "../components/Environment/index";
import useGameLoop from "../hooks/useGameLoop";
import { GAME_PHASE } from "../systems/gamePhases";

export default function AimTrainingScene({ onStatsUpdate }) {
  const { camera } = useThree();
  // const scoreRef = useRef(0);
  const [particles, setParticles] = useState([]);

  // game Phase

  const game = useGameLoop({
    duration: 20, // calibration duration only
    onFinish: (stats) => {
      console.log("FINAL GAME RESULT", stats);
    },
  });

  // gun sfx
  const gunshotSound = useRef();
  const audioBuffer = useLoader(THREE.AudioLoader, "/Gun/Gun_shot.mp3");

  const targetRefs = [useRef(), useRef(), useRef()];

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


    if (!game.isRunning.current ) return;

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

    targetRefs.forEach((targetRef) => {
      const hits = raycaster.intersectObject(targetRef.current.getMesh());

      if (hits.length > 0) {
        game.recordHit(); // ✅ HERE
        handleHit(hits[0].point);
        targetRef.current.respawn();
      }
    });
  };
  // start game ONCE
  useEffect(() => {
    game.start();
  }, []);

  // handle shooting lifecycle
  useEffect(() => {
    if (!game.isRunning.current) return;

    window.addEventListener("mousedown", handleShoot);
    return () => window.removeEventListener("mousedown", handleShoot);
  }, [game.timeLeft]); // timeLeft changes → effect re-evaluates

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

      {/* Cube targets */}
      <Target
        ref={targetRefs[0]}
        position={[0, 2, -10]}
        isRunning={game.isRunning.current}
      />
      <Target
        ref={targetRefs[1]}
        position={[-2, 3, -8]}
        isRunning={game.isRunning.current}
      />
      <Target
        ref={targetRefs[2]}
        position={[2, 1.5, -12]}
        isRunning={game.isRunning.current}
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
