import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  BookOpen, Calendar, ClipboardList, AlertTriangle,
  TrendingUp, ChevronRight, Clock, CheckCircle,
  Bell, Award, Activity, Plus, ArrowRight, Star,
  GraduationCap, Target, Zap
} from "lucide-react";

// ── Sparkline ──────────────────────────────────────────────────────────────
function Sparkline({ data, color = "#3b82f6", height = 36 }) {
  const max = Math.max(...data), min = Math.min(...data);
  const range = max - min || 1;
  const w = 100, h = height;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / range) * h;
    return `${x},${y}`;
  }).join(" ");
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="overflow-visible">
      <polyline points={pts} fill="none" stroke={color}
        strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

// ── Animated Counter ──────────────────────────────────────────────────────
function Counter({ target }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let cur = 0;
    const step = Math.ceil(target / 40);
    const t = setInterval(() => {
      cur = Math.min(cur + step, target);
      setVal(cur);
      if (cur >= target) clearInterval(t);
    }, 20);
    return () => clearInterval(t);
  }, [target]);
  return <>{val}</>;
}

// ── Data ──────────────────────────────────────────────────────────────────
const stats = [
  {
    title: "Registered Courses",
    value: 5,
    sub: "+1 this week",
    up: true,
    icon: BookOpen,
    path: "/courses",
    spark: [2, 3, 3, 4, 4, 5, 5],
    color: "blue",
    light: "bg-blue-50",
    text: "text-blue-600",
    border: "border-blue-100",
    grad: "from-blue-500 to-blue-600",
  },
  {
    title: "Weekly Classes",
    value: 18,
    sub: "hrs this week",
    up: true,
    icon: Calendar,
    path: "/schedule",
    spark: [12, 14, 15, 16, 17, 17, 18],
    color: "indigo",
    light: "bg-indigo-50",
    text: "text-indigo-600",
    border: "border-indigo-100",
    grad: "from-indigo-500 to-indigo-600",
  },
  {
    title: "Pending Registrations",
    value: 2,
    sub: "action required",
    up: false,
    icon: ClipboardList,
    path: "/registration",
    spark: [5, 4, 4, 3, 3, 2, 2],
    color: "amber",
    light: "bg-amber-50",
    text: "text-amber-600",
    border: "border-amber-100",
    grad: "from-amber-500 to-orange-500",
  },
  {
    title: "Schedule Conflicts",
    value: 1,
    sub: "resolve now",
    up: false,
    icon: AlertTriangle,
    path: "/schedule",
    spark: [3, 3, 2, 2, 2, 1, 1],
    color: "red",
    light: "bg-red-50",
    text: "text-red-500",
    border: "border-red-100",
    grad: "from-red-500 to-rose-500",
  },
];

const quickActions = [
  { label: "Browse Courses", path: "/courses", icon: BookOpen, color: "bg-blue-600 hover:bg-blue-700", desc: "Explore available courses" },
  { label: "Build Schedule", path: "/schedule", icon: Calendar, color: "bg-indigo-600 hover:bg-indigo-700", desc: "Plan your timetable" },
  { label: "Register Courses", path: "/registration", icon: ClipboardList, color: "bg-sky-600 hover:bg-sky-700", desc: "Enroll in courses" },
  { label: "My Courses", path: "/courses/mine", icon: GraduationCap, color: "bg-violet-600 hover:bg-violet-700", desc: "View enrolled courses" },
];

const recentActivity = [
  { icon: CheckCircle, color: "text-green-500", bg: "bg-green-50", msg: "Registered for Data Structures and Algorithms", time: "2 hrs ago" },
  { icon: Calendar, color: "text-blue-500", bg: "bg-blue-50", msg: "Added Operating Systems to schedule", time: "5 hrs ago" },
  { icon: AlertTriangle, color: "text-amber-500", bg: "bg-amber-50", msg: "Conflict detected in DBMS timing", time: "Yesterday" },
  { icon: CheckCircle, color: "text-green-500", bg: "bg-green-50", msg: "Enrolled in Machine Learning elective", time: "2 days ago" },
  { icon: Bell, color: "text-indigo-500", bg: "bg-indigo-50", msg: "Registration deadline: Dec 15, 2024", time: "3 days ago" },
];

const upcomingClasses = [
  { name: "Data Structures", code: "CS201", day: "Mon", time: "09:00-10:30", room: "A-204" },
  { name: "Database Management", code: "CS301", day: "Tue", time: "10:30-12:00", room: "B-101" },
  { name: "AI & Machine Learning", code: "CS401", day: "Wed", time: "01:00-02:30", room: "C-305" },
  { name: "Computer Networks", code: "CS303", day: "Thu", time: "02:30-04:00", room: "A-102" },
];

const DAY_COLORS = {
  Mon: "bg-blue-100 text-blue-700",
  Tue: "bg-indigo-100 text-indigo-700",
  Wed: "bg-violet-100 text-violet-700",
  Thu: "bg-sky-100 text-sky-700",
  Fri: "bg-cyan-100 text-cyan-700",
};

export default function Dashboard() {
  const navigate = useNavigate();
  const [greeting, setGreeting] = useState("");
  const user = JSON.parse(localStorage.getItem("mockUser") || "{}");
  const name = user?.name?.split(" ")[0] || "Student";

  useEffect(() => {
    const h = new Date().getHours();
    setGreeting(h < 12 ? "Good Morning" : h < 17 ? "Good Afternoon" : "Good Evening");
  }, []);

  const sparkColor = (color) => ({
    blue: "#3b82f6", indigo: "#6366f1", amber: "#f59e0b", red: "#ef4444"
  })[color] || "#3b82f6";

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <p className="text-sm text-slate-500 font-medium mb-0.5">{greeting}, {name} 👋</p>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">Student Dashboard</h1>
          <p className="text-sm text-slate-400 mt-1">KLU ERP · B.Tech · Semester 6</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <span className="text-xs font-semibold text-amber-700">1 conflict needs attention</span>
          </div>
          <button className="relative p-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 shadow-sm">
            <Bell className="w-5 h-5 text-slate-600" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
          </button>
        </div>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={i} onClick={() => navigate(s.path)}
              className={`bg-white rounded-2xl border ${s.border} shadow-sm hover:shadow-md transition-all duration-300 p-5 flex flex-col gap-4 cursor-pointer group`}>
              <div className="flex items-start justify-between">
                <div className={`p-2.5 rounded-xl ${s.light}`}>
                  <Icon className={`w-5 h-5 ${s.text}`} />
                </div>
                <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wide
                  ${s.up ? "bg-green-50 text-green-600" : "bg-red-50 text-red-500"}`}>
                  {s.sub}
                </span>
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wide mb-1">{s.title}</p>
                <p className="text-3xl font-bold text-slate-800 tabular-nums">
                  <Counter target={s.value} />
                </p>
              </div>
              <div className="flex items-center justify-between">
                <Sparkline data={s.spark} color={sparkColor(s.color)} />
                <ChevronRight className={`w-4 h-4 text-slate-300 group-hover:${s.text} group-hover:translate-x-0.5 transition-all`} />
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Middle Row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">

        {/* Upcoming Classes */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-base font-bold text-slate-800">Upcoming Classes</h2>
              <p className="text-xs text-slate-400 mt-0.5">This week's schedule</p>
            </div>
            <button onClick={() => navigate("/schedule")}
              className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:underline">
              Full Schedule <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          <div className="space-y-3">
            {upcomingClasses.map((c, i) => (
              <div key={i} className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors group">
                <div className={`px-2.5 py-1.5 rounded-xl text-xs font-bold flex-shrink-0 ${DAY_COLORS[c.day] || "bg-slate-100 text-slate-600"}`}>
                  {c.day}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-800 truncate">{c.name}</p>
                  <p className="text-xs text-indigo-500 font-semibold">{c.code}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-xs font-semibold text-slate-600 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" />{c.time}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Room {c.room}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Progress Card */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col gap-5">
          <div>
            <h2 className="text-base font-bold text-slate-800">Semester Progress</h2>
            <p className="text-xs text-slate-400 mt-0.5">Academic Year 2024–25</p>
          </div>

          {/* Circular-style progress items */}
          {[
            { label: "Semester Completion", value: 68, color: "#3b82f6" },
            { label: "Credits Earned", value: 84, max: 160, color: "#6366f1", display: "84/160" },
            { label: "Attendance", value: 87, color: "#10b981" },
          ].map((p, i) => (
            <div key={i}>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="font-medium text-slate-600">{p.label}</span>
                <span className="font-bold" style={{ color: p.color }}>{p.display || `${p.value}%`}</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${p.max ? (p.value / p.max) * 100 : p.value}%`, background: p.color }} />
              </div>
            </div>
          ))}

          {/* CGPA */}
          <div className="mt-auto p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 font-medium">Current CGPA</p>
                <p className="text-2xl font-bold text-blue-700 mt-0.5">8.74</p>
              </div>
              <div className="flex items-center gap-1 text-xs font-semibold text-green-600 bg-green-100 px-2.5 py-1 rounded-full">
                <TrendingUp className="w-3 h-3" /> +0.12
              </div>
            </div>
            <div className="flex mt-2">
              {[1,2,3,4,5].map(s => (
                <Star key={s} className={`w-4 h-4 ${s <= 4 ? "fill-amber-400 text-amber-400" : "text-slate-200"}`} />
              ))}
              <span className="text-xs text-slate-400 ml-1.5 mt-0.5">Distinction</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom Row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <h2 className="text-base font-bold text-slate-800 flex items-center gap-2 mb-4">
            <Zap className="w-4 h-4 text-blue-600" /> Quick Actions
          </h2>
          <div className="space-y-2">
            {quickActions.map((a, i) => {
              const Icon = a.icon;
              return (
                <button key={i} onClick={() => navigate(a.path)}
                  className="w-full flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/50 transition-all group text-left">
                  <div className={`w-8 h-8 rounded-lg ${a.color} flex items-center justify-center flex-shrink-0 transition-colors`}>
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-700 group-hover:text-blue-600 transition-colors">{a.label}</p>
                    <p className="text-xs text-slate-400">{a.desc}</p>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all" />
                </button>
              );
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-600" /> Recent Activity
            </h2>
            <button className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1">
              View all <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          <div className="space-y-3">
            {recentActivity.map((a, i) => {
              const Icon = a.icon;
              return (
                <div key={i} className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors">
                  <div className={`w-8 h-8 rounded-xl ${a.bg} flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`w-4 h-4 ${a.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-700 font-medium leading-snug">{a.msg}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1">
                      <Clock className="w-3 h-3" />{a.time}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Banner ── */}
      <div className="mt-5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-white">
          <div className="flex items-center gap-2 mb-1">
            <Target className="w-4 h-4 text-blue-200" />
            <p className="text-sm font-medium text-blue-200">Registration Deadline</p>
          </div>
          <h3 className="text-lg font-bold">Course registration closes Dec 15, 2024</h3>
          <p className="text-sm text-blue-200 mt-0.5">2 courses still pending registration · Don't miss the deadline</p>
        </div>
        <button onClick={() => navigate("/registration")}
          className="flex-shrink-0 flex items-center gap-2 px-5 py-2.5 bg-white text-blue-600 font-semibold text-sm rounded-xl hover:bg-blue-50 transition-all shadow-md">
          Complete Registration <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
}
