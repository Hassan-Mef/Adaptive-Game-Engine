import { Canvas } from "@react-three/fiber";
import AimTrainingScene from "./scenes/AimTrainingScene";
import Ground from "./components/Ground";

export default function GameCanvas() {
  return (
    <Canvas
      camera={{ fov: 75, position: [0, 5, 5] }}
      shadows
    >
      <color attach="background" args={["#121212"]} />
      <Ground />
      <AimTrainingScene />
    </Canvas>
  );
}
