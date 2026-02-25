import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  GraduationCap, Eye, EyeOff, AlertCircle,
  CheckCircle, Shield, User, Mail, Lock, IdCard
} from "lucide-react";

// ── MUST be outside Signup to prevent focus loss on every keystroke ──
function Field({ label, type = 'text', placeholder, icon: Icon, rightEl, value, onChange, onBlur, error, touched }) {
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

function StrengthBar({ password }) {
  const checks = [
    password.length >= 8,
    /[A-Z]/.test(password),
    /[0-9]/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ];
  const score = checks.filter(Boolean).length;
  const labels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
  const colors = ['', 'bg-red-400', 'bg-amber-400', 'bg-blue-400', 'bg-green-500'];
  const textColors = ['', 'text-red-500', 'text-amber-500', 'text-blue-500', 'text-green-600'];
  if (!password) return null;
  return (
    <div className="mt-1.5">
      <div className="flex gap-1 mb-1">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= score ? colors[score] : 'bg-slate-200'}`} />
        ))}
      </div>
      <p className={`text-xs font-medium ${textColors[score]}`}>{labels[score]} password</p>
    </div>
  );
}

export default function Signup() {
  const navigate = useNavigate();
  const [userType, setUserType] = useState("student");
  const [form, setForm] = useState({ name: '', email: '', studentId: '', password: '', confirm: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const validate = (f = form, ut = userType) => {
    const errs = {};
    if (!f.name.trim()) errs.name = 'Full name is required';
    else if (f.name.trim().length < 3) errs.name = 'At least 3 characters';
    if (!f.email.trim()) errs.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) errs.email = 'Enter a valid email';
    if (ut === 'student' && !f.studentId.trim()) errs.studentId = 'Student ID is required';
    if (!f.password) errs.password = 'Password is required';
    else if (f.password.length < 6) errs.password = 'Minimum 6 characters';
    if (!f.confirm) errs.confirm = 'Please confirm your password';
    else if (f.confirm !== f.password) errs.confirm = 'Passwords do not match';
    return errs;
  };

  // Single handler — updates form and re-validates if field was already touched
  const handleChange = (field, val) => {
    const next = { ...form, [field]: val };
    setForm(next);
    if (touched[field]) setErrors(validate(next));
  };

  const handleBlur = (field) => {
    setTouched(t => ({ ...t, [field]: true }));
    setErrors(validate());
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const allTouched = Object.fromEntries(Object.keys(form).map(k => [k, true]));
    setTouched(allTouched);
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    setTimeout(() => {
      localStorage.setItem("mockUser", JSON.stringify({ userType, email: form.email, name: form.name }));
      setLoading(false);
      setSuccess(true);
      setTimeout(() => navigate("/login"), 2000);
    }, 1200);
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-12 flex flex-col items-center text-center max-w-sm w-full">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-9 h-9 text-green-500" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">Account Created!</h2>
          <p className="text-sm text-slate-500 mb-1">Welcome, {form.name.split(' ')[0]}!</p>
          <p className="text-xs text-slate-400">Redirecting to login…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-white/5 rounded-full" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-white/5 rounded-full" />
      </div>

      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl flex flex-col md:flex-row overflow-hidden">

        {/* Left Panel */}
        <div className="md:w-5/12 bg-gradient-to-br from-blue-600 to-indigo-700 flex flex-col items-center justify-center p-10 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
          <div className="relative z-10 flex flex-col items-center text-center gap-6">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
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
                'Select & register for courses',
                'Build your weekly schedule',
                'Get notified on conflicts',
                'Track your academic progress',
              ].map((text, i) => (
                <div key={i} className="flex items-center gap-3 text-sm text-blue-100">
                  <CheckCircle className="w-4 h-4 text-blue-300 flex-shrink-0" />{text}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Form */}
        <div className="md:w-7/12 p-8 md:p-10 flex flex-col justify-center overflow-y-auto">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-800">Create Account</h2>
            <p className="text-sm text-slate-400 mt-1">Fill in your details to get started</p>
          </div>

          {/* Role Toggle */}
          <div className="flex bg-slate-100 rounded-xl p-1 mb-5">
            {[
              { value: 'student', label: 'Student', icon: User },
              { value: 'admin', label: 'Admin', icon: Shield },
            ].map(({ value, label, icon: Icon }) => (
              <button key={value} type="button" onClick={() => setUserType(value)}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-semibold transition-all
                  ${userType === value ? 'bg-white text-blue-600 shadow-md' : 'text-slate-500 hover:text-slate-700'}`}>
                <Icon className="w-4 h-4" />{label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Field
              label="Full Name" type="text" placeholder="e.g. Arjun Mehta" icon={User}
              value={form.name} onChange={v => handleChange('name', v)}
              onBlur={() => handleBlur('name')} error={errors.name} touched={touched.name}
            />
            <Field
              label="Email Address" type="email" placeholder="you@klu.ac.in" icon={Mail}
              value={form.email} onChange={v => handleChange('email', v)}
              onBlur={() => handleBlur('email')} error={errors.email} touched={touched.email}
            />
            {userType === 'student' && (
              <Field
                label="Student ID" placeholder="e.g. KLU2021001" icon={IdCard}
                value={form.studentId} onChange={v => handleChange('studentId', v)}
                onBlur={() => handleBlur('studentId')} error={errors.studentId} touched={touched.studentId}
              />
            )}
            <div>
              <Field
                label="Password" type={showPassword ? "text" : "password"}
                placeholder="Create a strong password" icon={Lock}
                value={form.password} onChange={v => handleChange('password', v)}
                onBlur={() => handleBlur('password')} error={errors.password} touched={touched.password}
                rightEl={
                  <button type="button" onClick={() => setShowPassword(s => !s)} className="text-slate-400 hover:text-slate-600">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                }
              />
              <StrengthBar password={form.password} />
            </div>
            <Field
              label="Confirm Password" type={showConfirm ? "text" : "password"}
              placeholder="Repeat your password" icon={Lock}
              value={form.confirm} onChange={v => handleChange('confirm', v)}
              onBlur={() => handleBlur('confirm')} error={errors.confirm} touched={touched.confirm}
              rightEl={
                <button type="button" onClick={() => setShowConfirm(s => !s)} className="text-slate-400 hover:text-slate-600">
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              }
            />

            <p className="text-xs text-slate-400 text-center">
              By creating an account, you agree to our{" "}
              <span className="text-blue-600 font-medium cursor-pointer hover:underline">Terms of Service</span>
            </p>

            <button type="submit" disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-md shadow-blue-200 transition-all disabled:opacity-70 flex items-center justify-center gap-2">
              {loading ? (
                <>
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Creating account…
                </>
              ) : 'Create Account'}
            </button>

            <p className="text-sm text-center text-slate-500">
              Already have an account?{" "}
              <span onClick={() => navigate("/login")} className="text-blue-600 font-semibold cursor-pointer hover:underline">
                Sign in
              </span>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}