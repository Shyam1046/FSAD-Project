import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Calendar, Clock, BookOpen, ChevronRight, Download,
  AlertTriangle, CheckCircle, Info, Maximize2
} from "lucide-react";

const timeSlots = [
  "08:30-10:00",
  "09:00-10:30",
  "10:30-12:00",
  "12:00-01:00",
  "01:00-02:30",
  "02:30-04:00",
  "04:00-05:30",
];

const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];

const schedule = [
  { course: "Database Management Systems", code: "CS301", day: "Mon", time: "09:00-10:30", room: "A-204", credits: 4, color: "blue" },
  { course: "Operating Systems", code: "CS302", day: "Tue", time: "10:30-12:00", room: "B-101", credits: 4, color: "indigo" },
  { course: "AI & Machine Learning", code: "CS401", day: "Wed", time: "01:00-02:30", room: "C-305", credits: 4, color: "violet" },
  { course: "Computer Networks", code: "CS303", day: "Thu", time: "02:30-04:00", room: "A-102", credits: 3, color: "sky" },
  { course: "Full Stack Development", code: "CS404", day: "Fri", time: "10:30-12:00", room: "B-203", credits: 3, color: "cyan" },
  { course: "Probability & Statistics", code: "MA201", day: "Mon", time: "01:00-02:30", room: "D-401", credits: 3, color: "emerald" },
];

const CELL_COLORS = {
  blue:    { bg: "bg-blue-50",    border: "border-blue-300",   text: "text-blue-700",    code: "text-blue-500",   dot: "bg-blue-400" },
  indigo:  { bg: "bg-indigo-50",  border: "border-indigo-300", text: "text-indigo-700",  code: "text-indigo-500", dot: "bg-indigo-400" },
  violet:  { bg: "bg-violet-50",  border: "border-violet-300", text: "text-violet-700",  code: "text-violet-500", dot: "bg-violet-400" },
  sky:     { bg: "bg-sky-50",     border: "border-sky-300",    text: "text-sky-700",     code: "text-sky-500",    dot: "bg-sky-400" },
  cyan:    { bg: "bg-cyan-50",    border: "border-cyan-300",   text: "text-cyan-700",    code: "text-cyan-500",   dot: "bg-cyan-400" },
  emerald: { bg: "bg-emerald-50", border: "border-emerald-300",text: "text-emerald-700", code: "text-emerald-500",dot: "bg-emerald-400" },
};

const DAY_LABELS = { Mon: "Monday", Tue: "Tuesday", Wed: "Wednesday", Thu: "Thursday", Fri: "Friday" };
const TODAY = ["Mon", "Tue", "Wed", "Thu", "Fri"][new Date().getDay() - 1] || "Mon";

export default function MySchedule() {
  const navigate = useNavigate();
  const [hoveredCell, setHoveredCell] = useState(null);
  const [view, setView] = useState("grid");

  const totalCredits = schedule.reduce((a, c) => a + c.credits, 0);

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">My Schedule</h1>
          <p className="text-sm text-slate-400 mt-1">Semester 6 · {schedule.length} courses · {totalCredits} credits</p>
        </div>
        <div className="flex gap-2">
          {/* View Toggle */}
          <div className="flex bg-white border border-slate-200 rounded-xl p-1 gap-1">
            {["grid", "list"].map(v => (
              <button key={v} onClick={() => setView(v)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all capitalize
                  ${view === v ? "bg-blue-600 text-white shadow" : "text-slate-500 hover:text-slate-700"}`}>
                {v}
              </button>
            ))}
          </div>
          <button onClick={() => navigate("/schedule/builder")}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-blue-600 bg-blue-50 border border-blue-100 rounded-xl hover:bg-blue-100 transition-all">
            <Maximize2 className="w-4 h-4" /> Builder
          </button>
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 shadow-sm">
            <Download className="w-4 h-4" /> Export
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Courses", value: schedule.length, color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-100" },
          { label: "Total Credits", value: totalCredits, color: "text-indigo-600", bg: "bg-indigo-50", border: "border-indigo-100" },
          { label: "Weekly Hours", value: `${schedule.length * 1.5}h`, color: "text-sky-600", bg: "bg-sky-50", border: "border-sky-100" },
          { label: "Free Slots", value: days.length * timeSlots.length - schedule.length, color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100" },
        ].map((m, i) => (
          <div key={i} className={`bg-white rounded-xl border ${m.border} shadow-sm p-4`}>
            <p className="text-xs text-slate-500 font-medium">{m.label}</p>
            <p className={`text-2xl font-bold mt-1 ${m.color}`}>{m.value}</p>
          </div>
        ))}
      </div>

      {view === "grid" ? (
        /* ── Grid View ── */
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <div className="min-w-[700px]">
              {/* Day Headers */}
              <div className="grid grid-cols-6 border-b border-slate-100">
                <div className="p-3 text-xs text-slate-400 font-semibold uppercase tracking-wide">Time</div>
                {days.map(day => (
                  <div key={day}
                    className={`p-3 text-center border-l border-slate-100
                      ${day === TODAY ? "bg-blue-50" : ""}`}>
                    <p className={`text-xs font-bold uppercase tracking-wide ${day === TODAY ? "text-blue-600" : "text-slate-500"}`}>
                      {day}
                    </p>
                    <p className={`text-[10px] mt-0.5 ${day === TODAY ? "text-blue-400" : "text-slate-300"}`}>
                      {DAY_LABELS[day]}
                    </p>
                    {day === TODAY && (
                      <span className="inline-block w-1.5 h-1.5 bg-blue-500 rounded-full mt-1" />
                    )}
                  </div>
                ))}
              </div>

              {/* Time Slot Rows */}
              {timeSlots.map((time, ti) => {
                const isLunch = time === "12:00-01:00";
                return (
                  <div key={time}
                    className={`grid grid-cols-6 border-b border-slate-50 ${isLunch ? "bg-slate-50/60" : ""}`}
                    style={{ minHeight: isLunch ? "40px" : "80px" }}>
                    {/* Time label */}
                    <div className="p-2 flex flex-col justify-center border-r border-slate-100">
                      <span className="text-[10px] font-semibold text-slate-400">{time.split("-")[0]}</span>
                      <span className="text-[10px] text-slate-300">{time.split("-")[1]}</span>
                      {isLunch && <span className="text-[9px] text-slate-300 mt-0.5">Lunch</span>}
                    </div>

                    {/* Day Cells */}
                    {days.map(day => {
                      const course = schedule.find(c => c.day === day && c.time === time);
                      const cfg = course ? CELL_COLORS[course.color] : null;
                      const cellKey = `${day}-${time}`;
                      return (
                        <div key={cellKey}
                          className={`border-l border-slate-50 p-1.5 relative
                            ${day === TODAY ? "bg-blue-50/30" : ""}
                            ${isLunch ? "" : "hover:bg-slate-50"} transition-colors`}
                          onMouseEnter={() => course && setHoveredCell(cellKey)}
                          onMouseLeave={() => setHoveredCell(null)}>
                          {course && cfg ? (
                            <div className={`h-full rounded-xl border-l-4 ${cfg.border} ${cfg.bg} px-2 py-1.5 cursor-pointer group`}>
                              <p className={`text-[10px] font-bold ${cfg.code} mb-0.5`}>{course.code}</p>
                              <p className={`text-xs font-semibold ${cfg.text} leading-tight line-clamp-2`}>{course.course}</p>
                              <p className={`text-[10px] ${cfg.code} mt-0.5 opacity-70`}>Room {course.room}</p>
                            </div>
                          ) : isLunch ? (
                            <div className="flex items-center justify-center h-full">
                              <span className="text-[9px] text-slate-300">—</span>
                            </div>
                          ) : (
                            <div className="flex items-center justify-center h-full opacity-0 hover:opacity-100 transition-opacity">
                              <span className="text-[9px] text-slate-200">free</span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Legend */}
          <div className="px-4 py-3 border-t border-slate-100 flex flex-wrap gap-3">
            {schedule.map((c, i) => {
              const cfg = CELL_COLORS[c.color];
              return (
                <div key={i} className="flex items-center gap-1.5">
                  <span className={`w-2.5 h-2.5 rounded-sm ${cfg.dot}`} />
                  <span className="text-[10px] text-slate-500 font-medium">{c.code}</span>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* ── List View ── */
        <div className="space-y-3">
          {["Mon", "Tue", "Wed", "Thu", "Fri"].map(day => {
            const dayCourses = schedule.filter(c => c.day === day);
            return (
              <div key={day} className={`bg-white rounded-2xl border shadow-sm overflow-hidden
                ${day === TODAY ? "border-blue-200" : "border-slate-100"}`}>
                <div className={`px-5 py-3 flex items-center justify-between border-b
                  ${day === TODAY ? "bg-blue-50 border-blue-100" : "bg-slate-50 border-slate-100"}`}>
                  <div className="flex items-center gap-2">
                    <h3 className={`text-sm font-bold ${day === TODAY ? "text-blue-700" : "text-slate-700"}`}>
                      {DAY_LABELS[day]}
                    </h3>
                    {day === TODAY && (
                      <span className="text-[10px] font-bold text-blue-500 bg-blue-100 px-2 py-0.5 rounded-full">Today</span>
                    )}
                  </div>
                  <span className="text-xs text-slate-400 font-medium">{dayCourses.length} class{dayCourses.length !== 1 ? "es" : ""}</span>
                </div>
                {dayCourses.length === 0 ? (
                  <div className="py-6 text-center text-xs text-slate-300">No classes scheduled</div>
                ) : (
                  <div className="divide-y divide-slate-50">
                    {dayCourses.sort((a, b) => a.time.localeCompare(b.time)).map((c, i) => {
                      const cfg = CELL_COLORS[c.color];
                      return (
                        <div key={i} className={`flex items-center gap-4 px-5 py-3.5 hover:bg-slate-50 transition-colors`}>
                          <div className={`w-1 h-10 rounded-full ${cfg.dot} flex-shrink-0`} />
                          <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{background: `${cfg.bg}`}}>
                            <BookOpen className={`w-4 h-4 ${cfg.text}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-slate-800 truncate">{c.course}</p>
                            <p className={`text-xs font-semibold ${cfg.code}`}>{c.code}</p>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className="text-xs font-semibold text-slate-600 flex items-center gap-1 justify-end">
                              <Clock className="w-3 h-3 text-slate-400" />{c.time}
                            </p>
                            <p className="text-[10px] text-slate-400 mt-0.5">Room {c.room}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}