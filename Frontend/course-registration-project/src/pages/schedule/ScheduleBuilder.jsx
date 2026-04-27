import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  BookOpen, CheckCircle, AlertTriangle, Search,
  X, Save, ChevronRight, Clock, Info
} from "lucide-react";
import { BASE_URL } from "../../config";

export default function ScheduleBuilder() {
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
          code: c.courseCode,
          timeSlot: c.timeSlot,
          credits: c.credits
        }));
        setAllCourses(formatted);
      })
      .catch(err => console.error(err));
  }, []);

  const conflicts = useMemo(() => {
    const found = [];
    for (let i = 0; i < selected.length; i++) {
      for (let j = i + 1; j < selected.length; j++) {
        if (selected[i].timeSlot === selected[j].timeSlot) {
          found.push({ a: selected[i], b: selected[j] });
        }
      }
    }
    return found;
  }, [selected]);

  const toggle = (course) => {
    const exists = selected.find(c => c.id === course.id);

    if (exists) {
      setSelected(prev => prev.filter(c => c.id !== course.id));
    } else {
      setSelected(prev => [...prev, course]);
    }
  };

  const filtered = allCourses.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const totalCredits = selected.reduce((a, c) => a + c.credits, 0);

  const handleSave = () => {
    if (selected.length === 0) return alert("Add courses first");
    if (conflicts.length > 0) return alert("Resolve conflicts first");

    navigate("/registration");
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">

      <h1 className="text-2xl font-bold mb-4">Schedule Builder</h1>

      <input
        placeholder="Search courses..."
        className="border p-2 mb-4 w-full"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="grid md:grid-cols-2 gap-4 mb-6">
        {filtered.map(course => (
          <div
            key={course.id}
            onClick={() => toggle(course)}
            className={`border p-3 cursor-pointer ${
              selected.find(c => c.id === course.id) ? "bg-blue-100" : ""
            }`}
          >
            <p className="font-semibold">{course.name}</p>
            <p className="text-sm">{course.code}</p>
          </div>
        ))}
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h2 className="font-bold mb-2">Selected Courses</h2>

        {selected.map(c => (
          <div key={c.id} className="text-sm">
            {c.name} (Slot {c.timeSlot})
          </div>
        ))}

        <p className="mt-2">Credits: {totalCredits}</p>

        {conflicts.length > 0 && (
          <p className="text-red-500 text-sm">Conflicts detected!</p>
        )}

        <button
          onClick={handleSave}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
        >
          Save Schedule
        </button>
      </div>

    </div>
  );
}