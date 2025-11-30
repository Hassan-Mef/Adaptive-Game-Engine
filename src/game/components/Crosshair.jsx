export default function Crosshair() {
  return (
    <div
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "10px",
        height: "10px",
        pointerEvents: "none",
        zIndex: 10,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "0",
          width: "100%",
          height: "2px",
          backgroundColor: "white",
          transform: "translateY(-1px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "0",
          width: "2px",
          height: "100%",
          backgroundColor: "white",
          transform: "translateX(-1px)",
        }}
      />
    </div>
  );
}
