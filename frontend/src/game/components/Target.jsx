import { forwardRef, useEffect, useRef } from "react";

const Target = forwardRef(({ position, config }, ref) => {
  if (!config) return null;

  const meshRef = useRef();

  useEffect(() => {
    if (!config.move) return;

    let dir = 1;
    const id = setInterval(() => {
      if (!meshRef.current) return;
      meshRef.current.position.x += 0.05 * dir;
      if (Math.abs(meshRef.current.position.x) > 3) dir *= -1;
    }, 50);

    return () => clearInterval(id);
  }, [config]);

  return (
    <mesh
      ref={(m) => {
        meshRef.current = m;
        if (ref) ref(m);
      }}
      position={position}
    >
      <boxGeometry args={[config.size, config.size, config.size]} />
      <meshStandardMaterial color="red" />
    </mesh>
  );
});

export default Target;
