import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  BookOpen, Clock, Calendar, Trash2, ChevronRight,
  Award, AlertTriangle, CheckCircle, Plus, Star, X
} from "lucide-react";
import { BASE_URL } from "../../config";

const TAG_COLORS = {
  Core: "bg-blue-100 text-blue-700",
  Elective: "bg-indigo-100 text-indigo-700",
  Popular: "bg-amber-100 text-amber-700",
  New: "bg-green-100 text-green-700",
};

export default function MyCourses() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [dropId, setDropId] = useState(null);
  const [toast, setToast] = useState(null);

  // ✅ FETCH FROM BACKEND
  useEffect(() => {
    fetch(`${BASE_URL}/courses`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    })
      .then(res => res.json())
      .then(data => {
        // map backend → UI safe structure
        const formatted = data.map(c => ({
          id: c.id,
          name: c.name,
          instructor: c.instructor,
          duration: c.duration,
          code: `C-${c.id}`,
          day: "Mon",
          time: "09:00-10:00",
          credits: 3,              // fallback
          rating: 4.5,             // fallback
          enrolled: 20,            // fallback
          capacity: 40,            // fallback
          tags: ["Core"]
        }));
        setCourses(formatted);
      })
      .catch(err => console.error(err));
  }, []);

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

      {/* List */}
      <div className="space-y-3">
        {sorted.map(course => {
          const pct = Math.round((course.enrolled / course.capacity) * 100);
          return (
            <div key={course.id} className="bg-white rounded-2xl border shadow-sm p-5">

              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                </div>

                <div className="flex-1">
                  <h3 className="font-bold">{course.name}</h3>
                  <p className="text-xs text-indigo-500">{course.code}</p>

                  <div className="flex gap-3 mt-2 text-xs text-gray-500">
                    <span>{course.day}</span>
                    <span>{course.time}</span>
                    <span>{course.credits} credits</span>
                  </div>

                  <div className="mt-2 text-xs">
                    {course.enrolled}/{course.capacity}
                  </div>
                </div>
              </div>

              <div className="flex justify-between mt-4">
                <button
                  onClick={() => navigate("/courses/details", { state: course })}
                  className="text-blue-600 text-sm"
                >
                  View Details →
                </button>

                <button
                  onClick={() => setDropId(course.id)}
                  className="text-red-500 text-sm"
                >
                  Drop
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {/* Modal */}
      {dropId && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40">
          <div className="bg-white p-6 rounded">
            <p>Drop course?</p>
            <button onClick={handleDrop}>Yes</button>
            <button onClick={() => setDropId(null)}>No</button>
          </div>
        </div>
      )}
    </div>
  );
}