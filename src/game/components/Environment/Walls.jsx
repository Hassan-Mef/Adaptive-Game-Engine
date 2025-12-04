import { useLoader } from "@react-three/fiber";
import React from "react";
import * as THREE from "three";
import { EXRLoader } from "three/examples/jsm/loaders/EXRLoader";

export default function Walls() {
  // Load textures correctly (JPG/PNG with TextureLoader)
  const colorMap = useLoader(
    THREE.TextureLoader,
    "/Textures/castle_wall_varriation_1k.blend/textures/castle_wall_varriation_diff_1k.jpg"
  );

  const displacementMap = useLoader(
    THREE.TextureLoader,
    "/Textures/castle_wall_varriation_1k.blend/textures/castle_wall_varriation_disp_1k.png"
  );

  // EXR maps with EXRLoader
  const normalMap = useLoader(
    EXRLoader,
    "/Textures/castle_wall_varriation_1k.blend/textures/castle_wall_varriation_nor_gl_1k.exr"
  );

  const roughnessMap = useLoader(
    THREE.TextureLoader,
    "/Textures/castle_wall_varriation_1k.blend/textures/castle_wall_varriation_rough_1k.jpg"
  );

  // Allow repeating patterns
  colorMap.wrapS = colorMap.wrapT = THREE.RepeatWrapping;
  normalMap.wrapS = normalMap.wrapT = THREE.RepeatWrapping;
  roughnessMap.wrapS = roughnessMap.wrapT = THREE.RepeatWrapping;
  displacementMap.wrapS = displacementMap.wrapT = THREE.RepeatWrapping;

  colorMap.repeat.set(4, 2);
  normalMap.repeat.set(4, 2);
  roughnessMap.repeat.set(4, 2);
  displacementMap.repeat.set(4, 2);

  return (
    <group name="walls">
      {/* Back wall */}
      <mesh position={[0, 5, -20]} receiveShadow castShadow>
        <boxGeometry args={[40, 10, 1]} />
        <meshStandardMaterial
          map={colorMap}
          normalMap={normalMap}
          roughnessMap={roughnessMap}
          displacementMap={displacementMap}
          displacementScale={0.1}
        />
      </mesh>

      {/* Left wall */}
      <mesh position={[-20, 5, -1]} receiveShadow castShadow>
        <boxGeometry args={[1, 10, 50]} />
        <meshStandardMaterial
          map={colorMap}
          normalMap={normalMap}
          roughnessMap={roughnessMap}
          displacementMap={displacementMap}
          displacementScale={0.1}
        />
      </mesh>

      {/* Right wall */}
      <mesh position={[20, 5, -1]} receiveShadow castShadow>
        <boxGeometry args={[1, 10, 50]} />
        <meshStandardMaterial
          map={colorMap}
          normalMap={normalMap}
          roughnessMap={roughnessMap}
          displacementMap={displacementMap}
          displacementScale={0.1}
        />
      </mesh>
    </group>
  );
}
