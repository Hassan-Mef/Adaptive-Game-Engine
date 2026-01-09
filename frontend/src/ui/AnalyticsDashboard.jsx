import { useEffect, useState } from "react";
import {
  LineChart, Line, BarChart, Bar,
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
  XAxis, YAxis, Tooltip, ResponsiveContainer
} from "recharts";

import {
  getDifficultyHistory,
  getLevelPerformance,
  getPlayerPerformance,
  getPlayerAchievements,
  getPlayerLeaderboard
} from "../api/analytics";

function DifficultyView({ data }) {
  return (
    <>
      <h3>Difficulty Progression</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <XAxis dataKey="attempt_id" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="final_difficulty_value"
            stroke="#00ffcc"
          />
        </LineChart>
      </ResponsiveContainer>
    </>
  );
}

function LevelView({ data }) {
  return (
    <>
      <h3>Level Performance</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <XAxis dataKey="difficulty_level" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="avg_accuracy" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </>
  );
}


function PlayerRadar({ data }) {
  return (
    <>
      <h3>Player Skill Profile</h3>
      <ResponsiveContainer width="100%" height={350}>
        <RadarChart data={data}>
          <PolarGrid />
          <PolarAngleAxis dataKey="difficulty_adjustment_flag" />
          <Radar
            name="Skill"
            dataKey="hit_miss_ratio"
            stroke="#00ff88"
            fill="#00ff88"
            fillOpacity={0.6}
          />
          <Tooltip />
        </RadarChart>
      </ResponsiveContainer>
    </>
  );
}

function AchievementView({ data }) {
  return (
    <>
      <h3>Achievements</h3>
      <ul>
        {data.map((a, i) => (
          <li key={i}>
            🏆 <strong>{a.title}</strong> — {a.description}
          </li>
        ))}
      </ul>
    </>
  );
}


function LeaderboardView({ data }) {
  return (
    <>
      <h3>Leaderboard</h3>
      <table border="1" cellPadding="6">
        <thead>
          <tr>
            <th>Rank</th>
            <th>Player</th>
            <th>Difficulty Score</th>
          </tr>
        </thead>
        <tbody>
          {data.map((p, i) => (
            <tr key={i}>
              <td>{p.leaderboard_rank}</td>
              <td>{p.username}</td>
              <td>{p.difficulty_score}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}


const TABS = [
  "Difficulty",
  "Levels",
  "Player",
  "Achievements",
  "Leaderboard"
];

export default function AnalyticsDashboard({ onBack }) {
  const [tab, setTab] = useState("Difficulty");
  const [data, setData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      let res;
      switch (tab) {
        case "Difficulty":
          res = await getDifficultyHistory();
          break;
        case "Levels":
          res = await getLevelPerformance();
          break;
        case "Player":
          res = await getPlayerPerformance();
          break;
        case "Achievements":
          res = await getPlayerAchievements();
          break;
        case "Leaderboard":
          res = await getPlayerLeaderboard();
          break;
        default:
          res = { data: { data: [] } };
      }
      setData(res.data.data || []);
    }

    fetchData();
  }, [tab]);

  return (
    <div style={{ padding: 20 }}>
      <h2>📊 Analytics Dashboard</h2>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        {TABS.map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              padding: "8px 14px",
              background: tab === t ? "#444" : "#222",
              color: "#fff",
              border: "none",
              cursor: "pointer"
            }}
          >
            {t}
          </button>
        ))}
        <button onClick={onBack}>⬅ Back</button>
      </div>

      {/* Content */}
      {tab === "Difficulty" && <DifficultyView data={data} />}
      {tab === "Levels" && <LevelView data={data} />}
      {tab === "Player" && <PlayerRadar data={data} />}
      {tab === "Achievements" && <AchievementView data={data} />}
      {tab === "Leaderboard" && <LeaderboardView data={data} />}
    </div>
  );
}
