import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CheckCircle, Clock, XCircle, AlertTriangle, BookOpen,
  Calendar, Award, ChevronRight, Filter, Download,
  RefreshCw, Eye, ArrowLeft
} from "lucide-react";

const statusData = [
  { id: 1, course: "Database Management Systems", code: "CS301", credits: 4, day: "Mon", time: "09:00-10:30", dept: "CSE", status: "approved", submittedOn: "Dec 2, 2024" },
  { id: 2, course: "Operating Systems", code: "CS302", credits: 4, day: "Tue", time: "10:30-12:00", dept: "CSE", status: "pending", submittedOn: "Dec 3, 2024" },
  { id: 3, course: "AI & Machine Learning", code: "CS401", credits: 4, day: "Wed", time: "01:00-02:30", dept: "CSE", status: "conflict", submittedOn: "Dec 3, 2024" },
  { id: 4, course: "Computer Networks", code: "CS303", credits: 3, day: "Thu", time: "02:30-04:00", dept: "CSE", status: "approved", submittedOn: "Dec 1, 2024" },
  { id: 5, course: "Full Stack Development", code: "CS404", credits: 3, day: "Fri", time: "10:30-12:00", dept: "CSE", status: "pending", submittedOn: "Dec 4, 2024" },
  { id: 6, course: "Probability & Statistics", code: "MA201", credits: 3, day: "Mon", time: "01:00-02:30", dept: "MATH", status: "approved", submittedOn: "Dec 1, 2024" },
];

const STATUS_CONFIG = {
  approved: {
    label: "Approved",
    color: "bg-green-100 text-green-700",
    dot: "bg-green-500",
    icon: CheckCircle,
    iconColor: "text-green-500",
    border: "border-green-100",
  },
  pending: {
    label: "Pending Approval",
    color: "bg-amber-100 text-amber-700",
    dot: "bg-amber-400",
    icon: Clock,
    iconColor: "text-amber-500",
    border: "border-amber-100",
  },
  conflict: {
    label: "Slot Conflict",
    color: "bg-red-100 text-red-600",
    dot: "bg-red-500",
    icon: XCircle,
    iconColor: "text-red-500",
    border: "border-red-100",
  },
};

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${cfg.color}`}>
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

export default function RegistrationStatus() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("all");
  const [refreshing, setRefreshing] = useState(false);

  const filtered = filter === "all" ? statusData : statusData.filter(s => s.status === filter);
  const approved = statusData.filter(s => s.status === "approved");
  const pending = statusData.filter(s => s.status === "pending");
  const conflicts = statusData.filter(s => s.status === "conflict");
  const totalCredits = approved.reduce((a, c) => a + c.credits, 0);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1200);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <button onClick={() => navigate("/registration")}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-blue-600 transition-colors mb-2">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Registration
          </button>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">Registration Status</h1>
          <p className="text-sm text-slate-400 mt-1">Semester 6 · KL University</p>
        </div>
        <div className="flex gap-2">
          <button onClick={handleRefresh}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 shadow-sm">
            <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} /> Refresh
          </button>
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 shadow-sm">
            <Download className="w-4 h-4" /> Export
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Submitted", value: statusData.length, color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-100", icon: BookOpen },
          { label: "Approved", value: approved.length, color: "text-green-600", bg: "bg-green-50", border: "border-green-100", icon: CheckCircle },
          { label: "Pending", value: pending.length, color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-100", icon: Clock },
          { label: "Conflicts", value: conflicts.length, color: "text-red-500", bg: "bg-red-50", border: "border-red-100", icon: XCircle },
        ].map((m, i) => {
          const Icon = m.icon;
          return (
            <div key={i} className={`bg-white rounded-xl border ${m.border} shadow-sm p-4 flex items-center gap-3`}>
              <div className={`p-2 rounded-xl ${m.bg}`}><Icon className={`w-4 h-4 ${m.color}`} /></div>
              <div>
                <p className="text-xs text-slate-500 font-medium">{m.label}</p>
                <p className={`text-xl font-bold ${m.color}`}>{m.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Conflict Alert */}
      {conflicts.length > 0 && (
        <div className="mb-5 bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-red-700">Action Required: {conflicts.length} Course Conflict{conflicts.length > 1 ? "s" : ""}</p>
            <p className="text-xs text-red-500 mt-0.5">
              {conflicts.map(c => c.course).join(", ")} — please contact your advisor or re-register with a different slot.
            </p>
          </div>
        </div>
      )}

      {/* Credits Banner */}
      <div className="mb-5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-4 flex items-center justify-between gap-4">
        <div className="text-white">
          <p className="text-xs text-blue-200 font-medium mb-0.5">Approved Credits This Semester</p>
          <div className="flex items-end gap-2">
            <p className="text-3xl font-bold">{totalCredits}</p>
            <p className="text-blue-200 text-sm mb-1">/ 24 max</p>
          </div>
        </div>
        <div className="w-24">
          <div className="flex justify-between text-[10px] text-blue-200 mb-1">
            <span>Progress</span><span>{Math.round((totalCredits / 24) * 100)}%</span>
          </div>
          <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
            <div className="h-full bg-white rounded-full transition-all duration-700"
              style={{ width: `${Math.min((totalCredits / 24) * 100, 100)}%` }} />
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex bg-white rounded-2xl border border-slate-100 shadow-sm p-1 mb-4 gap-1">
        {[
          { key: "all", label: "All Courses", count: statusData.length },
          { key: "approved", label: "Approved", count: approved.length },
          { key: "pending", label: "Pending", count: pending.length },
          { key: "conflict", label: "Conflicts", count: conflicts.length },
        ].map(tab => (
          <button key={tab.key} onClick={() => setFilter(tab.key)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold transition-all
              ${filter === tab.key ? "bg-blue-600 text-white shadow-md" : "text-slate-500 hover:text-slate-700"}`}>
            {tab.label}
            <span className={`w-4 h-4 rounded-full text-[10px] flex items-center justify-center font-bold
              ${filter === tab.key ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"}`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Course List */}
      <div className="space-y-3">
        {filtered.map((item, i) => {
          const cfg = STATUS_CONFIG[item.status];
          const Icon = cfg.icon;
          return (
            <div key={i} className={`bg-white rounded-2xl border ${cfg.border} shadow-sm p-5 hover:shadow-md transition-all`}>
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0
                  ${item.status === "approved" ? "bg-green-50" : item.status === "pending" ? "bg-amber-50" : "bg-red-50"}`}>
                  <Icon className={`w-5 h-5 ${cfg.iconColor}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div>
                      <h3 className="text-sm font-bold text-slate-800">{item.course}</h3>
                      <p className="text-xs font-mono text-indigo-500 font-semibold mt-0.5">{item.code}</p>
                    </div>
                    <StatusBadge status={item.status} />
                  </div>
                  <div className="flex flex-wrap gap-3 mt-2">
                    <span className="flex items-center gap-1 text-xs text-slate-500">
                      <Calendar className="w-3 h-3" />{item.day}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-slate-500">
                      <Clock className="w-3 h-3" />{item.time}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-slate-500">
                      <Award className="w-3 h-3" />{item.credits} credits
                    </span>
                    <span className="text-xs text-slate-400">Submitted: {item.submittedOn}</span>
                  </div>
                  {item.status === "conflict" && (
                    <div className="mt-2 flex items-center gap-1.5 text-xs text-red-600 bg-red-50 px-3 py-1.5 rounded-xl w-fit">
                      <AlertTriangle className="w-3 h-3" />
                      Schedule conflict — please contact your advisor
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="bg-white rounded-2xl border border-slate-100 p-10 text-center">
          <BookOpen className="w-8 h-8 mx-auto mb-2 text-slate-300" />
          <p className="text-slate-400 text-sm">No courses in this category</p>
        </div>
      )}
    </div>
  );
}