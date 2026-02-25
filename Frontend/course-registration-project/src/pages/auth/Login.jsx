import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  GraduationCap, Eye, EyeOff, RefreshCw,
  AlertCircle, CheckCircle, Shield, User, Mail, Lock
} from "lucide-react";

// ── MUST be outside Login to prevent focus loss on every keystroke ──
function InputField({ label, type, value, onChange, onBlur, error, touched, placeholder, icon: Icon, rightEl }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-600 mb-1.5">{label}</label>
      <div className="relative">
        {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />}
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={e => onChange(e.target.value)}
          onBlur={onBlur}
          className={`w-full ${Icon ? 'pl-10' : 'pl-4'} ${rightEl ? 'pr-10' : 'pr-4'} py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 transition-all
            ${error && touched
              ? 'border-red-400 focus:ring-red-200 bg-red-50'
              : 'border-slate-200 focus:ring-blue-200 focus:border-blue-400 bg-white'}`}
        />
        {rightEl && <div className="absolute right-3 top-1/2 -translate-y-1/2">{rightEl}</div>}
      </div>
      {error && touched && (
        <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />{error}
        </p>
      )}
    </div>
  );
}

export default function Login() {
  const navigate = useNavigate();
  const [userType, setUserType] = useState("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [captcha, setCaptcha] = useState("");
  const [userCaptcha, setUserCaptcha] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);
  const [captchaError, setCaptchaError] = useState(false);

  const generateCaptcha = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let code = "";
    for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
    setCaptcha(code);
    setUserCaptcha("");
    setCaptchaError(false);
  };

  useEffect(() => { generateCaptcha(); }, []);

  const validate = ({ e = email, p = password, c = userCaptcha } = {}) => {
    const errs = {};
    if (!e) errs.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)) errs.email = "Enter a valid email";
    if (!p) errs.password = "Password is required";
    else if (p.length < 6) errs.password = "Minimum 6 characters";
    if (!c) errs.captcha = "Enter the CAPTCHA";
    return errs;
  };

  const handleBlur = (field) => {
    setTouched(t => ({ ...t, [field]: true }));
    setErrors(validate());
  };

  const handleEmailChange = (val) => {
    setEmail(val);
    if (touched.email) setErrors(validate({ e: val }));
  };

  const handlePasswordChange = (val) => {
    setPassword(val);
    if (touched.password) setErrors(validate({ p: val }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setTouched({ email: true, password: true, captcha: true });
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    if (userCaptcha.toUpperCase() !== captcha) {
      setCaptchaError(true);
      generateCaptcha();
      return;
    }
    setLoading(true);
    setTimeout(() => {
      localStorage.setItem("loggedIn", "true");
      localStorage.setItem("userType", userType);
      navigate(userType === "admin" ? "/admin" : "/dashboard");
    }, 1200);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-white/5 rounded-full" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-white/5 rounded-full" />
        <div className="absolute top-1/2 left-1/4 w-48 h-48 bg-white/5 rounded-full" />
      </div>

      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl flex flex-col md:flex-row overflow-hidden">

        {/* Left Panel */}
        <div className="md:w-5/12 bg-gradient-to-br from-blue-600 to-indigo-700 flex flex-col items-center justify-center p-10 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
          <div className="relative z-10 flex flex-col items-center text-center gap-6">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
              <GraduationCap className="w-9 h-9 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold mb-2">Course Registration</h1>
              <p className="text-blue-200 text-sm leading-relaxed">
                & Scheduling System
              </p>
            </div>
            <div className="w-full space-y-3 mt-4">
              {[
                'Manage your courses easily',
                'Build conflict-free schedules',
                'Track registrations in real-time',
              ].map((text, i) => (
                <div key={i} className="flex items-center gap-3 text-sm text-blue-100">
                  <CheckCircle className="w-4 h-4 text-blue-300 flex-shrink-0" />
                  {text}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Form */}
        <div className="md:w-7/12 p-8 md:p-10 flex flex-col justify-center">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-800">Welcome back</h2>
            <p className="text-sm text-slate-400 mt-1">Sign in to your account to continue</p>
          </div>

          {/* Role Toggle */}
          <div className="flex bg-slate-100 rounded-xl p-1 mb-6">
            {[
              { value: 'student', label: 'Student', icon: User },
              { value: 'admin', label: 'Admin', icon: Shield },
            ].map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                type="button"
                onClick={() => setUserType(value)}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-semibold transition-all duration-200
                  ${userType === value ? 'bg-white text-blue-600 shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
              >
                <Icon className="w-4 h-4" />{label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <InputField
              label="Email Address"
              type="email"
              placeholder="you@klu.ac.in"
              value={email}
              onChange={handleEmailChange}
              onBlur={() => handleBlur('email')}
              error={errors.email}
              touched={touched.email}
              icon={Mail}
            />

            <InputField
              label="Password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={handlePasswordChange}
              onBlur={() => handleBlur('password')}
              error={errors.password}
              touched={touched.password}
              icon={Lock}
              rightEl={
                <button type="button" onClick={() => setShowPassword(s => !s)} className="text-slate-400 hover:text-slate-600">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              }
            />

            {/* CAPTCHA */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">CAPTCHA Verification</label>
              <div className="flex items-center gap-3 mb-2">
                <div
                  className={`flex-1 px-4 py-2.5 rounded-xl border-2 font-mono text-center text-base font-bold select-none
                    ${captchaError ? 'border-red-400 bg-red-50 text-red-600' : 'border-blue-200 bg-blue-50 text-blue-700'}`}
                  style={{ letterSpacing: '0.3em', textDecoration: 'line-through', fontStyle: 'italic' }}
                >
                  {captcha}
                </div>
                <button type="button" onClick={generateCaptcha}
                  className="p-2.5 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-blue-600 transition-all">
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
              {captchaError && (
                <p className="text-xs text-red-500 mb-2 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> Incorrect CAPTCHA. A new one has been generated.
                </p>
              )}
              <input
                type="text"
                placeholder="Type the characters above"
                value={userCaptcha}
                onChange={e => { setUserCaptcha(e.target.value); setCaptchaError(false); }}
                onBlur={() => handleBlur('captcha')}
                className={`w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 transition-all
                  ${errors.captcha && touched.captcha
                    ? 'border-red-400 focus:ring-red-200 bg-red-50'
                    : 'border-slate-200 focus:ring-blue-200 focus:border-blue-400'}`}
              />
              {errors.captcha && touched.captcha && (
                <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />{errors.captcha}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-md shadow-blue-200 transition-all disabled:opacity-70 flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Signing in…
                </>
              ) : 'Sign In'}
            </button>

            <p className="text-sm text-center text-slate-500">
              Don't have an account?{" "}
              <span onClick={() => navigate("/signup")} className="text-blue-600 font-semibold cursor-pointer hover:underline">
                Create one
              </span>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}