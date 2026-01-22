import React from "react";
import "../styles/global.css";
import gun from "../assets/gun.png";
export default function HomeScreen({
  onPlay,
  onAnalytics,
  onLeaderboard,
  onLogin,
  isAuthenticated,
}) {
  return (
    <div>
      <div className="background-overlay"></div>
      <div className="main-menu-container">
        <div className="login-container">
          <button className="menu-button login-button" onClick={onLogin}>
            {isAuthenticated ? "LOG OUT" : "LOG IN"}
          </button>
        </div>

        <h1 className="game-title">THUNDER STRIKE</h1>

        <div className="button-group">
          <button className="menu-button secondary-button" onClick={onAnalytics}>
            ANALYTICS
          </button>
          <button className="menu-button primary-button" onClick={onPlay}>
            PLAY
          </button>
          <button
            className="menu-button secondary-button"
            onClick={onLeaderboard}
          >
            LEADERBOARDS
          </button>
        </div>

        <div
          className="weapon-silhouette"
          style={{ backgroundImage: `url(${gun})` }}
        ></div>
      </div>
    </div>
  );
}
