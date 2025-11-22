import { useRef } from "react";
import { PointerLockControls } from "@react-three/drei";

export default function AimTrainingScene() {
  const cubeRef = useRef();

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 10, 5]} intensity={1} castShadow />

      {/* Cube target */}
      <mesh ref={cubeRef} position={[0, 1, -5]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="red" />
      </mesh>

      {/* FPS Controls */}
      <PointerLockControls />
    </>
  );
}
