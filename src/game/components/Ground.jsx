import React, { useRef } from 'react';
import { useLoader } from '@react-three/fiber';
import * as THREE from 'three';
import { EXRLoader } from 'three/examples/jsm/loaders/EXRLoader';

export default function Ground() {
  const meshRef = useRef();

  // Load simple textures
  const colorMap = useLoader(THREE.TextureLoader, '/Textures/dirt_1k.blend/textures/dirt_diff_1k.jpg');
  const displacementMap = useLoader(THREE.TextureLoader, '/Textures/dirt_1k.blend/textures/dirt_disp_1k.png');

  // For EXR textures, use EXRLoader
  const normalMap = useLoader(EXRLoader, '/Textures/dirt_1k.blend/textures/dirt_nor_gl_1k.exr');
  const roughnessMap = useLoader(EXRLoader, '/Textures/dirt_1k.blend/textures/dirt_rough_1k.exr');

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[200, 200, 128, 128]} onUpdate={geo => geo.setAttribute('uv2', new THREE.BufferAttribute(geo.attributes.uv.array, 2))} />
      <meshStandardMaterial
        map={colorMap}
        normalMap={normalMap}
        roughnessMap={roughnessMap}
        displacementMap={displacementMap}
        displacementScale={0.03} // smaller bumps for dirt
      />
    </mesh>
  );
}
