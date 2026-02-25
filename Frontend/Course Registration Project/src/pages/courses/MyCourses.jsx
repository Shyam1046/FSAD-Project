import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { coursesData } from "./CourseCatalog";
import {
  BookOpen, Clock, Calendar, Trash2, ChevronRight,
  Award, AlertTriangle, CheckCircle, Plus, Star, X
} from "lucide-react";

const TAG_COLORS = {
  Core: "bg-blue-100 text-blue-700",
  Elective: "bg-indigo-100 text-indigo-700",
  Popular: "bg-amber-100 text-amber-700",
  New: "bg-green-100 text-green-700",
};

export default function MyCourses() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState(coursesData.slice(0, 4));
  const [dropId, setDropId] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleDrop = () => {
    const dropped = courses.find(c => c.id === dropId);
    setCourses(cs => cs.filter(c => c.id !== dropId));
    setDropId(null);
    showToast(`Dropped "${dropped?.name}"`, "error");
  };

  const totalCredits = courses.reduce((a, c) => a + (c.credits || 0), 0);

  const DAY_ORDER = { Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5 };
  const sorted = [...courses].sort((a, b) => (DAY_ORDER[a.day] || 0) - (DAY_ORDER[b.day] || 0));

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">

      {/* Toast */}
      {toast && (
        <div className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-4 py-3 ${toast.type === "success" ? "bg-green-500" : "bg-red-500"} text-white rounded-2xl shadow-xl`}>
          {toast.type === "success" ? <CheckCircle className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
          <span className="text-sm font-medium">{toast.msg}</span>
          <button onClick={() => setToast(null)}><X className="w-4 h-4" /></button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">My Courses</h1>
          <p className="text-sm text-slate-400 mt-1">Your enrolled courses this semester</p>
        </div>
        <button onClick={() => navigate("/courses")}
          className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl hover:from-blue-700 hover:to-indigo-700 shadow-md shadow-blue-200 transition-all">
          <Plus className="w-4 h-4" /> Add Course
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Enrolled", value: courses.length, color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-100" },
          { label: "Total Credits", value: totalCredits, color: "text-indigo-600", bg: "bg-indigo-50", border: "border-indigo-100" },
          { label: "Core Courses", value: courses.filter(c => c.tags?.includes("Core")).length, color: "text-sky-600", bg: "bg-sky-50", border: "border-sky-100" },
          { label: "Electives", value: courses.filter(c => c.tags?.includes("Elective")).length, color: "text-violet-600", bg: "bg-violet-50", border: "border-violet-100" },
        ].map((m, i) => (
          <div key={i} className={`bg-white rounded-xl border ${m.border} shadow-sm p-4`}>
            <p className="text-xs text-slate-500 font-medium">{m.label}</p>
            <p className={`text-2xl font-bold mt-1 ${m.color}`}>{m.value}</p>
          </div>
        ))}
      </div>

      {/* Credit limit warning */}
      {totalCredits > 24 && (
        <div className="mb-5 bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0" />
          <p className="text-sm text-amber-700 font-medium">
            You've exceeded the recommended credit limit of 24. Consider dropping a course.
          </p>
        </div>
      )}

      {/* Empty state */}
      {courses.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-12 text-center">
          <BookOpen className="w-10 h-10 mx-auto mb-3 text-slate-300" />
          <p className="text-slate-600 font-semibold">No courses enrolled yet</p>
          <p className="text-sm text-slate-400 mt-1 mb-5">Browse the catalog and register for courses</p>
          <button onClick={() => navigate("/courses")}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-md shadow-blue-200">
            <Plus className="w-4 h-4" /> Browse Courses
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {sorted.map((course, i) => {
            const pct = Math.round((course.enrolled / course.capacity) * 100);
            return (
              <div key={course.id}
                className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-blue-100 transition-all duration-200 p-5">
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <BookOpen className="w-5 h-5 text-blue-600" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-sm font-bold text-slate-800 leading-snug">{course.name}</h3>
                        <p className="text-xs font-mono text-indigo-500 font-semibold mt-0.5">{course.code}</p>
                      </div>
                      <div className="flex items-center gap-1 text-xs font-semibold text-amber-500 flex-shrink-0">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />{course.rating}
                      </div>
                    </div>

                    {/* Meta row */}
                    <div className="flex flex-wrap items-center gap-3 mt-2">
                      <span className="flex items-center gap-1 text-xs text-slate-500">
                        <Calendar className="w-3 h-3" /> {course.day}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-slate-500">
                        <Clock className="w-3 h-3" /> {course.time}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-slate-500">
                        <Award className="w-3 h-3" /> {course.credits} credits
                      </span>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mt-2">
                      {(course.tags || []).map(tag => (
                        <span key={tag} className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${TAG_COLORS[tag]}`}>{tag}</span>
                      ))}
                    </div>

                    {/* Enrollment */}
                    <div className="mt-3">
                      <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                        <span>Class Enrollment</span>
                        <span>{course.enrolled}/{course.capacity}</span>
                      </div>
                      <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full rounded-full"
                          style={{ width: `${pct}%`, background: pct > 90 ? "#f59e0b" : "#3b82f6" }} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer actions */}
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-50">
                  <button
                    onClick={() => navigate("/courses/details", { state: course })}
                    className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:underline"
                  >
                    View Details <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setDropId(course.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-500 bg-red-50 border border-red-100 rounded-xl hover:bg-red-100 transition-colors"
                  >
                    <Trash2 className="w-3 h-3" /> Drop Course
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Drop Confirm Modal */}
      {dropId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setDropId(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full z-10 text-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-5 h-5 text-red-500" />
            </div>
            <h3 className="text-base font-bold text-slate-800 mb-1">Drop Course?</h3>
            <p className="text-sm text-slate-500 mb-1">
              <span className="font-semibold text-slate-700">
                {courses.find(c => c.id === dropId)?.name}
              </span>
            </p>
            <p className="text-xs text-slate-400 mb-5">This will remove the course from your schedule.</p>
            <div className="flex gap-3">
              <button onClick={() => setDropId(null)}
                className="flex-1 py-2 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50">
                Cancel
              </button>
              <button onClick={handleDrop}
                className="flex-1 py-2 bg-red-500 hover:bg-red-600 rounded-xl text-sm font-semibold text-white transition-colors">
                Drop Course
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}