import Crosshair from "./game/components/Crosshair";
import GameCanvas from "./game/GameCanvas";

export default function App() {
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <GameCanvas />
      <Crosshair/>
    </div>
  );
}
