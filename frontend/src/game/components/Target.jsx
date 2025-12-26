import { forwardRef , useEffect ,useRef , useImperativeHandle,} from "react";
import { useFrame } from "@react-three/fiber";

const Target = forwardRef(({ position, config }, ref) => {
  if (!config) return null;

  const meshRef = useRef();
  const offset = useRef(Math.random() * Math.PI * 2);

  useImperativeHandle(ref, () => meshRef.current);

  // set initial spawn position
  useEffect(() => {
    if (meshRef.current) {
      meshRef.current.position.set(...position);
    }
  }, [position]);

  // ✅ ONLY useFrame movement
  useFrame((state) => {
    if (!config.move || !meshRef.current) return;

    const t = state.clock.getElapsedTime() + offset.current;

    meshRef.current.position.x += Math.sin(t) * 0.005;
    meshRef.current.position.y += Math.cos(t * 0.8) * 0.003;
  });

  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[config.size, config.size, config.size]} />
      <meshStandardMaterial color="red" />
    </mesh>
  );
});

export default Target;
