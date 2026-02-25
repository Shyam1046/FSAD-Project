import React, { useState } from "react";
import {
  Bell, Moon, Shield, Globe, Eye, Lock, Trash2,
  CheckCircle, ChevronRight, Smartphone, Mail,
  Monitor, Volume2, RefreshCw, AlertTriangle
} from "lucide-react";

function Toggle({ checked, onChange }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`relative w-11 h-6 rounded-full transition-all duration-300 focus:outline-none
        ${checked ? 'bg-blue-600' : 'bg-slate-200'}`}
    >
      <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-300
        ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
    </button>
  );
}

function SettingRow({ label, desc, checked, onChange, icon: Icon, iconColor = "text-blue-600", iconBg = "bg-blue-50" }) {
  return (
    <div className="flex items-center justify-between py-3.5 border-b border-slate-50 last:border-0">
      <div className="flex items-center gap-3">
        <div className={`w-9 h-9 rounded-xl ${iconBg} flex items-center justify-center flex-shrink-0`}>
          <Icon className={`w-4 h-4 ${iconColor}`} />
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-700">{label}</p>
          {desc && <p className="text-xs text-slate-400 mt-0.5">{desc}</p>}
        </div>
      </div>
      <Toggle checked={checked} onChange={onChange} />
    </div>
  );
}

function SectionCard({ title, icon: Icon, children }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
      <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 mb-1 pb-3 border-b border-slate-50">
        <Icon className="w-4 h-4 text-blue-600" /> {title}
      </h3>
      {children}
    </div>
  );
}

export default function Settings() {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    scheduleAlerts: true,
    conflictAlerts: true,
    darkMode: false,
    compactView: false,
    animations: true,
    twoFactor: false,
    sessionTimeout: true,
    publicProfile: false,
    dataSharing: false,
  });
  const [language, setLanguage] = useState("English");
  const [timezone, setTimezone] = useState("IST (UTC+5:30)");
  const [saved, setSaved] = useState(false);
  const [showReset, setShowReset] = useState(false);

  const set = (key) => (val) => setSettings(s => ({ ...s, [key]: val }));

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">

      {/* Toast */}
      {saved && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-3 px-4 py-3 bg-green-500 text-white rounded-2xl shadow-xl">
          <CheckCircle className="w-4 h-4" />
          <span className="text-sm font-medium">Settings saved successfully!</span>
        </div>
      )}

      <div className="max-w-2xl mx-auto space-y-5">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">Settings</h1>
          <p className="text-sm text-slate-400 mt-1">Manage your preferences and account settings</p>
        </div>

        {/* Notifications */}
        <SectionCard title="Notifications" icon={Bell}>
          <SettingRow label="Email Notifications" desc="Receive updates via email"
            checked={settings.emailNotifications} onChange={set("emailNotifications")}
            icon={Mail} />
          <SettingRow label="Push Notifications" desc="Browser & app push alerts"
            checked={settings.pushNotifications} onChange={set("pushNotifications")}
            icon={Smartphone} />
          <SettingRow label="SMS Notifications" desc="Text messages for urgent alerts"
            checked={settings.smsNotifications} onChange={set("smsNotifications")}
            icon={Volume2} iconColor="text-purple-600" iconBg="bg-purple-50" />
          <SettingRow label="Schedule Alerts" desc="Reminders for upcoming classes"
            checked={settings.scheduleAlerts} onChange={set("scheduleAlerts")}
            icon={Bell} iconColor="text-sky-600" iconBg="bg-sky-50" />
          <SettingRow label="Conflict Alerts" desc="Notify when schedule conflicts are found"
            checked={settings.conflictAlerts} onChange={set("conflictAlerts")}
            icon={AlertTriangle} iconColor="text-amber-600" iconBg="bg-amber-50" />
        </SectionCard>

        {/* Appearance */}
        <SectionCard title="Appearance" icon={Monitor}>
          <SettingRow label="Dark Mode" desc="Switch to dark theme"
            checked={settings.darkMode} onChange={set("darkMode")}
            icon={Moon} iconColor="text-indigo-600" iconBg="bg-indigo-50" />
          <SettingRow label="Compact View" desc="Show more content with less spacing"
            checked={settings.compactView} onChange={set("compactView")}
            icon={Eye} iconColor="text-slate-600" iconBg="bg-slate-100" />
          <SettingRow label="Animations" desc="Enable smooth transitions and effects"
            checked={settings.animations} onChange={set("animations")}
            icon={RefreshCw} iconColor="text-green-600" iconBg="bg-green-50" />

          {/* Language */}
          <div className="flex items-center justify-between py-3.5 border-b border-slate-50">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center">
                <Globe className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-700">Language</p>
                <p className="text-xs text-slate-400 mt-0.5">Interface display language</p>
              </div>
            </div>
            <select
              value={language}
              onChange={e => setLanguage(e.target.value)}
              className="text-sm text-slate-600 border border-slate-200 rounded-xl px-3 py-1.5 outline-none focus:ring-2 focus:ring-blue-200 bg-white"
            >
              {["English", "Hindi", "Telugu", "Tamil"].map(l => <option key={l}>{l}</option>)}
            </select>
          </div>

          {/* Timezone */}
          <div className="flex items-center justify-between py-3.5">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-sky-50 flex items-center justify-center">
                <Globe className="w-4 h-4 text-sky-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-700">Timezone</p>
                <p className="text-xs text-slate-400 mt-0.5">Used for schedule display</p>
              </div>
            </div>
            <select
              value={timezone}
              onChange={e => setTimezone(e.target.value)}
              className="text-sm text-slate-600 border border-slate-200 rounded-xl px-3 py-1.5 outline-none focus:ring-2 focus:ring-blue-200 bg-white"
            >
              {["IST (UTC+5:30)", "UTC", "EST (UTC-5)", "PST (UTC-8)"].map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
        </SectionCard>

        {/* Security */}
        <SectionCard title="Security & Privacy" icon={Shield}>
          <SettingRow label="Two-Factor Authentication" desc="Extra layer of login security"
            checked={settings.twoFactor} onChange={set("twoFactor")}
            icon={Shield} iconColor="text-green-600" iconBg="bg-green-50" />
          <SettingRow label="Auto Session Timeout" desc="Log out after 30 min of inactivity"
            checked={settings.sessionTimeout} onChange={set("sessionTimeout")}
            icon={Lock} iconColor="text-blue-600" iconBg="bg-blue-50" />
          <SettingRow label="Public Profile" desc="Allow others to view your profile"
            checked={settings.publicProfile} onChange={set("publicProfile")}
            icon={Eye} iconColor="text-indigo-600" iconBg="bg-indigo-50" />
          <SettingRow label="Data Sharing" desc="Share anonymized usage data with KLU"
            checked={settings.dataSharing} onChange={set("dataSharing")}
            icon={Globe} iconColor="text-slate-500" iconBg="bg-slate-100" />
        </SectionCard>

        {/* Change Password Link */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 mb-3 pb-3 border-b border-slate-50">
            <Lock className="w-4 h-4 text-blue-600" /> Account
          </h3>
          {[
            { label: "Change Password", desc: "Update your account password" },
            { label: "Download My Data", desc: "Export your academic data as PDF" },
          ].map((item, i) => (
            <button key={i} className="w-full flex items-center justify-between py-3 border-b border-slate-50 last:border-0 hover:bg-slate-50 rounded-xl px-2 transition-colors group">
              <div className="text-left">
                <p className="text-sm font-semibold text-slate-700 group-hover:text-blue-600 transition-colors">{item.label}</p>
                <p className="text-xs text-slate-400">{item.desc}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-400 transition-colors" />
            </button>
          ))}
        </div>

        {/* Save + Danger */}
        <button onClick={handleSave}
          className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-2xl shadow-md shadow-blue-200 transition-all">
          Save Settings
        </button>

        {/* Danger Zone */}
        <div className="bg-white rounded-2xl border border-red-100 shadow-sm p-5">
          <h3 className="text-sm font-bold text-red-500 flex items-center gap-2 mb-3">
            <AlertTriangle className="w-4 h-4" /> Danger Zone
          </h3>
          {!showReset ? (
            <button onClick={() => setShowReset(true)}
              className="flex items-center gap-2 text-sm font-semibold text-red-500 hover:text-red-600 transition-colors">
              <Trash2 className="w-4 h-4" /> Delete My Account
            </button>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-slate-600">Are you sure? This action is <strong>irreversible</strong>.</p>
              <div className="flex gap-3">
                <button onClick={() => setShowReset(false)}
                  className="flex-1 py-2 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50">
                  Cancel
                </button>
                <button onClick={() => { localStorage.clear(); window.location.href = "/login"; }}
                  className="flex-1 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm font-semibold transition-colors">
                  Delete Account
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}