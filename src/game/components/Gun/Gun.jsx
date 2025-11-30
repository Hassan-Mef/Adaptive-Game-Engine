import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";

export default function Gun(props) {
  const gunRef = useRef();
  const { camera } = useThree();

  // Load your gun model
  const gltf = useGLTF("Gun/Gun.glb");

  useFrame(() => {
    // Attach the gun to the camera each frame
    gunRef.current.position.copy(camera.position);

    // Offset the gun relative to camera (like holding it in FPS)
    gunRef.current.translateX(0.27);
    gunRef.current.translateY(-1.0);
    gunRef.current.translateZ(-1.1);

    // Make gun always rotate with camera
    gunRef.current.quaternion.copy(camera.quaternion);
  });

  return (
    <group ref={gunRef} {...props}>
      <primitive object={gltf.scene} rotation={[0, Math.PI/2, 0]} scale={1}/>

    </group>
  );
}
