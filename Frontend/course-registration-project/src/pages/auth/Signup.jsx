import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../config";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

  * { box-sizing: border-box; }

  .auth-root {
    min-height: 100vh;
    background: linear-gradient(135deg, #1a2fb8 0%, #2a3fd4 50%, #5b6ef0 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Inter', sans-serif;
    padding: 24px;
  }

  .auth-card {
    display: flex;
    width: 860px;
    max-width: 100%;
    min-height: 520px;
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 24px 60px rgba(0,0,0,0.28);
  }

  .auth-left {
    width: 320px;
    flex-shrink: 0;
    background: linear-gradient(160deg, #1a2fb8 0%, #2a3fd4 60%, #3b50e0 100%);
    padding: 48px 36px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    position: relative;
    overflow: hidden;
  }
  .auth-left::before {
    content: '';
    position: absolute;
    width: 260px; height: 260px;
    border-radius: 50%;
    background: rgba(255,255,255,0.07);
    top: -80px; right: -80px;
  }
  .auth-left::after {
    content: '';
    position: absolute;
    width: 180px; height: 180px;
    border-radius: 50%;
    background: rgba(255,255,255,0.05);
    bottom: -50px; left: -50px;
  }
  .auth-logo-wrap {
    width: 52px; height: 52px;
    border-radius: 14px;
    background: rgba(255,255,255,0.15);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 24px;
    position: relative; z-index: 1;
  }
  .auth-brand-title {
    font-size: 21px;
    font-weight: 700;
    color: #fff;
    line-height: 1.3;
    margin: 0 0 6px;
    position: relative; z-index: 1;
  }
  .auth-brand-sub {
    font-size: 13px;
    color: rgba(255,255,255,0.55);
    margin: 0 0 36px;
    position: relative; z-index: 1;
  }
  .auth-features {
    list-style: none;
    padding: 0; margin: 0;
    display: flex;
    flex-direction: column;
    gap: 14px;
    position: relative; z-index: 1;
  }
  .auth-feature {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 13px;
    color: rgba(255,255,255,0.72);
  }
  .auth-feature-icon {
    width: 20px; height: 20px;
    border-radius: 50%;
    border: 1.5px solid rgba(255,255,255,0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    font-size: 10px;
    color: rgba(255,255,255,0.8);
  }

  .auth-right {
    flex: 1;
    background: #fff;
    padding: 48px 44px;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  .auth-title {
    font-size: 24px;
    font-weight: 700;
    color: #111827;
    margin: 0 0 4px;
  }
  .auth-subtitle {
    font-size: 13.5px;
    color: #6b7280;
    margin: 0 0 28px;
  }

  .auth-toggle {
    display: flex;
    background: #f3f4f6;
    border-radius: 10px;
    padding: 4px;
    margin-bottom: 24px;
    gap: 4px;
  }
  .auth-toggle-btn {
    flex: 1;
    padding: 9px 12px;
    border: none;
    border-radius: 7px;
    font-family: 'Inter', sans-serif;
    font-size: 13.5px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.18s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    background: transparent;
    color: #6b7280;
  }
  .auth-toggle-btn.active {
    background: #fff;
    color: #2a3fd4;
    box-shadow: 0 1px 4px rgba(0,0,0,0.1);
  }

  .auth-role-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    font-weight: 500;
    padding: 5px 11px;
    border-radius: 20px;
    margin-bottom: 20px;
  }
  .auth-role-badge.student {
    background: #eef1fd;
    color: #2a3fd4;
    border: 1px solid #c7d0f8;
  }
  .auth-role-badge.admin {
    background: #fef3c7;
    color: #92400e;
    border: 1px solid #fcd34d;
  }

  .auth-field { margin-bottom: 16px; }
  .auth-label {
    display: block;
    font-size: 13px;
    font-weight: 500;
    color: #374151;
    margin-bottom: 6px;
  }
  .auth-input-wrap { position: relative; }
  .auth-input-icon {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: #9ca3af;
    display: flex;
    align-items: center;
  }
  .auth-input {
    width: 100%;
    border: 1.5px solid #e5e7eb;
    border-radius: 9px;
    padding: 11px 14px 11px 38px;
    font-size: 14px;
    font-family: 'Inter', sans-serif;
    color: #111827;
    outline: none;
    transition: border-color 0.18s, box-shadow 0.18s;
    background: #fff;
  }
  .auth-input::placeholder { color: #9ca3af; }
  .auth-input:focus {
    border-color: #2a3fd4;
    box-shadow: 0 0 0 3px rgba(42,63,212,0.1);
  }
  .auth-hint {
    margin-top: 5px;
    font-size: 12px;
    color: #9ca3af;
  }

  .auth-perks {
    display: flex;
    flex-direction: column;
    gap: 9px;
    margin: 20px 0;
    padding: 16px;
    background: #f5f7ff;
    border: 1.5px solid #dde3fb;
    border-radius: 10px;
  }
  .auth-perk {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 13px;
    color: #4b5563;
  }
  .auth-perk-icon {
    width: 20px; height: 20px;
    border-radius: 50%;
    background: #dde3fb;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 10px;
    color: #2a3fd4;
    flex-shrink: 0;
  }

  .auth-btn {
    width: 100%;
    margin-top: 4px;
    padding: 13px;
    border: none;
    border-radius: 9px;
    font-family: 'Inter', sans-serif;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    background: linear-gradient(135deg, #2a3fd4, #4f5ef0);
    color: #fff;
    box-shadow: 0 4px 16px rgba(42,63,212,0.35);
    transition: all 0.2s;
    letter-spacing: 0.01em;
  }
  .auth-btn:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 8px 24px rgba(42,63,212,0.4);
  }
  .auth-btn:active:not(:disabled) { transform: translateY(0); }
  .auth-btn:disabled { opacity: 0.65; cursor: not-allowed; }

  .auth-terms {
    margin-top: 12px;
    text-align: center;
    font-size: 11.5px;
    color: #9ca3af;
    line-height: 1.6;
  }
  .auth-terms a { color: #6b7280; text-decoration: underline; }

  .auth-footer {
    text-align: center;
    margin-top: 18px;
    font-size: 13.5px;
    color: #6b7280;
  }
  .auth-footer a {
    color: #2a3fd4;
    text-decoration: none;
    font-weight: 600;
    margin-left: 4px;
  }
  .auth-footer a:hover { text-decoration: underline; }

  .auth-spinner {
    display: inline-block;
    width: 14px; height: 14px;
    border: 2px solid rgba(255,255,255,0.35);
    border-top-color: #fff;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
    margin-right: 8px;
    vertical-align: middle;
  }
  @keyframes spin { to { transform: rotate(360deg); } }
`;

export default function Signup() {
  const navigate = useNavigate();
  const [role, setRole] = useState("student"); // "student" | "admin"
  const [form, setForm] = useState({ identifier: "", password: "" });
  const [loading, setLoading] = useState(false);

  const switchRole = (newRole) => {
    setRole(newRole);
    setForm({ identifier: "", password: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: form.identifier,
          password: form.password,
          role,
        }),
      });
      if (!res.ok) {
        const text = await res.text();
        setLoading(false);
        alert(text);
        return;
      }
      setLoading(false);
      alert("Account created successfully!");
      navigate("/login");
    } catch {
      setLoading(false);
      alert("Server error. Please try again.");
    }
  };

  const isStudent = role === "student";

  const studentPerks = [
    ["✦", "Instant access to dashboard"],
    ["✦", "No credit card required"],
    ["✦", "Secure & encrypted data"],
  ];

  const adminPerks = [
    ["✦", "Full admin panel access"],
    ["✦", "Manage students & courses"],
    ["✦", "Secure privileged account"],
  ];

  return (
    <>
      <style>{styles}</style>
      <div className="auth-root">
        <div className="auth-card">

          {/* Left branding panel */}
          <div className="auth-left">
            <div className="auth-logo-wrap">
              <svg viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg" width="28" height="28">
                <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3zM5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z"/>
              </svg>
            </div>
            <h1 className="auth-brand-title">Course Registration</h1>
            <p className="auth-brand-sub">&amp; Scheduling System</p>
            <ul className="auth-features">
              {[
                "Manage your courses easily",
                "Build conflict-free schedules",
                "Track registrations in real-time",
              ].map((f) => (
                <li key={f} className="auth-feature">
                  <span className="auth-feature-icon">✓</span>
                  {f}
                </li>
              ))}
            </ul>
          </div>

          {/* Right form panel */}
          <div className="auth-right">
            <h2 className="auth-title">Create your account</h2>
            <p className="auth-subtitle">Join thousands of users already on board</p>

            {/* Role toggle */}
            <div className="auth-toggle">
              <button
                type="button"
                className={`auth-toggle-btn ${isStudent ? "active" : ""}`}
                onClick={() => switchRole("student")}
              >
                👤 Student
              </button>
              <button
                type="button"
                className={`auth-toggle-btn ${!isStudent ? "active" : ""}`}
                onClick={() => switchRole("admin")}
              >
                🛡 Admin
              </button>
            </div>

            {/* Role context badge */}
            <span className={`auth-role-badge ${role}`}>
              {isStudent ? "🎓 Register with your institutional email" : "🔐 Register with a unique admin username"}
            </span>

            <form onSubmit={handleSubmit}>
              <div className="auth-field">
                <label className="auth-label">
                  {isStudent ? "Email Address" : "Username"}
                </label>
                <div className="auth-input-wrap">
                  <span className="auth-input-icon">
                    {isStudent ? (
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
                      </svg>
                    ) : (
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                      </svg>
                    )}
                  </span>
                  <input
                    key={role}
                    className="auth-input"
                    type={isStudent ? "email" : "text"}
                    placeholder={isStudent ? "you@gmail.com" : "Enter a username"}
                    value={form.identifier}
                    onChange={(e) => setForm({ ...form, identifier: e.target.value })}
                    autoComplete={isStudent ? "email" : "username"}
                    required
                  />
                </div>
                {isStudent && (
                  <p className="auth-hint">Use your Gmail or institutional email address</p>
                )}
                {!isStudent && (
                  <p className="auth-hint">This will be your admin login name</p>
                )}
              </div>

              <div className="auth-field">
                <label className="auth-label">Password</label>
                <div className="auth-input-wrap">
                  <span className="auth-input-icon">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                    </svg>
                  </span>
                  <input
                    className="auth-input"
                    type="password"
                    placeholder="Min. 8 characters"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    required
                  />
                </div>
                <p className="auth-hint">Use a mix of letters, numbers, and symbols</p>
              </div>

              <div className="auth-perks">
                {(isStudent ? studentPerks : adminPerks).map(([icon, text]) => (
                  <div key={text} className="auth-perk">
                    <div className="auth-perk-icon">{icon}</div>
                    {text}
                  </div>
                ))}
              </div>

              <button className="auth-btn" type="submit" disabled={loading}>
                {loading
                  ? <><span className="auth-spinner" />Creating account…</>
                  : `Create ${isStudent ? "Student" : "Admin"} Account →`}
              </button>

              <p className="auth-terms">
                By signing up you agree to our{" "}
                <a href="/terms">Terms of Service</a> and{" "}
                <a href="/privacy">Privacy Policy</a>
              </p>
            </form>

            <div className="auth-footer">
              Already have an account?<a href="/login">Sign in</a>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}