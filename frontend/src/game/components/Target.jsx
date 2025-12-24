import React, { forwardRef, useImperativeHandle, useRef } from "react";

const Target = forwardRef(({ position, isRunning }, ref) => {
  const meshRef = useRef();

  useImperativeHandle(ref, () => ({
    respawn: () => {
      if (!isRunning) return;

      const randomX = (Math.random() - 0.5) * 6;
      const randomY = Math.random() * 2 + 2;
      const randomZ = -(Math.random() * 7 + 5);
      meshRef.current.position.set(randomX, randomY, randomZ);
    },
    getMesh: () => meshRef.current,
  }));

  return (
    <mesh ref={meshRef} position={position}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="red" />
    </mesh>
  );
});

export default Target;
