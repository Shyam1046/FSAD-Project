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
  .auth-error {
    margin-top: 5px;
    font-size: 12px;
    color: #dc2626;
  }
  .auth-btn {
    width: 100%;
    margin-top: 8px;
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
  }
  .auth-btn:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 8px 24px rgba(42,63,212,0.4);
  }
  .auth-btn:disabled { opacity: 0.65; cursor: not-allowed; }
  .auth-back {
    text-align: center;
    margin-top: 18px;
    font-size: 13.5px;
    color: #6b7280;
  }
  .auth-back a {
    color: #2a3fd4;
    text-decoration: none;
    font-weight: 600;
    margin-left: 4px;
  }
  .auth-back a:hover { text-decoration: underline; }
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

export default function ChangePassword() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", currentPassword: "", newPassword: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.newPassword.length < 8) {
      setError("New password must be at least 8 characters.");
      return;
    }
    if (form.newPassword !== form.confirmPassword) {
      setError("New passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/auth/change-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: form.username,
          password: form.currentPassword,
          newPassword: form.newPassword,
        }),
      });

      const text = await res.text();
      if (!res.ok) { setError(text); setLoading(false); return; }

      alert("Password changed successfully!");
      navigate("/login");
    } catch {
      setError("Server error. Please try again.");
    }
    setLoading(false);
  };

  const LockIcon = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
  );

  const UserIcon = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
    </svg>
  );

  return (
    <>
      <style>{styles}</style>
      <div className="auth-root">
        <div className="auth-card">

          <div className="auth-left">
            <div className="auth-logo-wrap">
              <svg viewBox="0 0 24 24" fill="white" width="28" height="28">
                <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3zM5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z"/>
              </svg>
            </div>
            <h1 className="auth-brand-title">Course Registration</h1>
            <p className="auth-brand-sub">&amp; Scheduling System</p>
            <ul className="auth-features">
              {[
                "Keep your account secure",
                "Update anytime from settings",
                "Changes apply immediately",
              ].map((f) => (
                <li key={f} className="auth-feature">
                  <span className="auth-feature-icon">✓</span>
                  {f}
                </li>
              ))}
            </ul>
          </div>

          <div className="auth-right">
            <h2 className="auth-title">Change Password</h2>
            <p className="auth-subtitle">Enter your current password and choose a new one</p>

            <form onSubmit={handleSubmit}>
              <div className="auth-field">
                <label className="auth-label">Username</label>
                <div className="auth-input-wrap">
                  <span className="auth-input-icon"><UserIcon /></span>
                  <input
                    className="auth-input"
                    type="text"
                    placeholder="Your username"
                    value={form.username}
                    onChange={(e) => setForm({ ...form, username: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="auth-field">
                <label className="auth-label">Current Password</label>
                <div className="auth-input-wrap">
                  <span className="auth-input-icon"><LockIcon /></span>
                  <input
                    className="auth-input"
                    type="password"
                    placeholder="Enter current password"
                    value={form.currentPassword}
                    onChange={(e) => setForm({ ...form, currentPassword: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="auth-field">
                <label className="auth-label">New Password</label>
                <div className="auth-input-wrap">
                  <span className="auth-input-icon"><LockIcon /></span>
                  <input
                    className="auth-input"
                    type="password"
                    placeholder="Min. 8 characters"
                    value={form.newPassword}
                    onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
                    required
                  />
                </div>
                <p className="auth-hint">Use a mix of letters, numbers, and symbols</p>
              </div>

              <div className="auth-field">
                <label className="auth-label">Confirm New Password</label>
                <div className="auth-input-wrap">
                  <span className="auth-input-icon"><LockIcon /></span>
                  <input
                    className="auth-input"
                    type="password"
                    placeholder="Repeat new password"
                    value={form.confirmPassword}
                    onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                    required
                  />
                </div>
                {error && <p className="auth-error">{error}</p>}
              </div>

              <button className="auth-btn" type="submit" disabled={loading}>
                {loading ? <><span className="auth-spinner" />Updating…</> : "Change Password →"}
              </button>
            </form>

            <div className="auth-back">
              Back to <a href="/login">Sign In</a>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}