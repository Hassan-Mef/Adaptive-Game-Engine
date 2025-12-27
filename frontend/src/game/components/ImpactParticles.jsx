import { useRef, useEffect, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Points, PointMaterial } from "@react-three/drei";

export default function ImpactParticles({ position, onComplete }) {
  const pointsRef = useRef();

  const count = 20;

  // Particle data
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      temp.push({
        pos: new THREE.Vector3(0, 0, 0),
        vel: new THREE.Vector3(
          (Math.random() - 0.5) * 0.15,
          (Math.random() - 0.5) * 0.15,
          (Math.random() - 0.5) * 0.15
        ),
      });
    }
    return temp;
  }, []);

  const positions = useMemo(
    () => new Float32Array(count * 3),
    [count]
  );

  // Remove after short lifetime
  useEffect(() => {
    const t = setTimeout(onComplete, 300);
    return () => clearTimeout(t);
  }, [onComplete]);

  useFrame(() => {
    particles.forEach((p, i) => {
      p.pos.add(p.vel);

      positions[i * 3] = p.pos.x;
      positions[i * 3 + 1] = p.pos.y;
      positions[i * 3 + 2] = p.pos.z;
    });

    if (pointsRef.current) {
      pointsRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <Points ref={pointsRef} position={position}>
      <PointMaterial size={0.12} color="yellow" transparent opacity={1} />

      <bufferAttribute
        attachObject={["attributes", "position"]}   // <-- THE FIX
        array={positions}
        count={count}
        itemSize={3}
      />
    </Points>
  );
}
