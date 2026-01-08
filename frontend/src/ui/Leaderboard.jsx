import { useEffect, useState } from "react";
import { getLeaderboard } from "../api/leaderboard";
import "../styles/global.css"; // Ensure this is imported!

export default function Leaderboard({ onBack }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLeaderboard()
      .then(setRows)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="auth-wrapper"><div className="form-title">LOADING DATA...</div></div>;

  return (
    <div className="leaderboard-page">
      {/* This adds the purple grid and glow */}
      <div className="background-overlay"></div>

      <div className="auth-wrapper">
        <div className="auth-card leaderboard-card">
          <h2 className="game-title" style={{ fontSize: '3rem', marginBottom: '20px' }}>
            RANKINGS
          </h2>

          <div className="table-container">
            <table className="leaderboard-table">
              <thead>
                <tr>
                  <th>RANK</th>
                  <th>OPERATOR</th>
                  <th>DIFF</th>
                  <th>SESSIONS</th>
                  <th>AVG SCORE</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((p) => (
                  <tr key={p.player_id}>
                    <td className="highlight-blue">#{p.leaderboard_rank}</td>
                    <td>{p.username}</td>
                    <td>{p.recommended_level}</td>
                    <td>{p.sessions_played}</td>
                    <td className="highlight-purple">{Math.round(p.avg_score ?? 0)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button className="menu-button secondary-button full-width" onClick={onBack} style={{marginTop: '20px'}}>
            ← BACK TO MENU
          </button>
        </div>
      </div>
    </div>
  );
}