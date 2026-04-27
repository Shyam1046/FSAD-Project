import React, { useState, useEffect } from "react";
import { BASE_URL } from "../../config";

export default function ManageCourses() {
  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState({
    name: "",
    instructor: "",
    duration: ""
  });

  const fetchCourses = () => {
    fetch(`${BASE_URL}/courses`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    })
      .then(res => res.json())
      .then(data => setCourses(data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    await fetch(`${BASE_URL}/courses`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify({
        name: form.name,
        instructor: form.instructor,
        duration: parseInt(form.duration)
      })
    });

    setForm({ name: "", instructor: "", duration: "" });
    fetchCourses();
  };

  const handleDelete = async (id) => {
    await fetch(`${BASE_URL}/courses/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    });

    fetchCourses();
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="bg-white p-6 rounded-xl shadow space-y-6">

        <h1 className="text-2xl font-bold">Manage Courses</h1>

        <form onSubmit={handleSubmit} className="grid md:grid-cols-3 gap-4">
          <input
            placeholder="Course Name"
            className="border p-2 rounded"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />

          <input
            placeholder="Instructor"
            className="border p-2 rounded"
            value={form.instructor}
            onChange={(e) => setForm({ ...form, instructor: e.target.value })}
            required
          />

          <input
            placeholder="Duration"
            type="number"
            className="border p-2 rounded"
            value={form.duration}
            onChange={(e) => setForm({ ...form, duration: e.target.value })}
            required
          />

          <button className="bg-blue-600 text-white px-4 py-2 rounded col-span-3">
            Add Course
          </button>
        </form>

        <div className="space-y-3">
          {courses.map(course => (
            <div key={course.id} className="flex justify-between items-center border p-3 rounded">
              <div>
                <p className="font-semibold">{course.name}</p>
                <p className="text-sm text-gray-500">
                  {course.instructor} • {course.duration} hrs
                </p>
              </div>

              <button
                onClick={() => handleDelete(course.id)}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Delete
              </button>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}