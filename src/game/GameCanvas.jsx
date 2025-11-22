import { Canvas } from "@react-three/fiber";
import AimTrainingScene from "./scenes/AimTrainingScene";

export default function GameCanvas() {
  return (
    <Canvas
      camera={{ fov: 75, position: [0, 1.6, 5] }}
      shadows
    >
      <color attach="background" args={["#121212"]} />
      <AimTrainingScene />
    </Canvas>
  );
}
