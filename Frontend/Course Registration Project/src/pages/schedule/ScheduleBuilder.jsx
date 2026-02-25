import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { coursesData } from "../courses/CourseCatalog";
import {
  BookOpen, CheckCircle, AlertTriangle, Search,
  X, Save, Trash2, ChevronRight, Clock, Filter, Info
} from "lucide-react";

const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];
const times = [
  "08:30-10:00", "09:00-10:30", "10:30-12:00",
  "01:00-02:30", "02:30-04:00", "04:00-05:30"
];

const COLORS = ["blue", "indigo", "violet", "sky", "cyan", "emerald", "amber", "rose"];
const CELL_COLORS = {
  blue:    { bg: "bg-blue-50",    border: "border-blue-300",    text: "text-blue-700",    code: "text-blue-500" },
  indigo:  { bg: "bg-indigo-50",  border: "border-indigo-300",  text: "text-indigo-700",  code: "text-indigo-500" },
  violet:  { bg: "bg-violet-50",  border: "border-violet-300",  text: "text-violet-700",  code: "text-violet-500" },
  sky:     { bg: "bg-sky-50",     border: "border-sky-300",     text: "text-sky-700",     code: "text-sky-500" },
  cyan:    { bg: "bg-cyan-50",    border: "border-cyan-300",    text: "text-cyan-700",    code: "text-cyan-500" },
  emerald: { bg: "bg-emerald-50", border: "border-emerald-300", text: "text-emerald-700", code: "text-emerald-500" },
  amber:   { bg: "bg-amber-50",   border: "border-amber-300",   text: "text-amber-700",   code: "text-amber-500" },
  rose:    { bg: "bg-rose-50",    border: "border-rose-300",    text: "text-rose-700",    code: "text-rose-500" },
};

function hasTimeConflict(a, b) {
  if (a.day !== b.day) return false;
  const toMins = t => { const [h, m] = t.split(":").map(Number); return h * 60 + m; };
  const [aS, aE] = a.time.split("-").map(toMins);
  const [bS, bE] = b.time.split("-").map(toMins);
  return aS < bE && bS < aE;
}

function Toast({ msg, type, onClose }) {
  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl text-white
      ${type === "success" ? "bg-green-500" : type === "warn" ? "bg-amber-500" : "bg-red-500"}`}>
      {type === "success" ? <CheckCircle className="w-4 h-4 flex-shrink-0" /> : <AlertTriangle className="w-4 h-4 flex-shrink-0" />}
      <span className="text-sm font-medium">{msg}</span>
      <button onClick={onClose}><X className="w-4 h-4" /></button>
    </div>
  );
}

export default function ScheduleBuilder() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState([]);
  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("All");
  const [toast, setToast] = useState(null);
  const [saved, setSaved] = useState(false);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const conflicts = useMemo(() => {
    const found = [];
    for (let i = 0; i < selected.length; i++)
      for (let j = i + 1; j < selected.length; j++)
        if (hasTimeConflict(selected[i], selected[j]))
          found.push({ a: selected[i], b: selected[j] });
    return found;
  }, [selected]);

  const toggle = (course) => {
    const isSelected = selected.find(c => c.id === course.id);
    if (isSelected) {
      setSelected(prev => prev.filter(c => c.id !== course.id));
      return;
    }
    const colorIdx = selected.length % COLORS.length;
    setSelected(prev => [...prev, { ...course, _color: COLORS[colorIdx] }]);
    showToast(`"${course.name}" added to schedule`, "success");
  };

  const DEPTS = ["All", ...new Set(coursesData.map(c => c.dept))];

  const filtered = useMemo(() =>
    coursesData.filter(c =>
      (deptFilter === "All" || c.dept === deptFilter) &&
      (c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.code.toLowerCase().includes(search.toLowerCase()))
    ), [search, deptFilter]);

  const handleSave = () => {
    if (selected.length === 0) { showToast("Add at least one course first.", "error"); return; }
    if (conflicts.length > 0) { showToast("Resolve conflicts before saving.", "warn"); return; }
    setSaved(true);
    showToast("Schedule saved successfully!", "success");
    setTimeout(() => navigate("/schedule"), 1500);
  };

  const totalCredits = selected.reduce((a, c) => a + (c.credits || 0), 0);

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">Schedule Builder</h1>
          <p className="text-sm text-slate-400 mt-1">Build and preview your weekly timetable</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => navigate("/schedule/conflicts", { state: selected })}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl border transition-all
              ${conflicts.length > 0
                ? "text-red-600 bg-red-50 border-red-200 hover:bg-red-100"
                : "text-slate-600 bg-white border-slate-200 hover:bg-slate-50"}`}>
            <AlertTriangle className="w-4 h-4" />
            {conflicts.length > 0 ? `${conflicts.length} Conflict${conflicts.length > 1 ? "s" : ""}` : "No Conflicts"}
          </button>
          <button onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl hover:from-blue-700 hover:to-indigo-700 shadow-md shadow-blue-200 transition-all">
            <Save className="w-4 h-4" /> Save Schedule
          </button>
        </div>
      </div>

      {/* Conflict Banner */}
      {conflicts.length > 0 && (
        <div className="mb-5 bg-red-50 border border-red-200 rounded-2xl p-4 space-y-2">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-500" />
            <p className="text-sm font-bold text-red-700">{conflicts.length} Schedule Conflict{conflicts.length > 1 ? "s" : ""} Detected</p>
          </div>
          {conflicts.map((cf, i) => (
            <div key={i} className="flex items-center gap-2 text-xs text-red-600 bg-red-100 rounded-xl px-3 py-2">
              <span className="font-semibold">{cf.a.code}</span>
              <span className="text-red-400">vs</span>
              <span className="font-semibold">{cf.b.code}</span>
              <span className="text-red-400">·</span>
              <span>{cf.a.day} overlapping timeslot</span>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Left: Course Picker */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 space-y-3">
            <h2 className="text-sm font-bold text-slate-800">Add Courses</h2>
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5">
              <Search className="w-4 h-4 text-slate-400" />
              <input className="flex-1 bg-transparent text-sm text-slate-700 placeholder-slate-400 outline-none"
                placeholder="Search…" value={search} onChange={e => setSearch(e.target.value)} />
              {search && <button onClick={() => setSearch("")}><X className="w-3.5 h-3.5 text-slate-400" /></button>}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {DEPTS.map(d => (
                <button key={d} onClick={() => setDeptFilter(d)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all
                    ${deptFilter === d ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>
                  {d}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5 max-h-[60vh] overflow-y-auto pr-1">
            {filtered.map(course => {
              const isSelected = !!selected.find(c => c.id === course.id);
              const selectedCourse = selected.find(c => c.id === course.id);
              const cfg = selectedCourse ? CELL_COLORS[selectedCourse._color] : null;
              return (
                <div key={course.id} onClick={() => toggle(course)}
                  className={`rounded-xl border transition-all cursor-pointer p-3 group
                    ${isSelected
                      ? `${cfg?.bg} ${cfg?.border} border shadow-sm`
                      : "bg-white border-slate-100 hover:border-blue-200 hover:shadow-sm"}`}>
                  <div className="flex items-start gap-2">
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all
                      ${isSelected ? `border-current ${cfg?.text} bg-current` : "border-slate-300 group-hover:border-blue-400"}`}>
                      {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs font-bold truncate leading-snug ${isSelected ? cfg?.text : "text-slate-800"}`}>
                        {course.name}
                      </p>
                      <p className={`text-[10px] font-semibold ${isSelected ? cfg?.code : "text-slate-400"}`}>{course.code}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1">
                        <Clock className="w-2.5 h-2.5" />{course.day} · {course.time}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Timetable Preview */}
        <div className="lg:col-span-2 space-y-4">

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Courses", value: selected.length, color: "text-blue-600" },
              { label: "Credits", value: totalCredits, color: totalCredits > 20 ? "text-amber-500" : "text-indigo-600" },
              { label: "Conflicts", value: conflicts.length, color: conflicts.length > 0 ? "text-red-500" : "text-green-600" },
            ].map((m, i) => (
              <div key={i} className="bg-white rounded-xl border border-slate-100 shadow-sm p-3 text-center">
                <p className="text-xs text-slate-400 font-medium">{m.label}</p>
                <p className={`text-2xl font-bold mt-0.5 ${m.color}`}>{m.value}</p>
              </div>
            ))}
          </div>

          {/* Grid */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <div className="min-w-[520px]">
                {/* Day Headers */}
                <div className="grid grid-cols-6 border-b border-slate-100 bg-slate-50">
                  <div className="p-2.5 text-xs text-slate-400 font-semibold uppercase tracking-wide">Time</div>
                  {days.map(day => (
                    <div key={day} className="p-2.5 text-center border-l border-slate-100">
                      <p className="text-xs font-bold text-slate-600 uppercase tracking-wide">{day}</p>
                    </div>
                  ))}
                </div>

                {/* Rows */}
                {times.map(time => (
                  <div key={time} className="grid grid-cols-6 border-b border-slate-50" style={{ minHeight: "72px" }}>
                    <div className="p-2 border-r border-slate-100 flex flex-col justify-center">
                      <span className="text-[10px] font-semibold text-slate-400">{time.split("-")[0]}</span>
                      <span className="text-[9px] text-slate-300">{time.split("-")[1]}</span>
                    </div>
                    {days.map(day => {
                      const course = selected.find(c => c.day === day && c.time === time);
                      const cfg = course ? CELL_COLORS[course._color] : null;
                      const isConflictCell = conflicts.some(cf =>
                        (cf.a.id === course?.id || cf.b.id === course?.id)
                      );
                      return (
                        <div key={day + time} className="border-l border-slate-50 p-1">
                          {course && cfg ? (
                            <div className={`h-full rounded-lg border-l-4 ${isConflictCell ? "border-red-400 bg-red-50" : `${cfg.border} ${cfg.bg}`} px-1.5 py-1 relative`}>
                              {isConflictCell && (
                                <AlertTriangle className="w-2.5 h-2.5 text-red-400 absolute top-1 right-1" />
                              )}
                              <p className={`text-[9px] font-bold ${isConflictCell ? "text-red-500" : cfg.code} mb-0.5`}>{course.code}</p>
                              <p className={`text-[10px] font-semibold ${isConflictCell ? "text-red-700" : cfg.text} leading-tight line-clamp-2`}>
                                {course.name}
                              </p>
                              <button
                                onClick={(e) => { e.stopPropagation(); toggle(course); }}
                                className="absolute top-0.5 right-0.5 opacity-0 hover:opacity-100 group-hover:opacity-100 text-slate-300 hover:text-red-400 transition-all">
                              </button>
                            </div>
                          ) : (
                            <div className="h-full flex items-center justify-center">
                              <span className="text-[9px] text-slate-100">·</span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>

            {/* Legend */}
            {selected.length > 0 && (
              <div className="px-4 py-3 border-t border-slate-100 bg-slate-50 flex flex-wrap gap-2">
                {selected.map((c, i) => {
                  const cfg = CELL_COLORS[c._color];
                  return (
                    <div key={i} className="flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-sm ${cfg.bg} border ${cfg.border}`} />
                      <span className={`text-[10px] font-semibold ${cfg.text}`}>{c.code}</span>
                      <button onClick={() => toggle(c)} className="text-slate-300 hover:text-red-400 transition-colors">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {selected.length === 0 && (
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex items-start gap-3">
              <Info className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-blue-600 font-medium">Select courses from the left panel to see them appear on your timetable grid.</p>
            </div>
          )}
        </div>
      </div>

      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}