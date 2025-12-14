import React, { useRef } from 'react';
import { useLoader } from '@react-three/fiber';
import * as THREE from 'three';
import { EXRLoader } from 'three/examples/jsm/loaders/EXRLoader';

export default function Ground() {
  const meshRef = useRef();

const colorMap = useLoader(
    THREE.TextureLoader,
    "/Textures/granite_tile_2k.blend/textures/granite_tile_diff_2k.jpg"
  );

  const displacementMap = useLoader(
    THREE.TextureLoader,
    "/Textures/granite_tile_2k.blend/textures/granite_tile_disp_2k.png"
  );

  // EXR maps with EXRLoader
  const normalMap = useLoader(
    EXRLoader,
    "/Textures/granite_tile_2k.blend/textures/granite_tile_nor_gl_2k.exr"
  );

  const roughnessMap = useLoader(
    EXRLoader,
    "/Textures/granite_tile_2k.blend/textures/granite_tile_rough_2k.exr"
  );

  return (
    <mesh name='ground' ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[100, 100, 12, 12]} onUpdate={geo => geo.setAttribute('uv2', new THREE.BufferAttribute(geo.attributes.uv.array, 2))} />
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
