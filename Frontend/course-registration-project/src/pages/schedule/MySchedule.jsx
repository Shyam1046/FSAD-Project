import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Calendar, Clock, BookOpen, ChevronRight, Download,
  AlertTriangle, CheckCircle, Info, Maximize2
} from "lucide-react";
import { BASE_URL } from "../../config";

const timeSlots = [
  "A1","A2","A3","A4","B1","B2","B3","B4",
  "C1","C2","C3","C4","D1","D2","D3","D4",
  "E1","E2","E3","E4"
];

const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];

const CELL_COLORS = {
  blue:    { bg: "bg-blue-50", border: "border-blue-300", text: "text-blue-700", code: "text-blue-500", dot: "bg-blue-400" },
  indigo:  { bg: "bg-indigo-50", border: "border-indigo-300", text: "text-indigo-700", code: "text-indigo-500", dot: "bg-indigo-400" },
  violet:  { bg: "bg-violet-50", border: "border-violet-300", text: "text-violet-700", code: "text-violet-500", dot: "bg-violet-400" },
  sky:     { bg: "bg-sky-50", border: "border-sky-300", text: "text-sky-700", code: "text-sky-500", dot: "bg-sky-400" },
  cyan:    { bg: "bg-cyan-50", border: "border-cyan-300", text: "text-cyan-700", code: "text-cyan-500", dot: "bg-cyan-400" },
  emerald: { bg: "bg-emerald-50", border: "border-emerald-300", text: "text-emerald-700", code: "text-emerald-500", dot: "bg-emerald-400" }
};

const colors = ["blue", "indigo", "violet", "sky", "cyan", "emerald"];

export default function MySchedule() {
  const navigate = useNavigate();
  const [hoveredCell, setHoveredCell] = useState(null);
  const [view, setView] = useState("grid");
  const [schedule, setSchedule] = useState([]);

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    fetch(`${BASE_URL}/registrations/${userId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    })
      .then(res => res.json())
      .then(data => {
        const formatted = data.map((r, index) => ({
          course: r.course.courseName,
          code: r.course.courseCode,
          day: days[index % days.length],
          time: r.course.timeSlot,
          room: "TBA",
          credits: r.course.credits,
          color: colors[index % colors.length]
        }));

        setSchedule(formatted);
      })
      .catch(err => console.error(err));
  }, []);

  const totalCredits = schedule.reduce((a, c) => a + c.credits, 0);

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">My Schedule</h1>
          <p className="text-sm text-slate-400 mt-1">
            Semester 6 · {schedule.length} courses · {totalCredits} credits
          </p>
        </div>

        <div className="flex gap-2">
          <div className="flex bg-white border border-slate-200 rounded-xl p-1 gap-1">
            {["grid", "list"].map(v => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all capitalize
                  ${view === v ? "bg-blue-600 text-white shadow" : "text-slate-500 hover:text-slate-700"}`}
              >
                {v}
              </button>
            ))}
          </div>

          <button
            onClick={() => navigate("/schedule/builder")}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-blue-600 bg-blue-50 border border-blue-100 rounded-xl hover:bg-blue-100 transition-all"
          >
            <Maximize2 className="w-4 h-4" /> Builder
          </button>

          <button className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 shadow-sm">
            <Download className="w-4 h-4" /> Export
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Courses", value: schedule.length, color: "text-blue-600", border: "border-blue-100" },
          { label: "Total Credits", value: totalCredits, color: "text-indigo-600", border: "border-indigo-100" }
        ].map((m, i) => (
          <div key={i} className={`bg-white rounded-xl border ${m.border} shadow-sm p-4`}>
            <p className="text-xs text-slate-500 font-medium">{m.label}</p>
            <p className={`text-2xl font-bold mt-1 ${m.color}`}>{m.value}</p>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        {schedule.map((c, i) => {
          const cfg = CELL_COLORS[c.color];

          return (
            <div key={i} className="bg-white rounded-2xl border shadow-sm overflow-hidden border-slate-100">
              <div className="flex items-center gap-4 px-5 py-3.5 hover:bg-slate-50 transition-colors">
                <div className={`w-1 h-10 rounded-full ${cfg.dot} flex-shrink-0`} />
                <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0">
                  <BookOpen className={`w-4 h-4 ${cfg.text}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-800 truncate">{c.course}</p>
                  <p className={`text-xs font-semibold ${cfg.code}`}>{c.code}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-xs font-semibold text-slate-600">
                    Slot {c.time}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5">{c.room}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}