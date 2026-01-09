import { useState, useEffect } from "react";
import Crosshair from "./game/components/Crosshair";
import GameCanvas from "./game/GameCanvas";
import GameHUD from "./ui/GameHUD";
import GameOverlay from "./ui/GameOverlay";
import RoundSummary from "./ui/RoundSummary";
import SessionSummary from "./ui/SessionSummary";
import HomeScreen from "./ui/HomeScreen";
import LoginScreen from "./ui/LoginScreen";
import Leaderboard from "./ui/Leaderboard";
import { useAuth } from "./contexts/AuthContext";
import AnalyticsDashboard from "./ui/AnalyticsDashboard";
import { startSession, getSessionEntryState } from "./api/game";

export default function App() {
  const { isAuthenticated, logout, loading } = useAuth();

  const [stats, setStats] = useState(null);
  const [roundKey, setRoundKey] = useState(0);
  const [screen, setScreen] = useState("HOME");
  const [uiMode, setUiMode] = useState("HOME");

  // Keep difficulty across sessions
  const [persistentDifficulty, setPersistentDifficulty] = useState(null);

  const [overlayApi, setOverlayApi] = useState(null);
  const [roundSummary, setRoundSummary] = useState(null);
  const [sessionSummary, setSessionSummary] = useState(null);
  const [sessionId, setSessionId] = useState(null);

  if (loading) return null;

  const handleSessionFinish = async (session) => {
    if (!session || !session.rounds || session.rounds.length === 0) return;

    console.log("[APP] Session Finished:", session);

    if (sessionId) {
      // ✅ Call backend and get updated difficulty
      const result = await import("./api/game").then(({ endSession }) =>
        endSession(sessionId)
      );

      // ✅ Update persistent difficulty
      if (result?.data?.difficulty) {
        const { DifficultyScore, RecommendedLevelID } = result.data.difficulty;
        setPersistentDifficulty({
          tier: "AUTO", // or map from RecommendedLevelID if needed
          subLevel: DifficultyScore,
        });
      }
    }

    setSessionSummary(session);
    setUiMode("SESSION_SUMMARY");
  };

  const Difficulty_score_converter = (score) => {
    if (score < 20) return "Easy";
    if (score < 50 && score < 80) return "Medium";
    return "Hard";
  };

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* GAME LAYER: Stays mounted during SESSION_SUMMARY to prevent WebGL crash */}
      {screen === "GAME" && (
        <>
          <GameCanvas
            key={roundKey}
            onStatsUpdate={setStats}
            initialDifficulty={persistentDifficulty}
            onGameReady={setOverlayApi}
            onRoundEnd={async (data) => {
              setRoundSummary(data);
              setUiMode("ROUND_SUMMARY");

              if (!sessionId) return;

              const { round, liveStats, difficulty } = data;

              const accuracy =
                liveStats.shotsFired > 0
                  ? liveStats.shotsHit / liveStats.shotsFired
                  : 0;

              const avgReactionTime =
                liveStats.reactionTimes.length > 0
                  ? liveStats.reactionTimes.reduce((a, b) => a + b, 0) /
                    liveStats.reactionTimes.length
                  : null;

              await import("./api/game").then(({ logRound }) =>
                logRound({
                  attemptId: sessionId,
                  roundIndex: round,
                  difficultyTier: difficulty.tier,
                  difficultySublevel: difficulty.subLevel,
                  accuracy,
                  shotsFired: liveStats.shotsFired,
                  shotsHit: liveStats.shotsHit,
                  avgReactionTime,
                  roundDuration: liveStats.duration ?? 0,
                })
              );
            }}
            onSessionFinish={handleSessionFinish}
          />
          <Crosshair />
          {stats && (
            <GameHUD
              timeLeft={stats.timeLeft}
              shots={stats.shotsFired}
              hits={stats.shotsHit}
              score={stats.score}
            />
          )}
          {overlayApi && (
            <GameOverlay
              getEvents={overlayApi.getEvents}
              clearEvents={overlayApi.clearEvents}
            />
          )}
        </>
      )}

      {/* UI OVERLAY LAYER */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          zIndex: 10,
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            pointerEvents: uiMode === "GAME" ? "none" : "auto",
            userSelect: uiMode === "GAME" ? "none" : "auto",
          }}
        >
          {screen === "HOME" && uiMode === "HOME" && (
            <HomeScreen
              // Inside HomeScreen onPlay
              onPlay={async () => {
                if (!isAuthenticated) {
                  setScreen("LOGIN");
                  return;
                }

                // 1️⃣ Get previous difficulty
                const entry = await getSessionEntryState();
                console.log("[APP] Session Entry State:", entry);

                // 2️⃣ Start session
                const attemptId = await startSession();
                console.log("[APP] Started Session with ID:", attemptId);
                setSessionId(attemptId);

                // 3️⃣ Apply difficulty if exists
                if (entry.hasHistory) {
                  setPersistentDifficulty({
                    tier: Difficulty_score_converter(entry.difficultyScore),
                    subLevel: entry.difficultyScore,
                  });
                } else {
                  setPersistentDifficulty(null); // calibration required
                }

                // 4️⃣ Reset stats and round key
                setStats(null);
                setRoundKey((k) => k + 1);

                // 5️⃣ Only show GAME screen AFTER persistentDifficulty is set
                setScreen("GAME");
                setUiMode("GAME");
              }}
              onSettings={() => setScreen("ANALYTICS")}
              onLeaderboard={() => setScreen("LEADERBOARD")}
              onLogin={isAuthenticated ? logout : () => setScreen("LOGIN")}
              isAuthenticated={isAuthenticated}
            />
          )}

          {screen === "LOGIN" && (
            <LoginScreen
              onBack={() => setScreen("HOME")}
              onLoginSuccess={() => setScreen("HOME")}
            />
          )}
          {screen === "ANALYTICS" && (
            <AnalyticsDashboard onBack={() => setScreen("HOME")} />
          )}

          {screen === "LEADERBOARD" && (
            <Leaderboard onBack={() => setScreen("HOME")} />
          )}

          {uiMode === "ROUND_SUMMARY" && (
            <RoundSummary
              data={roundSummary}
              onContinue={() => {
                overlayApi?.resumeNextRound();
                setRoundSummary(null);
                setUiMode("GAME");
              }}
            />
          )}

          {uiMode === "SESSION_SUMMARY" && (
            <SessionSummary
              data={sessionSummary}
              onRestart={async () => {
                // Generate new session ID
                const newAttemptId = await startSession();
                setSessionId(newAttemptId);

                // Reset persistent difficulty if you want to keep previous, keep as is
                // Start new game loop
                overlayApi?.resumeNextRound(); // optionally call start() if needed
                setRoundKey((k) => k + 1);
                setStats(null);
                setUiMode("GAME");
              }}
              onExit={() => {
                setSessionSummary(null);
                setPersistentDifficulty(null);
                setSessionId(null);
                setUiMode("HOME");
                setScreen("HOME");
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
