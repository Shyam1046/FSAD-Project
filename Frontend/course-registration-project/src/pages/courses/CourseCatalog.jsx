import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../config";

export default function CourseCatalog() {
  const [search, setSearch] = useState("");
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();

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
          credits: c.credits
        }));
        setCourses(formatted);
      })
      .catch(err => console.error(err));
  }, []);

  const filtered = courses.filter(c =>
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
              <p className="text-sm">
                {course.instructor} • {course.duration} Credits
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}