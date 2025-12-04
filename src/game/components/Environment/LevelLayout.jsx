import React from "react";
import Walls from "./Walls";
import Props from "./Props";

export default function LevelLayout() {
  return (
    <group name="level-layout">
      <Walls />
      <Props />
    </group>
  );
}
