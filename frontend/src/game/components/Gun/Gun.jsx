import { useRef , useState} from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useGLTF , useTexture} from "@react-three/drei";
import { PositionalAudio } from "@react-three/drei";
import * as THREE from "three";

export default function Gun(props) {
  const gunRef = useRef();
  const flashRef = useRef();
  const innerGunRef = useRef();
  const { camera } = useThree();

  // Load gun model
  const gltf = useGLTF("/Gun/Gun.glb");


  // === Your offsets converted to the stable system ===
  // old: translateX(0.27), translateY(-1.0), translateZ(-1.1)
  const cameraOffset = new THREE.Vector3(0.27, -1.0, -1.1);

  // temp vectors (performance)
  const _desiredPos = new THREE.Vector3();
  const _offsetWorld = new THREE.Vector3();

  // Recoil state (FIXED: persistent between frames)
  const recoilPower = useRef(0); // 0 → normal, 1 → fully recoiled

  // Smoothing factors
  const positionLerp = 0.22;
  const rotationSlerp = 0.35;

  // FLASH TEXTURE (a simple muzzle flash sprite)
  const flashTexture = useTexture("/muzzle.png"); // <-- add this file in /public

  // Flash timer
  const [flashVisible, setFlashVisible] = useState(false);

  // Trigger flash externally
  Gun.shoot = () => {
    setFlashVisible(true);
    setTimeout(() => setFlashVisible(false), 50); // 0.05s flash

    recoilPower.current = 1; // <-- FIXED: now persists
  };

  useFrame(() => {
    if (!gunRef.current) return;

    // Smoothly decay recoil
    recoilPower.current = THREE.MathUtils.lerp(recoilPower.current, 0, 0.12);

    // Convert camera-space offset → world-space offset
    _offsetWorld.copy(cameraOffset).applyQuaternion(camera.quaternion);

    // Desired world position = camera position + world offset
    _desiredPos.copy(camera.position).add(_offsetWorld);

    // Smooth follow: eliminates jitter
    gunRef.current.position.lerp(_desiredPos, positionLerp);

    // Smooth rotation alignment
    gunRef.current.quaternion.slerp(camera.quaternion, rotationSlerp);

    // === GUN RECOIL MOVEMENT ===
    const backwardKick = recoilPower.current * 0.14;
    const kickVec = camera
      .getWorldDirection(new THREE.Vector3())
      .multiplyScalar(-backwardKick);
    gunRef.current.position.add(kickVec);

    // === GUN RECOIL ROTATION (tilt up) ===
    if (innerGunRef.current) {
      innerGunRef.current.rotation.x = recoilPower.current * -0.25;
    }

    // Update flash visibility
    if (flashRef.current) {
      flashRef.current.position.set(-0.01, 0.65, -0.5);
      flashRef.current.scale.set(1.1, 1.1, 1.1);
      flashRef.current.lookAt(camera.position);
      flashRef.current.visible = flashVisible;
    }
  });

  return (
    <group ref={gunRef} {...props}>
      {/* gun model */}
      <group ref={innerGunRef}>
        <primitive object={gltf.scene} scale={1} rotation={[0, Math.PI / 2, 0]} />
      </group>

      {/* muzzle flash sprite */}
      <sprite ref={flashRef} scale={[0.3, 0.3, 0.3]}>
        <spriteMaterial
          map={flashTexture}
          transparent
          opacity={0.95}
          depthWrite={false}
        />
      </sprite>
    </group>
  );
}
