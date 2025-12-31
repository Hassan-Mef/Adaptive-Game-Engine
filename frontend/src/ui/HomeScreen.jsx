import React from "react";
import "../styles/global.css";
import gun from "../assets/gun.png"

export default function HomeScreen() {
  return (
    <div>
      <div className="background-overlay"></div>

      <div className="login-container">
        <button className="menu-button login-button">LOG IN</button>
      </div>

      <div className="main-menu-container">
        <h1 className="game-title">THUNDER STRIKE</h1>

        <div className="button-group">
          <button className="menu-button secondary-button">SETTINGS</button>
          <button className="menu-button primary-button">PLAY</button>
          <button className="menu-button secondary-button">LEADERBOARDS</button>
        </div>

        <div
          className="weapon-silhouette"
          style={{ backgroundImage: `url(${gun})` }}
        ></div>
      </div>
    </div>
  );
}
