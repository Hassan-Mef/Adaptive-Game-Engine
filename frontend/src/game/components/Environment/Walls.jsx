import { useLoader } from "@react-three/fiber";
import * as THREE from "three";
import React, { useEffect } from "react";

export default function Walls() {
  const albedo = useLoader(
    THREE.TextureLoader,
    "/Textures/Cracked_Dark_Cement_Wall_mlexuytve_2k/Cracked_Dark_Cement_Wall_mlexuytve_2k_Albedo.jpg"
  );

  const normal = useLoader(
    THREE.TextureLoader,
    "/Textures/Cracked_Dark_Cement_Wall_mlexuytve_2k/Cracked_Dark_Cement_Wall_mlexuytve_2k_Normal.jpg"
  );

  const roughness = useLoader(
    THREE.TextureLoader,
    "/Textures/Cracked_Dark_Cement_Wall_mlexuytve_2k/Cracked_Dark_Cement_Wall_mlexuytve_2k_Roughness.jpg"
  );

  // Texture settings
  useEffect(() => {
    [albedo, normal, roughness].forEach((tex) => {
      tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
      tex.repeat.set(4, 2);
      tex.anisotropy = 8;
    });

    // DX normal map fix
    normal.flipY = false;
  }, [albedo, normal, roughness]);

  const materialProps = {
    map: albedo,
    normalMap: normal,
    roughnessMap: roughness,
    roughness: 0.8,
    metalness: 0.05, // slight sci-fi polish
  };

  return (
    <group name="walls">
      {/* Back wall */}
      <mesh position={[0, 5, -20]} receiveShadow castShadow>
        <boxGeometry args={[40, 10, 1]} />
        <meshStandardMaterial {...materialProps} />
      </mesh>

      {/* Left wall */}
      <mesh position={[-20, 5, -1]} receiveShadow castShadow>
        <boxGeometry args={[1, 10, 50]} />
        <meshStandardMaterial {...materialProps} />
      </mesh>

      {/* Right wall */}
      <mesh position={[20, 5, -1]} receiveShadow castShadow>
        <boxGeometry args={[1, 10, 50]} />
        <meshStandardMaterial {...materialProps} />
      </mesh>
    </group>
  );
}
