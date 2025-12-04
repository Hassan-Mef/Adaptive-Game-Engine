import React from "react";

export default function Props() {
  return (
    <group name="props">
      {/* Crate 1 */}
      <mesh position={[-18, 0.5, -12]} castShadow>
        <boxGeometry args={[1.5, 1.5, 1.5]} />
        <meshStandardMaterial color="#a57c48" />
      </mesh>

      {/* Crate 2 */}
      <mesh position={[-18, 2, -12]} castShadow>
        <boxGeometry args={[1.5, 1.5, 1.5]} />
        <meshStandardMaterial color="#5a5245" />
      </mesh>

      {/* Barrel-like cylinder */}
      <mesh position={[18, 1, -17]} castShadow>
        <cylinderGeometry args={[0.8, 0.8, 4, 16]} />
        <meshStandardMaterial color="#6b6b6b" />
      </mesh>
    </group>
  );
}
