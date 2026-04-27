import React, { useState, useEffect } from "react";
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

  .auth-captcha-section { margin-bottom: 16px; }
  .auth-captcha-label {
    display: block;
    font-size: 13px;
    font-weight: 500;
    color: #374151;
    margin-bottom: 8px;
  }
  .auth-captcha-box {
    background: #eef1fd;
    border: 1.5px solid #c7d0f8;
    border-radius: 9px;
    padding: 13px 18px;
    font-size: 22px;
    font-weight: 700;
    color: #2a3fd4;
    letter-spacing: 8px;
    text-decoration: line-through;
    text-decoration-style: wavy;
    text-decoration-color: rgba(42,63,212,0.3);
    user-select: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 8px;
    transition: background 0.18s;
  }
  .auth-captcha-box:hover { background: #e2e7fc; }
  .auth-captcha-refresh { font-size: 16px; color: #6b7280; text-decoration: none; }
  .auth-captcha-input {
    width: 100%;
    border: 1.5px solid #e5e7eb;
    border-radius: 9px;
    padding: 11px 14px;
    font-size: 14px;
    font-family: 'Inter', sans-serif;
    color: #111827;
    outline: none;
    transition: border-color 0.18s, box-shadow 0.18s;
    background: #fff;
  }
  .auth-captcha-input::placeholder { color: #9ca3af; }
  .auth-captcha-input:focus {
    border-color: #2a3fd4;
    box-shadow: 0 0 0 3px rgba(42,63,212,0.1);
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

  .auth-btn {
    width: 100%;
    margin-top: 20px;
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

export default function Login() {
  const navigate = useNavigate();
  const [role, setRole] = useState("student");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [captcha, setCaptcha] = useState("");
  const [userCaptcha, setUserCaptcha] = useState("");
  const [loading, setLoading] = useState(false);

  const generateCaptcha = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let code = "";
    for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
    setCaptcha(code);
  };

  useEffect(() => { generateCaptcha(); }, []);

  const switchRole = (newRole) => {
    setRole(newRole);
    setIdentifier("");
    setPassword("");
    setUserCaptcha("");
    generateCaptcha();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (userCaptcha.toUpperCase() !== captcha) {
      alert("Invalid CAPTCHA. Please try again.");
      generateCaptcha();
      setUserCaptcha("");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: identifier,
          password,
          role
        }),
      });

      if (!res.ok) {
        setLoading(false);
        alert("Invalid credentials");
        return;
      }

      const data = await res.json();

      localStorage.setItem("token", data.token);
      localStorage.setItem("loggedIn", "true");
      localStorage.setItem("role", data.role);
      localStorage.setItem("username", data.username);
      localStorage.setItem("userId", data.id);

      setLoading(false);

      navigate("/dashboard");
    } catch {
      setLoading(false);
      alert("Server error. Please try again.");
    }
  };

  const isStudent = role === "student";

  return (
    <>
      <style>{styles}</style>
      <div className="auth-root">
        <div className="auth-card">

          <div className="auth-left">
            <div className="auth-logo-wrap">
              <svg viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg" width="28" height="28">
                <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3zM5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z"/>
              </svg>
            </div>
            <h1 className="auth-brand-title">Course Registration</h1>
            <p className="auth-brand-sub">& Scheduling System</p>
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

          <div className="auth-right">
            <h2 className="auth-title">Welcome back</h2>
            <p className="auth-subtitle">Sign in to your account to continue</p>

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

            <span className={`auth-role-badge ${role}`}>
              {isStudent ? "🎓 Sign in with your institutional email" : "🔐 Sign in with your admin username"}
            </span>

            <form onSubmit={handleSubmit}>
              <div className="auth-field">
                <label className="auth-label">
                  {isStudent ? "Email Address" : "Username"}
                </label>
                <div className="auth-input-wrap">
                  <span className="auth-input-icon">
                    {isStudent ? (
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                      </svg>
                    ) : (
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                      </svg>
                    )}
                  </span>

                  <input
                    key={role}
                    className="auth-input"
                    type={isStudent ? "email" : "text"}
                    placeholder={isStudent ? "you@klu.ac.in" : "Enter your username"}
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="auth-field">
                <label className="auth-label">Password</label>
                <div className="auth-input-wrap">
                  <input
                    className="auth-input"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="auth-captcha-section">
                <label className="auth-captcha-label">CAPTCHA Verification</label>

                <div
                  className="auth-captcha-box"
                  onClick={generateCaptcha}
                >
                  <span>{captcha}</span>
                  <span className="auth-captcha-refresh">↻</span>
                </div>

                <input
                  className="auth-captcha-input"
                  placeholder="Type the characters above"
                  value={userCaptcha}
                  onChange={(e) => setUserCaptcha(e.target.value)}
                  required
                />
              </div>

              <button
                className="auth-btn"
                type="submit"
                disabled={loading}
              >
                {loading
                  ? <><span className="auth-spinner" />Signing in…</>
                  : `Sign In as ${isStudent ? "Student" : "Admin"}`
                }
              </button>
            </form>

            <div className="auth-footer">
              Don't have an account?<a href="/signup">Create one</a>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}