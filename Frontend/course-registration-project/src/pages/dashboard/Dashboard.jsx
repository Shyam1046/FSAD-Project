import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../config";

export default function Dashboard() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    fetch(`${BASE_URL}/courses`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    })
      .then(res => res.json())
      .then(data => setCourses(data))
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    const h = new Date().getHours();
    setGreeting(h < 12 ? "Good Morning" : h < 17 ? "Good Afternoon" : "Good Evening");
  }, []);

  const totalCourses = courses.length;
  const totalDuration = courses.reduce((sum, c) => sum + (c.duration || 0), 0);

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">
          {greeting}, Student 👋
        </h1>
        <p className="text-sm text-slate-500">Course Dashboard</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl shadow">
          <p className="text-sm text-gray-500">Total Courses</p>
          <p className="text-2xl font-bold">{totalCourses}</p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow">
          <p className="text-sm text-gray-500">Total Duration</p>
          <p className="text-2xl font-bold">{totalDuration} hrs</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Available Courses</h2>
          <button onClick={() => navigate("/courses")} className="text-blue-600 text-sm">
            View All →
          </button>
        </div>

        <div className="space-y-3">
          {courses.slice(0, 5).map(course => (
            <div key={course.id} className="border p-3 rounded flex justify-between">
              <div>
                <p className="font-semibold">{course.name}</p>
                <p className="text-sm text-gray-500">{course.instructor}</p>
              </div>
              <p className="text-sm text-gray-600">{course.duration} hrs</p>
            </div>
          ))}

          {courses.length === 0 && (
            <p className="text-gray-500 text-sm">No courses available</p>
          )}
        </div>
      </div>
    </div>
  );
}