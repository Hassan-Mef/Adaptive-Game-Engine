export default function HomeMenu({ onStart }) {
  return (
    <div style={styles.container}>
      <button style={styles.startButton} onClick={onStart}>
        Start
      </button>
    </div>
  );
}


const styles = {
  container: {
    width: "100vw",
    height: "100vh",
    backgroundColor: "#0e0e0e",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  startButton: {
    padding: "18px 48px",
    fontSize: "24px",
    fontWeight: "600",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    backgroundColor: "#ffffff",
    color: "#000000",
  },
};
