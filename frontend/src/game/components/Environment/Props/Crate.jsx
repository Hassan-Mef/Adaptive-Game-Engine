import { useRef } from "react";
import { useGLTF } from "@react-three/drei";

export default function Crate(props) {
  const crateRef = useRef();
  const { scene } = useGLTF("/Props/metal_crate.glb");

  return (
    <group ref={crateRef} {...props}>
      <primitive object={scene} />
    </group>
  );
}
