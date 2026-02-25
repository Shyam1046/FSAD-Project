import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export const coursesData = [
  { id: 1, name: "Database Management Systems", code: "CS301", day: "Mon", time: "09:00-10:30" },
  { id: 2, name: "Operating Systems", code: "CS302", day: "Tue", time: "10:30-12:00" },
  { id: 3, name: "Artificial Intelligence & Machine Learning", code: "CS401", day: "Wed", time: "01:00-02:30" },
  { id: 4, name: "Computer Networks", code: "CS303", day: "Thu", time: "02:30-04:00" },
  { id: 5, name: "Full Stack Application Development", code: "CS404", day: "Fri", time: "10:30-12:00" },
  { id: 6, name: "Probability and Statistics", code: "MA201", day: "Mon", time: "01:00-02:30" },
  { id: 7, name: "Data Structures and Algorithms", code: "CS201", day: "Tue", time: "01:00-02:30" },
  { id: 8, name: "Cloud Infrastructure", code: "CS405", day: "Wed", time: "09:00-10:30" },
  { id: 9, name: "Research Methodology", code: "HS301", day: "Thu", time: "01:00-02:30" },
  { id: 10, name: "Software Engineering", code: "CS304", day: "Fri", time: "01:00-02:30" },
];

export default function CourseCatalog() {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const filtered = coursesData.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 to-violet-700 p-6">
      <div className="bg-white rounded-2xl shadow-xl p-6 space-y-4">
        <h1 className="text-2xl font-semibold">Course Catalog</h1>

        <input
          placeholder="Search..."
          className="w-full border p-2 rounded"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="grid md:grid-cols-2 gap-4">
          {filtered.map(course => (
            <div
              key={course.id}
              onClick={() => navigate("/courses/details", { state: course })}
              className="border p-4 rounded cursor-pointer"
            >
              <p className="font-semibold">{course.name}</p>
              <p className="text-sm">{course.code}</p>
              <p className="text-sm">{course.day} | {course.time}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}