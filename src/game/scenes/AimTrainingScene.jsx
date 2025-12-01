import { useEffect, useRef } from "react";
import { PointerLockControls, PositionalAudio } from "@react-three/drei";
import useFPSControls from "../hooks/useFPSControls";
import * as THREE from "three";
import { useThree, useLoader } from "@react-three/fiber";
import Target from "../components/Target";
import { Sky } from "@react-three/drei";
import Gun from "../components/Gun/Gun";

export default function AimTrainingScene() {
  const { camera } = useThree();
  const scoreRef = useRef(0);

  // gun sfx
  const gunshotSound = useRef();
  const audioBuffer = useLoader(THREE.AudioLoader, "/Gun/Gun_shot.mp3");

  const targetRefs = [useRef(), useRef(), useRef()];

  const gunSounds = useRef([]);
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

  let soundIndex = 0;

  const handleShoot = () => {
     if (gunSounds.current.length) {
      gunSounds.current[soundIndex].stop();
    gunSounds.current[soundIndex].play();
    console.log("Testing: Playing sound", soundIndex);
    soundIndex = (soundIndex + 1) % POOL_SIZE;
  }


    Gun.shoot(); // trigger gun flash

    const raycaster = new THREE.Raycaster();
    const cameraDirection = new THREE.Vector3();
    camera.getWorldDirection(cameraDirection);
    cameraDirection.normalize();

    raycaster.set(camera.position, cameraDirection);

    targetRefs.forEach((targetRef) => {
      const hits = raycaster.intersectObject(targetRef.current.getMesh());
      if (hits.length > 0) {
        console.log("Hit!");
        scoreRef.current += 1;
        console.log("Score:", scoreRef.current);

        targetRef.current.respawn();
      }
    });
  };

  useEffect(() => {
    window.addEventListener("mousedown", handleShoot);
    return () => {
      window.removeEventListener("mousedown", handleShoot);
    };
  }, []);

  useFPSControls();

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

      <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial color="#FFFFFFF" />
      </mesh>

      <Gun />

      {/* Cube targets */}
      <Target ref={targetRefs[0]} position={[0, 2, -10]} />
      <Target ref={targetRefs[1]} position={[-2, 3, -8]} />
      <Target ref={targetRefs[2]} position={[2, 1.5, -12]} />

      <PointerLockControls />
    </>
  );
}
