import React, { forwardRef, useImperativeHandle, useRef } from "react";

const Target = forwardRef(({ position }, ref) => {
  const meshRef = useRef();

  // Expose a method to move/respawn the target
  useImperativeHandle(ref, () => ({
    respawn: () => {
      const randomX = (Math.random() - 0.5) * 6;  // -3 to +3
      const randomY = Math.random() * 2 + 2;    // 1.5 to 3.5
      const randomZ = -(Math.random() * 7 + 5);   // -5 to -12
      meshRef.current.position.set(randomX, randomY, randomZ);
    },
    getMesh: () => meshRef.current
  }));

  return (
    <mesh receiveShadow  ref={meshRef} position={position }>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="red" roughness={0.4} metalness={0.1} />
    </mesh>
  );
});

export default Target;
