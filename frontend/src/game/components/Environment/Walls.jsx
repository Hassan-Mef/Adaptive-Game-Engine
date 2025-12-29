import { useLoader } from "@react-three/fiber";
import { EXRLoader } from "three/examples/jsm/loaders/EXRLoader";
import * as THREE from "three";
import React, { useEffect } from "react";

export default function Walls() {
  // --- Load textures ---
  const albedo = useLoader(
    THREE.TextureLoader,
    "/Textures/plastered_wall_02_1k.blend/textures/plastered_wall_02_diff_1k.jpg"
  );

  const normal = useLoader(
    EXRLoader,
    "/Textures/plastered_wall_02_1k.blend/textures/plastered_wall_02_nor_gl_1k.exr"
  );

  const roughnessMap = useLoader(
    EXRLoader,
    "/Textures/plastered_wall_02_1k.blend/textures/plastered_wall_02_rough_1k.exr"
  );

  // --- Texture settings ---
  useEffect(() => {
    // Albedo
    albedo.wrapS = albedo.wrapT = THREE.RepeatWrapping;
    albedo.repeat.set(4, 2);
    albedo.colorSpace = THREE.SRGBColorSpace;
    albedo.anisotropy = 8;

    // Normal + roughness
    [normal, roughnessMap].forEach((tex) => {
      tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
      tex.repeat.set(4, 2);
      tex.colorSpace = THREE.NoColorSpace;
      tex.anisotropy = 4;
    });

    // OpenGL normal map → correct for three.js
    normal.flipY = false;
  }, [albedo, normal, roughnessMap]);

  // --- Aim-trainer tuned material ---
  const materialProps = {
    map: albedo,
    normalMap: normal,
    roughnessMap: roughnessMap,

    // Hard clamp values for clean visuals
    metalness: 0.0,
    roughness: 0.85,
  };

  return (
    <group name="walls">
      {/* Back wall */}
      <mesh position={[0, 5, -20]} receiveShadow>
        <boxGeometry args={[40, 10, 1]} />
        <meshStandardMaterial {...materialProps} />
      </mesh>

      {/* Left wall */}
      <mesh position={[-20, 5, -1]} receiveShadow>
        <boxGeometry args={[1, 10, 50]} />
        <meshStandardMaterial {...materialProps} />
      </mesh>

      {/* Right wall */}
      <mesh position={[20, 5, -1]} receiveShadow>
        <boxGeometry args={[1, 10, 50]} />
        <meshStandardMaterial {...materialProps} />
      </mesh>
    </group>
  );
}
