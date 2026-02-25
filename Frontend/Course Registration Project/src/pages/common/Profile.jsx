import React, { useState } from "react";
import {
  User, Mail, Shield, Pencil, Save, LogOut, Camera,
  CheckCircle, BookOpen, Calendar, Award, X
} from "lucide-react";

export default function Profile() {
  const [user, setUser] = useState({
    name: "Shyam Balaji",
    email: "shyam@klu.ac.in",
    phone: "+91 98765 43210",
    studentId: "KLU2021047",
    department: "Computer Science & Engineering",
    semester: "6th Semester",
    role: localStorage.getItem("userType") || "student",
  });
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState({ ...user });
  const [saved, setSaved] = useState(false);

  const handleChange = (e) => setDraft({ ...draft, [e.target.name]: e.target.value });

  const handleSave = () => {
    setUser({ ...draft });
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleCancel = () => {
    setDraft({ ...user });
    setEditing(false);
  };

  const stats = [
    { label: "Courses Enrolled", value: "6", icon: BookOpen, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Credits Completed", value: "84", icon: Award, color: "text-indigo-600", bg: "bg-indigo-50" },
    { label: "Schedules Active", value: "3", icon: Calendar, color: "text-sky-600", bg: "bg-sky-50" },
  ];

  const initials = user.name.split(" ").map(n => n[0]).join("");

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">

      {/* Toast */}
      {saved && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-3 px-4 py-3 bg-green-500 text-white rounded-2xl shadow-xl">
          <CheckCircle className="w-4 h-4" />
          <span className="text-sm font-medium">Profile updated successfully!</span>
        </div>
      )}

      <div className="max-w-3xl mx-auto space-y-6">

        {/* Header Card */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          {/* Banner */}
          <div className="h-28 bg-gradient-to-r from-blue-600 to-indigo-600 relative">
            <div className="absolute inset-0 opacity-20"
              style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
          </div>

          <div className="px-6 pb-6">
            {/* Avatar */}
            <div className="flex items-end justify-between -mt-12 mb-4">
              <div className="relative">
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 border-4 border-white shadow-lg flex items-center justify-center text-white text-2xl font-bold">
                  {initials}
                </div>
                <button className="absolute -bottom-1 -right-1 w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center text-white hover:bg-blue-700 transition-colors shadow-md">
                  <Camera className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="flex gap-2 mt-14">
                {!editing ? (
                  <button onClick={() => { setDraft({ ...user }); setEditing(true); }}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-blue-600 bg-blue-50 border border-blue-100 rounded-xl hover:bg-blue-100 transition-all">
                    <Pencil className="w-3.5 h-3.5" /> Edit Profile
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button onClick={handleCancel}
                      className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50 transition-all">
                      <X className="w-3.5 h-3.5" /> Cancel
                    </button>
                    <button onClick={handleSave}
                      className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl hover:from-blue-700 hover:to-indigo-700 shadow-md shadow-blue-200 transition-all">
                      <Save className="w-3.5 h-3.5" /> Save Changes
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-3 mb-1">
                <h2 className="text-xl font-bold text-slate-800">{user.name}</h2>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize
                  ${user.role === 'admin' ? 'bg-indigo-100 text-indigo-700' : 'bg-blue-100 text-blue-700'}`}>
                  {user.role}
                </span>
              </div>
              <p className="text-sm text-slate-400">{user.department} · {user.semester}</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {stats.map((s, i) => {
            const Icon = s.icon;
            return (
              <div key={i} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 text-center">
                <div className={`w-10 h-10 ${s.bg} rounded-xl flex items-center justify-center mx-auto mb-2`}>
                  <Icon className={`w-5 h-5 ${s.color}`} />
                </div>
                <p className="text-2xl font-bold text-slate-800">{s.value}</p>
                <p className="text-xs text-slate-500 font-medium mt-0.5">{s.label}</p>
              </div>
            );
          })}
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <h3 className="text-base font-bold text-slate-800 mb-5 flex items-center gap-2">
            <User className="w-4 h-4 text-blue-600" /> Personal Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: "Full Name", name: "name", icon: User, editable: true },
              { label: "Email Address", name: "email", icon: Mail, editable: false },
              { label: "Phone Number", name: "phone", icon: null, editable: true },
              { label: "Student ID", name: "studentId", icon: null, editable: false },
              { label: "Department", name: "department", icon: null, editable: false },
              { label: "Role", name: "role", icon: Shield, editable: false },
            ].map((f) => {
              const isDisabled = !editing || !f.editable;
              return (
                <div key={f.name}>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">{f.label}</label>
                  <div className="relative">
                    <input
                      type="text"
                      name={f.name}
                      value={editing && f.editable ? draft[f.name] : user[f.name]}
                      disabled={isDisabled}
                      onChange={handleChange}
                      className={`w-full px-4 py-2.5 border rounded-xl text-sm transition-all outline-none capitalize
                        ${isDisabled
                          ? 'bg-slate-50 border-slate-100 text-slate-400 cursor-not-allowed'
                          : 'bg-white border-blue-200 text-slate-800 focus:ring-2 focus:ring-blue-200 focus:border-blue-400'
                        }`}
                    />
                    {!f.editable && (
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-semibold text-slate-300 uppercase tracking-wide">
                        Locked
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Logout */}
        <div className="bg-white rounded-2xl border border-red-100 shadow-sm p-5 flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-slate-800">Sign Out</p>
            <p className="text-xs text-slate-400 mt-0.5">You'll be redirected to the login page</p>
          </div>
          <button
            onClick={() => { localStorage.clear(); window.location.href = "/login"; }}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-red-500 bg-red-50 border border-red-100 rounded-xl hover:bg-red-100 transition-all"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>

      </div>
    </div>
  );
}