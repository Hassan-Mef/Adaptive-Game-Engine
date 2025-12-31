import React, { useState } from "react";
import "../styles/global.css";
import { loginPlayer } from "../api/player";

export default function LoginScreen({ onBack, onLoginSuccess }) {
  const [activeTab, setActiveTab] = useState("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const switchTab = (tab) => setActiveTab(tab);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await loginPlayer(username, password);
      console.log("Login Success:", result);

      // TODO: store token or user info in context/localStorage if needed
      if (onLoginSuccess) onLoginSuccess(result);
    } catch (err) {
      setError(err.message);
      console.error("Login failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = (e) => {
    e.preventDefault();
    // TODO: add signup logic here
    console.log("Signup submitted");
  };

  return (
    <div>
      <div className="background-overlay"></div>

      <div className="auth-wrapper">
        <div className="auth-card">
          {/* Optional Back Button */}
          {onBack && (
            <button
              className="menu-button secondary-button full-width"
              style={{ marginBottom: "20px" }}
              onClick={onBack}
            >
              ← BACK
            </button>
          )}

          <div className="auth-tabs">
            <button
              className={`tab-btn ${activeTab === "login" ? "active" : ""}`}
              onClick={() => switchTab("login")}
            >
              LOG IN
            </button>
            <button
              className={`tab-btn ${activeTab === "signup" ? "active" : ""}`}
              onClick={() => switchTab("signup")}
            >
              SIGN UP
            </button>
          </div>

          {/* Login Form */}
          <form
            className={`auth-form ${activeTab === "login" ? "active-form" : ""}`}
            style={{ display: activeTab === "login" ? "flex" : "none" }}
            onSubmit={handleLogin}
          >
            <h2 className="form-title">OPERATOR ACCESS</h2>

            <div className="input-group">
              <label>IDENTITY</label>
              <input
                type="text"
                placeholder="Username or Email"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <label>PASSCODE</label>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && <p style={{ color: "red" }}>{error}</p>}

            <button
              type="submit"
              className="menu-button primary-button full-width"
              disabled={loading}
            >
              {loading ? "Logging in..." : "INITIALIZE"}
            </button>
          </form>
          {/* Signup Form */}
          <form
            className={`auth-form ${activeTab === "signup" ? "active-form" : ""}`}
            style={{ display: activeTab === "signup" ? "flex" : "none" }}
            onSubmit={handleSignup}
          >
            <h2 className="form-title">NEW RECRUIT</h2>

            <div className="input-group">
              <label>EMAIL</label>
              <input type="email" placeholder="soldier@example.com" required />
            </div>

            <div className="input-row">
              <div className="input-group">
                <label>CODENAME (USER)</label>
                <input type="text" placeholder="Username" required />
              </div>
              <div className="input-group short">
                <label>AGE</label>
                <input type="number" min="16" placeholder="16+" required />
              </div>
            </div>

            <div className="input-group">
              <label>PASSWORD</label>
              <input type="password" placeholder="Create Password" required />
            </div>

            <div className="input-group">
              <label>CONFIRM</label>
              <input type="password" placeholder="Confirm Password" required />
            </div>

            <div className="terms-group">
              <input type="checkbox" id="terms" required />
              <label htmlFor="terms">
                I agree to the <a href="#">Terms & Conditions</a>
              </label>
            </div>

            <button type="submit" className="menu-button secondary-button full-width">
              REGISTER
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
