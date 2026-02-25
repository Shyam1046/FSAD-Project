import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { coursesData } from "../courses/CourseCatalog";
import {
  AlertTriangle, CheckCircle, Clock, Calendar,
  ArrowLeft, BookOpen, ChevronRight, X, Zap
} from "lucide-react";

function hasTimeConflict(a, b) {
  if (a.day !== b.day) return false;
  const toMins = t => { const [h, m] = t.split(":").map(Number); return h * 60 + m; };
  const [aS, aE] = a.time.split("-").map(toMins);
  const [bS, bE] = b.time.split("-").map(toMins);
  return aS < bE && bS < aE;
}

// Find alternative slots for a conflicting course
function getAlternatives(course, selected) {
  return coursesData.filter(c =>
    c.id !== course.id &&
    c.code === course.code &&
    !selected.find(s => s.id === c.id) &&
    !selected.find(s => hasTimeConflict(s, c))
  );
}

export default function ConflictResolver() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const selected = state || [];
  const [resolved, setResolved] = useState([]);
  const [expanding, setExpanding] = useState(null);

  // Detect conflicts
  const conflicts = [];
  for (let i = 0; i < selected.length; i++)
    for (let j = i + 1; j < selected.length; j++)
      if (hasTimeConflict(selected[i], selected[j]))
        conflicts.push({ a: selected[i], b: selected[j], id: `${selected[i].id}-${selected[j].id}` });

  const unresolvedConflicts = conflicts.filter(c => !resolved.includes(c.id));
  const allResolved = unresolvedConflicts.length === 0;

  const markResolved = (id) => setResolved(prev => [...prev, id]);

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <button onClick={() => navigate("/schedule/builder", { state: selected })}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-blue-600 transition-colors mb-2">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Builder
          </button>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">Conflict Resolver</h1>
          <p className="text-sm text-slate-400 mt-1">
            {conflicts.length === 0 ? "No conflicts found in your schedule" : `${unresolvedConflicts.length} of ${conflicts.length} conflict${conflicts.length > 1 ? "s" : ""} need attention`}
          </p>
        </div>
        {allResolved && conflicts.length > 0 && (
          <button onClick={() => navigate("/schedule/builder")}
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl shadow-md">
            <CheckCircle className="w-4 h-4" /> Back to Builder
          </button>
        )}
      </div>

      {/* No conflicts */}
      {conflicts.length === 0 ? (
        <div className="bg-white rounded-2xl border border-green-200 shadow-sm p-12 text-center max-w-md mx-auto">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
          <h2 className="text-lg font-bold text-slate-800 mb-1">No Conflicts Detected!</h2>
          <p className="text-sm text-slate-400 mb-6">Your schedule is clean. All courses have unique time slots.</p>
          <button onClick={() => navigate("/schedule/builder")}
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl mx-auto shadow-md shadow-blue-200">
            Back to Builder <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="space-y-5 max-w-3xl">

          {/* Summary */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Total Conflicts", value: conflicts.length, color: "text-red-500", bg: "bg-red-50", border: "border-red-100" },
              { label: "Resolved", value: resolved.length, color: "text-green-600", bg: "bg-green-50", border: "border-green-100" },
              { label: "Remaining", value: unresolvedConflicts.length, color: "text-amber-500", bg: "bg-amber-50", border: "border-amber-100" },
            ].map((m, i) => (
              <div key={i} className={`bg-white rounded-xl border ${m.border} shadow-sm p-4 text-center`}>
                <p className="text-xs text-slate-500 font-medium">{m.label}</p>
                <p className={`text-2xl font-bold mt-1 ${m.color}`}>{m.value}</p>
              </div>
            ))}
          </div>

          {/* All resolved banner */}
          {allResolved && (
            <div className="bg-green-50 border border-green-200 rounded-2xl p-5 flex items-center gap-4">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <p className="text-sm font-bold text-green-700">All conflicts resolved!</p>
                <p className="text-xs text-green-500 mt-0.5">Your schedule is ready to save.</p>
              </div>
              <button onClick={() => navigate("/schedule/builder")}
                className="ml-auto flex items-center gap-2 px-4 py-2 text-sm font-semibold text-green-700 bg-green-100 hover:bg-green-200 rounded-xl transition-colors">
                Go to Builder <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Conflict Cards */}
          {conflicts.map((cf, idx) => {
            const isResolved = resolved.includes(cf.id);
            const altA = getAlternatives(cf.a, selected);
            const altB = getAlternatives(cf.b, selected);
            return (
              <div key={cf.id}
                className={`bg-white rounded-2xl border shadow-sm overflow-hidden transition-all
                  ${isResolved ? "border-green-200" : "border-red-200"}`}>

                {/* Header */}
                <div className={`px-5 py-3.5 flex items-center justify-between
                  ${isResolved ? "bg-green-50 border-b border-green-100" : "bg-red-50 border-b border-red-100"}`}>
                  <div className="flex items-center gap-2">
                    {isResolved
                      ? <CheckCircle className="w-4 h-4 text-green-500" />
                      : <AlertTriangle className="w-4 h-4 text-red-500" />}
                    <p className={`text-sm font-bold ${isResolved ? "text-green-700" : "text-red-700"}`}>
                      {isResolved ? "Conflict Resolved" : `Conflict ${idx + 1}`}
                    </p>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full
                      ${isResolved ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}>
                      {cf.a.day} · overlapping slots
                    </span>
                  </div>
                  {!isResolved && (
                    <button onClick={() => markResolved(cf.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-green-600 bg-green-100 hover:bg-green-200 rounded-xl transition-colors">
                      <Zap className="w-3 h-3" /> Mark Resolved
                    </button>
                  )}
                </div>

                {/* Conflicting courses */}
                <div className="p-5 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[cf.a, cf.b].map((course, ci) => (
                      <div key={ci} className={`rounded-xl border-l-4 p-4
                        ${isResolved ? "border-green-300 bg-green-50/50" : "border-red-300 bg-red-50"}`}>
                        <div className="flex items-start gap-2">
                          <BookOpen className={`w-4 h-4 flex-shrink-0 mt-0.5 ${isResolved ? "text-green-500" : "text-red-400"}`} />
                          <div>
                            <p className="text-sm font-bold text-slate-800 leading-snug">{course.name}</p>
                            <p className="text-xs text-indigo-500 font-semibold mt-0.5">{course.code}</p>
                            <div className="flex gap-2 mt-1.5">
                              <span className="flex items-center gap-1 text-xs text-slate-500">
                                <Calendar className="w-3 h-3" />{course.day}
                              </span>
                              <span className="flex items-center gap-1 text-xs text-slate-500">
                                <Clock className="w-3 h-3" />{course.time}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Suggested Resolution */}
                  {!isResolved && (
                    <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                      <p className="text-xs font-bold text-blue-700 mb-2 flex items-center gap-1.5">
                        <Zap className="w-3.5 h-3.5" /> Suggested Resolution
                      </p>
                      <p className="text-xs text-blue-600 mb-3">
                        Drop one of the conflicting courses, or replace it with an alternative slot if available.
                      </p>
                      <div className="space-y-2">
                        <p className="text-[10px] text-blue-500 font-semibold uppercase tracking-wide">Steps to resolve:</p>
                        {[
                          `Go back to Schedule Builder`,
                          `Remove either "${cf.a.code}" or "${cf.b.code}"`,
                          `Add an alternative course with a different time slot`,
                        ].map((step, i) => (
                          <div key={i} className="flex items-start gap-2 text-xs text-blue-600">
                            <span className="w-4 h-4 rounded-full bg-blue-200 text-blue-700 text-[9px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                              {i + 1}
                            </span>
                            {step}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Enrolled Courses List */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <h2 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-blue-600" /> All Selected Courses ({selected.length})
            </h2>
            <div className="space-y-2">
              {selected.map((c, i) => {
                const hasConflict = conflicts.some(cf =>
                  (cf.a.id === c.id || cf.b.id === c.id) && !resolved.includes(cf.id)
                );
                return (
                  <div key={i} className={`flex items-center gap-3 p-3 rounded-xl border transition-all
                    ${hasConflict ? "border-red-100 bg-red-50/50" : "border-slate-100 bg-slate-50"}`}>
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0
                      ${hasConflict ? "bg-red-100" : "bg-blue-100"}`}>
                      <BookOpen className={`w-3.5 h-3.5 ${hasConflict ? "text-red-500" : "text-blue-600"}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-800 truncate">{c.name}</p>
                      <p className="text-xs text-slate-400">{c.code} · {c.day} {c.time}</p>
                    </div>
                    {hasConflict
                      ? <span className="text-[10px] font-bold text-red-500 bg-red-100 px-2 py-0.5 rounded-full flex-shrink-0">Conflict</span>
                      : <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}