import { useEffect, useRef } from "react";
import { PointerLockControls } from "@react-three/drei";
import useFPSControls from "../hooks/useFPSControls";
import { Raycaster } from "three";
import * as THREE from "three";
import { useThree } from "@react-three/fiber";
import Target from "../components/Target";

export default function AimTrainingScene() {
 
  const { camera } = useThree();
  const scoreRef = useRef(0);

  const targetRefs = [ useRef(), useRef(), useRef() ];

  const handleShoot = () => {
    const raycaster = new THREE.Raycaster(); // https://threejs.org/docs/?q=raycas#Raycaster

    const cameraDirection = new THREE.Vector3();
    // getting camera direction
    camera.getWorldDirection(cameraDirection);
    cameraDirection.normalize();

    // set ray origin and direction
    raycaster.set(camera.position, cameraDirection);

    targetRefs.forEach((targetRef) => {
    const hits = raycaster.intersectObject(targetRef.current.getMesh());
    if (hits.length > 0) {
      console.log("Hit!");
      scoreRef.current += 1;
      console.log("Score:", scoreRef.current);

      targetRef.current.respawn();
      }
    })
  };

  useEffect(() => {
    const shoot = () => handleShoot();
    window.addEventListener("mousedown", handleShoot);
    return () => {
      window.removeEventListener("mousedown", handleShoot);
    };
  }, []);

  useFPSControls();

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 10, 5]} intensity={1} castShadow />

      {/* Cube target */}
      <Target ref={targetRefs[0]} position={[0, 2, -10]} />
      <Target ref={targetRefs[1]} position={[-2, 3, -8]} />
      <Target ref={targetRefs[2]} position={[2, 1.5, -12]} />

      {/* FPS Controls */}
      <PointerLockControls />
    </>
  );
}
