import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

export default function Gun(props) {
  const gunRef = useRef();
  const { camera } = useThree();

  // Load gun model
  const gltf = useGLTF("/Gun/Gun.glb");

  // === Your offsets converted to the stable system ===
  // old: translateX(0.27), translateY(-1.0), translateZ(-1.1)
  const cameraOffset = new THREE.Vector3(0.27, -1.0, -1.1);

  // temp vectors (performance)
  const _desiredPos = new THREE.Vector3();
  const _offsetWorld = new THREE.Vector3();

  // Smoothing factors
  const positionLerp = 0.22;
  const rotationSlerp = 0.35;

  useFrame(() => {
    if (!gunRef.current) return;

    // Convert camera-space offset → world-space offset
    _offsetWorld.copy(cameraOffset).applyQuaternion(camera.quaternion);

    // Desired world position = camera position + world offset
    _desiredPos.copy(camera.position).add(_offsetWorld);

    // Smooth follow: eliminates jitter
    gunRef.current.position.lerp(_desiredPos, positionLerp);

    // Smooth rotation alignment
    gunRef.current.quaternion.slerp(camera.quaternion, rotationSlerp);
  });

  return (
    <group ref={gunRef} {...props}>
      <primitive
        object={gltf.scene}
        // Your original rotation & scale
        rotation={[0, Math.PI / 2, 0]}
        scale={1}
      />
    </group>
  );
}
