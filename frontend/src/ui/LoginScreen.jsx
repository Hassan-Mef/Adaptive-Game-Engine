import React, { useState } from "react";
import "./style.css";
import "./login-style.css";

export default function LoginScreen() {
  const [activeTab, setActiveTab] = useState("login");

  const switchTab = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div>
      <div className="background-overlay"></div>

      <div className="auth-wrapper">
        <div className="auth-card">
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

          <form
            className={`auth-form ${activeTab === "login" ? "active-form" : ""}`}
            style={{ display: activeTab === "login" ? "flex" : "none" }}
          >
            <h2 className="form-title">OPERATOR ACCESS</h2>

            <div className="input-group">
              <label>IDENTITY</label>
              <input type="text" placeholder="Username or Email" required />
            </div>

            <div className="input-group">
              <label>PASSCODE</label>
              <input type="password" placeholder="Password" required />
            </div>

            <button type="submit" className="menu-button primary-button full-width">
              INITIALIZE
            </button>
            <p className="helper-text">
              Forgot Credentials? <a href="#">Reset Here</a>
            </p>
          </form>

          <form
            className={`auth-form ${activeTab === "signup" ? "active-form" : ""}`}
            style={{ display: activeTab === "signup" ? "flex" : "none" }}
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
