import { useEffect, useRef } from "react";
import { PointerLockControls } from "@react-three/drei";
import useFPSControls from "../hooks/useFPSControls";
import { Raycaster } from "three";
import * as THREE from "three";
import { useThree } from "@react-three/fiber";
import Target from "../components/Target";
import { Sky } from "@react-three/drei";
import Gun from "../components/Gun/Gun";
import { TextureLoader, RepeatWrapping } from 'three';

export default function AimTrainingScene() {
  const { camera } = useThree();
  const scoreRef = useRef(0);

  const targetRefs = [useRef(), useRef(), useRef()];

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
    });
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
      {/* <ambientLight intensity={0.5} />
      <directionalLight position={[5, 10, 5]} intensity={1} castShadow  /> */}

      <Sky
        sunPosition={[10, 15, 20]}
        turbidity={8}
        rayleigh={2}
        mieCoefficient={0.005}
        mieDirectionalG={0.8}
      />

      {/* <hemisphereLight intensity={0.4} groundColor="black" />
      <spotLight position={[5, 8, 5]} angle={0.5} intensity={1} castShadow /> */}

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

      {/* <mesh scale={[20, 10, 20]}>
        <boxGeometry />
        <meshStandardMaterial color="#0cececff" side={THREE.BackSide} />
      </mesh> */}

      <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial color="#696969ff" />
      </mesh>

      <Gun />

      {/* Cube target */}
      <Target ref={targetRefs[0]} position={[0, 2, -10]} />
      <Target ref={targetRefs[1]} position={[-2, 3, -8]} />
      <Target ref={targetRefs[2]} position={[2, 1.5, -12]} />

      {/* FPS Controls */}
      <PointerLockControls />
    </>
  );
}
