import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { coursesData } from "../courses/CourseCatalog";
import {
  BookOpen, Clock, Calendar, Search, X, CheckCircle,
  AlertTriangle, ChevronRight, Filter, Star, Award,
  ClipboardList, Info, Trash2, Send
} from "lucide-react";

const TAG_COLORS = {
  Core: "bg-blue-100 text-blue-700",
  Elective: "bg-indigo-100 text-indigo-700",
  Popular: "bg-amber-100 text-amber-700",
  New: "bg-green-100 text-green-700",
};

const MAX_CREDITS = 24;

// Detect time conflicts between two courses
function hasTimeConflict(a, b) {
  if (a.day !== b.day) return false;
  const toMins = (t) => {
    const [h, m] = t.split(":").map(Number);
    return h * 60 + m;
  };
  const [aStart, aEnd] = a.time.split("-").map(toMins);
  const [bStart, bEnd] = b.time.split("-").map(toMins);
  return aStart < bEnd && bStart < aEnd;
}

function Toast({ msg, type, onClose }) {
  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl
      ${type === "success" ? "bg-green-500" : type === "error" ? "bg-red-500" : "bg-amber-500"} text-white`}>
      {type === "success" ? <CheckCircle className="w-4 h-4 flex-shrink-0" /> :
       type === "error" ? <X className="w-4 h-4 flex-shrink-0" /> :
       <AlertTriangle className="w-4 h-4 flex-shrink-0" />}
      <span className="text-sm font-medium">{msg}</span>
      <button onClick={onClose}><X className="w-4 h-4" /></button>
    </div>
  );
}

function ConfirmModal({ open, selected, onConfirm, onCancel, submitting }) {
  if (!open) return null;
  const totalCredits = selected.reduce((a, c) => a + (c.credits || 0), 0);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md z-10 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Send className="w-4 h-4" /> Confirm Registration
          </h3>
        </div>
        <div className="p-6 space-y-3 max-h-[50vh] overflow-y-auto">
          <p className="text-sm text-slate-500">You are registering for <strong className="text-slate-800">{selected.length} course{selected.length > 1 ? "s" : ""}</strong> ({totalCredits} credits):</p>
          {selected.map((c, i) => (
            <div key={i} className="flex items-center gap-3 p-2.5 bg-slate-50 rounded-xl">
              <div className="w-7 h-7 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <BookOpen className="w-3.5 h-3.5 text-blue-600" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-800 truncate">{c.name}</p>
                <p className="text-xs text-slate-400">{c.code} · {c.day} {c.time}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="px-6 py-4 border-t border-slate-100 flex gap-3">
          <button onClick={onCancel} className="flex-1 py-2 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50">
            Cancel
          </button>
          <button onClick={onConfirm} disabled={submitting}
            className="flex-1 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl text-sm font-semibold text-white hover:from-blue-700 hover:to-indigo-700 disabled:opacity-70 flex items-center justify-center gap-2">
            {submitting ? (
              <><svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
              </svg> Submitting…</>
            ) : "Confirm & Submit"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Registration() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState([]);
  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("All");
  const [dayFilter, setDayFilter] = useState("All");
  const [toast, setToast] = useState(null);
  const [confirm, setConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const totalCredits = selected.reduce((a, c) => a + (c.credits || 0), 0);

  const toggle = (course) => {
    const isSelected = selected.find(c => c.id === course.id);
    if (isSelected) {
      setSelected(prev => prev.filter(c => c.id !== course.id));
      return;
    }
    // Credit limit check
    if (totalCredits + (course.credits || 0) > MAX_CREDITS) {
      showToast(`Credit limit of ${MAX_CREDITS} would be exceeded!`, "error");
      return;
    }
    // Conflict check
    const conflict = selected.find(c => hasTimeConflict(c, course));
    if (conflict) {
      showToast(`Time conflict with "${conflict.name}"!`, "warn");
      return;
    }
    setSelected(prev => [...prev, course]);
    showToast(`"${course.name}" added!`, "success");
  };

  const DEPTS = ["All", ...new Set(coursesData.map(c => c.dept))];
  const DAYS = ["All", "Mon", "Tue", "Wed", "Thu", "Fri"];

  const filtered = useMemo(() =>
    coursesData.filter(c =>
      (deptFilter === "All" || c.dept === deptFilter) &&
      (dayFilter === "All" || c.day === dayFilter) &&
      (c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.code.toLowerCase().includes(search.toLowerCase()))
    ), [search, deptFilter, dayFilter]);

  const handleSubmit = () => {
    if (selected.length === 0) { showToast("Select at least one course.", "error"); return; }
    setConfirm(true);
  };

  const handleConfirm = () => {
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setConfirm(false);
      setSubmitted(true);
    }, 1500);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-xl p-10 max-w-md w-full text-center border border-slate-100">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">Registration Submitted!</h2>
          <p className="text-sm text-slate-500 mb-1">{selected.length} courses · {totalCredits} credits</p>
          <p className="text-xs text-slate-400 mb-6">Your registration is pending admin approval. You'll be notified once confirmed.</p>
          <div className="flex gap-3">
            <button onClick={() => navigate("/registration/status")}
              className="flex-1 py-2.5 border border-blue-200 text-blue-600 font-semibold text-sm rounded-xl hover:bg-blue-50">
              View Status
            </button>
            <button onClick={() => navigate("/dashboard")}
              className="flex-1 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold text-sm rounded-xl hover:from-blue-700 hover:to-indigo-700">
              Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">Course Registration</h1>
          <p className="text-sm text-slate-400 mt-1">Select courses for Semester 6 · Max {MAX_CREDITS} credits</p>
        </div>
        <button onClick={() => navigate("/registration/status")}
          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-blue-600 bg-blue-50 border border-blue-100 rounded-xl hover:bg-blue-100 transition-all">
          <ClipboardList className="w-4 h-4" /> View Status
        </button>
      </div>

      {/* Summary Bar */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 mb-5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-4">
          {[
            { label: "Selected", value: selected.length, color: "text-blue-600" },
            { label: "Credits", value: `${totalCredits}/${MAX_CREDITS}`, color: totalCredits > 20 ? "text-amber-500" : "text-indigo-600" },
            { label: "Remaining", value: MAX_CREDITS - totalCredits, color: "text-green-600" },
          ].map((m, i) => (
            <div key={i}>
              <p className="text-xs text-slate-400 font-medium">{m.label}</p>
              <p className={`text-xl font-bold ${m.color}`}>{m.value}</p>
            </div>
          ))}
          {/* Credit bar */}
          <div className="flex flex-col justify-center min-w-[120px]">
            <div className="text-xs text-slate-400 mb-1.5">Credit Load</div>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min((totalCredits / MAX_CREDITS) * 100, 100)}%`,
                  background: totalCredits > 20 ? "#f59e0b" : "#3b82f6"
                }} />
            </div>
          </div>
        </div>
        <button onClick={handleSubmit} disabled={selected.length === 0}
          className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl hover:from-blue-700 hover:to-indigo-700 shadow-md shadow-blue-200 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
          <Send className="w-4 h-4" /> Submit Registration
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Left: Course List */}
        <div className="lg:col-span-2 space-y-4">

          {/* Filters */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 space-y-3">
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5">
              <Search className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <input className="flex-1 bg-transparent text-sm text-slate-700 placeholder-slate-400 outline-none"
                placeholder="Search courses…" value={search} onChange={e => setSearch(e.target.value)} />
              {search && <button onClick={() => setSearch("")}><X className="w-3.5 h-3.5 text-slate-400" /></button>}
            </div>
            <div className="flex flex-wrap gap-2">
              <Filter className="w-4 h-4 text-slate-400 mt-1" />
              {DEPTS.map(d => (
                <button key={d} onClick={() => setDeptFilter(d)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all
                    ${deptFilter === d ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>
                  {d}
                </button>
              ))}
              <div className="w-px h-5 bg-slate-200 self-center mx-1" />
              {DAYS.map(d => (
                <button key={d} onClick={() => setDayFilter(d)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all
                    ${dayFilter === d ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Course Cards */}
          <div className="space-y-2">
            {filtered.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-10 text-center">
                <BookOpen className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                <p className="text-slate-500 text-sm">No courses match your filters</p>
              </div>
            ) : filtered.map(course => {
              const isSelected = !!selected.find(c => c.id === course.id);
              const conflict = !isSelected && selected.find(c => hasTimeConflict(c, course));
              const wouldExceed = !isSelected && totalCredits + (course.credits || 0) > MAX_CREDITS;
              const pct = Math.round((course.enrolled / course.capacity) * 100);

              return (
                <div key={course.id} onClick={() => toggle(course)}
                  className={`rounded-2xl border transition-all duration-200 cursor-pointer p-4 group
                    ${isSelected
                      ? "border-blue-400 bg-blue-50 shadow-md shadow-blue-100"
                      : conflict
                      ? "border-amber-200 bg-amber-50/50 opacity-80"
                      : wouldExceed
                      ? "border-red-100 bg-red-50/30 opacity-70"
                      : "bg-white border-slate-100 hover:border-blue-200 hover:shadow-sm"
                    }`}>
                  <div className="flex items-start gap-3">
                    {/* Checkbox visual */}
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all
                      ${isSelected ? "border-blue-500 bg-blue-500" : "border-slate-300 group-hover:border-blue-400"}`}>
                      {isSelected && <CheckCircle className="w-3.5 h-3.5 text-white fill-white" />}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className={`text-sm font-bold leading-snug ${isSelected ? "text-blue-700" : "text-slate-800"}`}>
                            {course.name}
                          </h3>
                          <p className="text-xs font-mono text-indigo-500 font-semibold mt-0.5">{course.code}</p>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-amber-500 flex-shrink-0">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />{course.rating}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-3 mt-2">
                        <span className="flex items-center gap-1 text-xs text-slate-500">
                          <Calendar className="w-3 h-3" />{course.day}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-slate-500">
                          <Clock className="w-3 h-3" />{course.time}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-slate-500">
                          <Award className="w-3 h-3" />{course.credits} cr
                        </span>
                        <span className="text-xs text-slate-400">{course.instructor}</span>
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-2 mt-2">
                        <div className="flex gap-1 flex-wrap">
                          {(course.tags || []).map(tag => (
                            <span key={tag} className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${TAG_COLORS[tag]}`}>{tag}</span>
                          ))}
                        </div>
                        {conflict && (
                          <span className="flex items-center gap-1 text-[10px] font-semibold text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full">
                            <AlertTriangle className="w-3 h-3" /> Conflicts with {conflict.name.split(" ")[0]}
                          </span>
                        )}
                        {wouldExceed && !conflict && (
                          <span className="text-[10px] font-semibold text-red-500 bg-red-50 px-2 py-0.5 rounded-full">
                            Exceeds credit limit
                          </span>
                        )}
                      </div>

                      {/* Seat bar */}
                      <div className="mt-2 flex items-center gap-2">
                        <div className="flex-1 h-1 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full rounded-full"
                            style={{ width: `${pct}%`, background: pct > 90 ? "#f59e0b" : "#3b82f6" }} />
                        </div>
                        <span className="text-[10px] text-slate-400 flex-shrink-0">
                          {course.capacity - course.enrolled} seats left
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Cart */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 sticky top-6">
            <h2 className="text-base font-bold text-slate-800 flex items-center gap-2 mb-4">
              <ClipboardList className="w-4 h-4 text-blue-600" />
              Selected Courses
              {selected.length > 0 && (
                <span className="ml-auto w-5 h-5 bg-blue-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {selected.length}
                </span>
              )}
            </h2>

            {selected.length === 0 ? (
              <div className="text-center py-8">
                <BookOpen className="w-8 h-8 text-slate-200 mx-auto mb-2" />
                <p className="text-xs text-slate-400">No courses selected yet.</p>
                <p className="text-xs text-slate-300">Click any course to add it.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {selected.map((c, i) => (
                  <div key={i} className="flex items-start gap-2.5 p-2.5 bg-blue-50 border border-blue-100 rounded-xl group">
                    <div className="w-7 h-7 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-slate-800 leading-snug truncate">{c.name}</p>
                      <p className="text-[10px] text-slate-400">{c.code} · {c.day} · {c.credits} cr</p>
                    </div>
                    <button onClick={(e) => { e.stopPropagation(); toggle(c); }}
                      className="text-slate-300 hover:text-red-400 transition-colors flex-shrink-0">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}

                {/* Summary */}
                <div className="pt-3 border-t border-slate-100 space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Total Courses</span>
                    <span className="font-bold text-slate-800">{selected.length}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Total Credits</span>
                    <span className={`font-bold ${totalCredits > 20 ? "text-amber-500" : "text-slate-800"}`}>
                      {totalCredits} / {MAX_CREDITS}
                    </span>
                  </div>
                  {totalCredits > 20 && (
                    <div className="flex items-start gap-1.5 text-[10px] text-amber-600 bg-amber-50 p-2 rounded-lg">
                      <Info className="w-3 h-3 flex-shrink-0 mt-0.5" />
                      Approaching credit limit. Max {MAX_CREDITS} credits allowed.
                    </div>
                  )}
                </div>

                <button onClick={handleSubmit}
                  className="w-full py-2.5 mt-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm font-semibold rounded-xl shadow-md shadow-blue-200 flex items-center justify-center gap-2 transition-all">
                  <Send className="w-4 h-4" /> Submit Registration
                </button>
                <button onClick={() => setSelected([])}
                  className="w-full py-2 text-xs font-semibold text-red-400 hover:text-red-600 transition-colors flex items-center justify-center gap-1">
                  <Trash2 className="w-3 h-3" /> Clear All
                </button>
              </div>
            )}
          </div>

          {/* Tips */}
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4">
            <h3 className="text-xs font-bold text-blue-700 mb-2 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5" /> Registration Tips
            </h3>
            <ul className="space-y-1.5 text-xs text-blue-600">
              <li className="flex items-start gap-1.5"><CheckCircle className="w-3 h-3 flex-shrink-0 mt-0.5" /> Max {MAX_CREDITS} credits per semester</li>
              <li className="flex items-start gap-1.5"><CheckCircle className="w-3 h-3 flex-shrink-0 mt-0.5" /> Time conflicts are auto-detected</li>
              <li className="flex items-start gap-1.5"><CheckCircle className="w-3 h-3 flex-shrink-0 mt-0.5" /> Registration needs admin approval</li>
              <li className="flex items-start gap-1.5"><CheckCircle className="w-3 h-3 flex-shrink-0 mt-0.5" /> You can drop courses before deadline</li>
            </ul>
          </div>
        </div>
      </div>

      <ConfirmModal open={confirm} selected={selected}
        onConfirm={handleConfirm} onCancel={() => setConfirm(false)} submitting={submitting} />

      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}