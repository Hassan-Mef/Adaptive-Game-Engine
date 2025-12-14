import React from "react";
import Walls from "./Walls";
import Props from "./Props";
import Crate from "./Props/Crate";

export default function LevelLayout() {
  return (
    <group name="level-layout">
      <Walls />
      <Props />
      <Crate position={[-18, 0, -12]} rotation={[0, Math.PI / 4, 0]} scale={[2.5,2.5,2.5]} />
    </group>
  );
}
