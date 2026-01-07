import React, { useState } from "react";
import "../styles/global.css";
import { loginPlayer, registerPlayer } from "../api/player";
import { useAuth } from "../contexts/AuthContext";

export default function LoginScreen({ onBack, onLoginSuccess }) {
  const [activeTab, setActiveTab] = useState("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // states for signup
  const [signupEmail, setSignupEmail] = useState("");
  const [signupUsername, setSignupUsername] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupConfirm, setSignupConfirm] = useState("");
  const [signupError, setSignupError] = useState("");
  const [signupLoading, setSignupLoading] = useState(false);

  const { login } = useAuth();

  const switchTab = (tab) => setActiveTab(tab);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await loginPlayer(username, password);

      // 🔐 STORE JWT + USER IN CONTEXT
      login(result.token, result.user);

      if (onLoginSuccess) onLoginSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setSignupError("");

    if (signupPassword !== signupConfirm) {
      setSignupError("Passwords do not match");
      return;
    }

    setSignupLoading(true);

    try {
      await registerPlayer(signupUsername, signupEmail, signupPassword);

      // Success → switch to login
      setActiveTab("login");
      setUsername(signupUsername);
      setPassword("");
    } catch (err) {
      setSignupError(err.message);
    } finally {
      setSignupLoading(false);
    }
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
            className={`auth-form ${
              activeTab === "login" ? "active-form" : ""
            }`}
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
            className={`auth-form ${
              activeTab === "signup" ? "active-form" : ""
            }`}
            style={{ display: activeTab === "signup" ? "flex" : "none" }}
            onSubmit={handleSignup}
          >
            <h2 className="form-title">NEW RECRUIT</h2>

            <div className="input-group">
              <label>EMAIL</label>
              <input
                type="email"
                placeholder="soldier@example.com"
                value={signupEmail}
                onChange={(e) => setSignupEmail(e.target.value)}
                required
              />
            </div>

            <div className="input-row">
              <div className="input-group">
                <label>CODENAME (USER)</label>
                <input
                  type="text"
                  placeholder="Username"
                  value={signupUsername}
                  onChange={(e) => setSignupUsername(e.target.value)}
                  required
                />
              </div>
              <div className="input-group short">
                <label>AGE</label>
                <input type="number" min="16" placeholder="16+" required />
              </div>
            </div>

            <div className="input-group">
              <label>PASSWORD</label>
              <input
                type="password"
                placeholder="Create Password"
                value={signupPassword}
                onChange={(e) => setSignupPassword(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <label>CONFIRM</label>
              <input
                type="password"
                placeholder="Confirm Password"
                value={signupConfirm}
                onChange={(e) => setSignupConfirm(e.target.value)}
                required
              />
            </div>

            <div className="terms-group">
              <input type="checkbox" id="terms" required />
              <label htmlFor="terms">
                I agree to the <a href="#">Terms & Conditions</a>
              </label>
            </div>

            <button
              type="submit"
              className="menu-button secondary-button full-width"
              disabled={signupLoading}
            >
              {signupLoading ? "Registering..." : "REGISTER"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
