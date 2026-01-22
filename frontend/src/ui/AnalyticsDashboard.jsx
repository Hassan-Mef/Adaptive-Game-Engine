import { useEffect, useState } from "react";
import {
  LineChart, Line, BarChart, Bar,
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
  XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, Area, AreaChart
} from "recharts";

import {
  getDifficultyHistory,
  getLevelPerformance,
  getPlayerPerformance,
  getPlayerAchievements,
  getPlayerLeaderboard
} from "../api/analytics";

// --- Theme Constants ---
const NEON_PURPLE = "#d000ff";
const ELECTRIC_BLUE = "#00f2ff";
const CHART_TEXT = "rgba(255, 255, 255, 0.7)";

const customTooltipStyle = {
  backgroundColor: "rgba(9, 0, 20, 0.95)",
  border: `1px solid ${ELECTRIC_BLUE}`,
  color: "#fff",
  fontFamily: 'Teko, sans-serif',
  fontSize: '1.2rem',
  boxShadow: `0 0 15px ${ELECTRIC_BLUE}44`
};

// --- Decorative Components ---
const CornerBorders = () => (
  <>
    <div style={{ position: 'absolute', top: 0, left: 0, width: '20px', height: '20px', borderTop: `2px solid ${ELECTRIC_BLUE}`, borderLeft: `2px solid ${ELECTRIC_BLUE}` }} />
    <div style={{ position: 'absolute', top: 0, right: 0, width: '20px', height: '20px', borderTop: `2px solid ${ELECTRIC_BLUE}`, borderRight: `2px solid ${ELECTRIC_BLUE}` }} />
    <div style={{ position: 'absolute', bottom: 0, left: 0, width: '20px', height: '20px', borderBottom: `2px solid ${ELECTRIC_BLUE}`, borderLeft: `2px solid ${ELECTRIC_BLUE}` }} />
    <div style={{ position: 'absolute', bottom: 0, right: 0, width: '20px', height: '20px', borderBottom: `2px solid ${ELECTRIC_BLUE}`, borderRight: `2px solid ${ELECTRIC_BLUE}` }} />
  </>
);

function DifficultyView({ data }) {
  return (
    <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
      <h3 className="stat-label" style={{ color: ELECTRIC_BLUE, marginBottom: '15px' }}>// DIFF_PROGRESSION_LOG</h3>
      <ResponsiveContainer width="100%" height={350}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorDiff" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={ELECTRIC_BLUE} stopOpacity={0.3}/>
              <stop offset="95%" stopColor={ELECTRIC_BLUE} stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis dataKey="attempt_id" stroke={CHART_TEXT} tick={{fontSize: 12}} />
          <YAxis stroke={CHART_TEXT} tick={{fontSize: 12}} />
          <Tooltip contentStyle={customTooltipStyle} />
          <Area type="monotone" dataKey="final_difficulty_value" stroke={ELECTRIC_BLUE} fillOpacity={1} fill="url(#colorDiff)" strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

function LevelView({ data }) {
  return (
    <div style={{ animation: 'fadeIn 0.6s ease-out' }}>
      <h3 className="stat-label" style={{ color: NEON_PURPLE, marginBottom: '15px' }}>// LVL_PERFORMANCE_METRICS</h3>
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis dataKey="difficulty_level" stroke={CHART_TEXT} tick={{fontSize: 12}} />
          <YAxis stroke={CHART_TEXT} tick={{fontSize: 12}} />
          <Tooltip contentStyle={customTooltipStyle} cursor={{fill: 'rgba(208, 0, 255, 0.1)'}} />
          <Bar dataKey="avg_accuracy" fill={NEON_PURPLE} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function PlayerRadar({ data }) {
  if (!data || data.length === 0) return <p>No performance data</p>;

  const normalize = (val, max) => Math.min((val / max) * 100, 100);

  const avg = (arr, key) =>
    arr.reduce((s, d) => s + d[key], 0) / arr.length;

  const adaptability =
    (data.filter(d => d.difficulty_adjustment_flag === "Y").length /
      data.length) * 100;

  const radarData = [
    {
      skill: "Accuracy",
      value: normalize(avg(data, "hit_miss_ratio"), 1)
    },
    {
      skill: "Reaction Speed",
      value: normalize(2000 / avg(data, "reaction_time_avg"), 1)
    },
    {
      skill: "Aggression",
      value: normalize(avg(data, "enemies_killed"), 100)
    },
    {
      skill: "Evasion",
      value: normalize(avg(data, "enemies_dodged"), 50)
    },
    {
      skill: "Adaptability",
      value: adaptability
    }
  ];

  return (
    <div>
      <h3>🧠 Player Skill Radar</h3>
      <ResponsiveContainer width="100%" height={400}>
        <RadarChart data={radarData}>
          <PolarGrid />
          <PolarAngleAxis dataKey="skill" />
          <Radar
            dataKey="value"
            stroke="#00ffcc"
            fill="#00ffcc"
            fillOpacity={0.6}
          />
          <Tooltip />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}


function AchievementView({ data }) {
  return (
    <div style={{ animation: 'fadeIn 0.5s ease-out', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '15px' }}>
      {data.map((a, i) => (
        <div key={i} className="progress-row" style={{ margin: 0, border: `1px solid rgba(0, 242, 255, 0.2)` }}>
          <span className="highlight-blue" style={{ fontSize: '1.2rem' }}>🏆</span>
          <div>
            <div className="highlight-text" style={{ fontSize: '1rem', letterSpacing: '1px' }}>{a.title}</div>
            <div className="stat-label" style={{ fontSize: '0.7rem' }}>{a.description}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

function LeaderboardView({ data }) {
  return (
    <div className="table-container" style={{ animation: 'fadeIn 0.5s ease-out', border: 'none', background: 'transparent' }}>
      <table className="leaderboard-table" style={{ fontSize: '1.1rem' }}>
        <thead>
          <tr>
            <th>RANK</th>
            <th>OPERATOR</th>
            <th>COMBAT_RATING</th>
          </tr>
        </thead>
        <tbody>
          {data.map((p, i) => (
            <tr key={i}>
              <td className="highlight-blue">#{p.leaderboard_rank}</td>
              <td style={{ letterSpacing: '2px' }}>{p.username}</td>
              <td className="highlight-purple">{p.difficulty_score}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const TABS = ["Difficulty", "Levels", "Player", "Achievements", "Leaderboard"];

export default function AnalyticsDashboard({ onBack }) {
  const [tab, setTab] = useState("Difficulty");
  const [data, setData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      let res;
      switch (tab) {
        case "Difficulty": res = await getDifficultyHistory(); break;
        case "Levels": res = await getLevelPerformance(); break;
        case "Player": res = await getPlayerPerformance(); break;
        case "Achievements": res = await getPlayerAchievements(); break;
        case "Leaderboard": res = await getPlayerLeaderboard(); break;
        default: res = { data: { data: [] } };
      }
      setData(res.data.data || []);
    }
    fetchData();
  }, [tab]);

  return (
    <div style={{ 
      width: '100vw', 
      height: '100vh', 
      background: 'var(--bg-dark)', 
      color: 'white', 
      overflow: 'hidden', 
      position: 'relative',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <div className="background-overlay" />
      
      {/* Top Header Bar */}
      <header style={{ 
        padding: '20px 40px', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        borderBottom: '1px solid rgba(208, 0, 255, 0.3)',
        zIndex: 10
      }}>
        <div>
          <h2 className="game-title" style={{ fontSize: '2.5rem', margin: 0 }}>ANALYTICS_CORE</h2>
          <div className="stat-label" style={{ color: ELECTRIC_BLUE }}>
            <span style={{ animation: 'pulse 2s infinite' }}>●</span> SYSTEM_STATUS: STABLE // ENCRYPTED_LINK_ACTIVE
          </div>
        </div>

        <div className="auth-tabs" style={{ marginBottom: 0, border: 'none' }}>
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)} className={`tab-btn ${tab === t ? "active" : ""}`} style={{ fontSize: '1.2rem', padding: '0 20px' }}>
              {t.toUpperCase()}
            </button>
          ))}
        </div>

        <button className="login-button" onClick={onBack} style={{ position: 'static' }}>
          DISCONNECT
        </button>
      </header>

      {/* Main Content Area */}
      <main style={{ 
        flex: 1, 
        padding: '40px', 
        zIndex: 10, 
        display: 'flex', 
        justifyContent: 'center', 
        overflowY: 'auto' 
      }}>
        <div style={{ 
          width: '100%', 
          maxWidth: '1400px', 
          background: 'rgba(13, 2, 26, 0.6)', 
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.05)',
          padding: '30px',
          position: 'relative',
          boxShadow: '0 0 40px rgba(0,0,0,0.5)'
        }}>
          <CornerBorders />
          
          <div style={{ minHeight: '500px' }}>
            {tab === "Difficulty" && <DifficultyView data={data} />}
            {tab === "Levels" && <LevelView data={data} />}
            {tab === "Player" && <PlayerRadar data={data} />}
            {tab === "Achievements" && <AchievementView data={data} />}
            {tab === "Leaderboard" && <LeaderboardView data={data} />}
          </div>
        </div>
      </main>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.3; }
          100% { opacity: 1; }
        }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: var(--neon-purple); }
      `}} />
    </div>
  );
}