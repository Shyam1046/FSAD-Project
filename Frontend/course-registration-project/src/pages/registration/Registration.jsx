import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  BookOpen, Clock, Calendar, Search, X, CheckCircle,
  AlertTriangle, Filter, Star, Award,
  ClipboardList, Info, Trash2, Send
} from "lucide-react";
import { BASE_URL } from "../../config";

const MAX_CREDITS = 24;

export default function Registration() {
  const navigate = useNavigate();

  const [allCourses, setAllCourses] = useState([]);
  const [selected, setSelected] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch(`${BASE_URL}/courses`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    })
      .then(res => res.json())
      .then(data => {
        const formatted = data.map(c => ({
          id: c.id,
          name: c.courseName,
          instructor: c.facultyName,
          duration: c.credits,
          code: c.courseCode,
          timeSlot: c.timeSlot,
          credits: c.credits,
          rating: 4.5,
          enrolled: 20,
          capacity: 40,
          dept: "CSE",
          tags: ["Core"]
        }));
        setAllCourses(formatted);
      })
      .catch(err => console.error(err));
  }, []);

  const totalCredits = selected.reduce((a, c) => a + c.credits, 0);

  const toggle = (course) => {
    const exists = selected.find(c => c.id === course.id);

    if (exists) {
      setSelected(prev => prev.filter(c => c.id !== course.id));
      return;
    }

    if (totalCredits + course.credits > MAX_CREDITS) {
      alert("Credit limit exceeded");
      return;
    }

    const conflict = selected.find(
      c => c.timeSlot === course.timeSlot
    );

    if (conflict) {
      alert("Time slot conflict detected");
      return;
    }

    setSelected(prev => [...prev, course]);
  };

  const filtered = useMemo(() =>
    allCourses.filter(c =>
      c.name.toLowerCase().includes(search.toLowerCase())
    ), [search, allCourses]
  );

  const handleSubmit = async () => {
    if (selected.length === 0) {
      alert("Select courses first");
      return;
    }

    const userId = localStorage.getItem("userId");

    for (const course of selected) {
      await fetch(`${BASE_URL}/registrations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({
          userId,
          courseId: course.id
        })
      });
    }

    alert("Registration submitted");
    navigate("/schedule");
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">

      <h1 className="text-2xl font-bold mb-4">Course Registration</h1>

      <input
        placeholder="Search courses..."
        className="border p-2 w-full mb-4"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="grid md:grid-cols-2 gap-4">

        <div className="space-y-2">
          {filtered.map(course => {
            const selectedCourse = selected.find(c => c.id === course.id);

            return (
              <div
                key={course.id}
                onClick={() => toggle(course)}
                className={`border p-3 cursor-pointer ${
                  selectedCourse ? "bg-blue-100" : ""
                }`}
              >
                <p className="font-semibold">{course.name}</p>
                <p className="text-sm">{course.code}</p>
                <p className="text-sm">
                  Slot | {course.timeSlot}
                </p>
              </div>
            );
          })}
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-bold mb-2">Selected Courses</h2>

          {selected.map(c => (
            <div key={c.id} className="flex justify-between border p-2 mb-2">
              <span>{c.name}</span>
              <button onClick={() => toggle(c)}>Remove</button>
            </div>
          ))}

          <p className="mt-2">Credits: {totalCredits}</p>

          <button
            onClick={handleSubmit}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
          >
            Submit
          </button>
        </div>

      </div>

    </div>
  );
}