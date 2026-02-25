import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import AdminLayout from "./pages/admin/AdminLayout";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import Dashboard from "./pages/dashboard/Dashboard";
import CourseCatalog from "./pages/courses/CourseCatalog";
import CourseDetails from "./pages/courses/CourseDetails";
import MyCourses from "./pages/courses/MyCourses";
import ScheduleBuilder from "./pages/schedule/ScheduleBuilder";
import MySchedule from "./pages/schedule/MySchedule";
import ConflictResolver from "./pages/schedule/ConflictResolver";
import Registration from "./pages/registration/Registration";
import RegistrationStatus from "./pages/registration/RegistrationStatus";
import Profile from "./pages/common/Profile";
import Settings from "./pages/common/Settings";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageCourses from "./pages/admin/ManageCourses";
import ManageSchedules from "./pages/admin/ManageSchedules";

function ProtectedRoute({ children }) {
  const loggedIn = localStorage.getItem("loggedIn") === "true";
  return loggedIn ? children : <Navigate to="/login" replace />;
}

function AdminRoute({ children }) {
  const loggedIn = localStorage.getItem("loggedIn") === "true";
  const userType = localStorage.getItem("userType");
  if (!loggedIn) return <Navigate to="/login" replace />;
  if (userType !== "admin") return <Navigate to="/dashboard" replace />;
  return children;
}

function RoleBasedRedirect() {
  const userType = localStorage.getItem("userType");
  return userType === "admin"
    ? <Navigate to="/admin" replace />
    : <Navigate to="/dashboard" replace />;
}

// 404 Page
function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
      <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-6">
        <span className="text-3xl font-black text-blue-600">404</span>
      </div>
      <h1 className="text-2xl font-bold text-slate-800 mb-2">Page Not Found</h1>
      <p className="text-sm text-slate-400 mb-6">The page you're looking for doesn't exist or has been moved.</p>
      <a href="/dashboard"
        className="px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-md shadow-blue-200 hover:from-blue-700 hover:to-indigo-700 transition-all">
        Go to Dashboard
      </a>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/redirect" element={<RoleBasedRedirect />} />

      {/* Student Routes — wrapped in MainLayout */}
      <Route path="/dashboard" element={
        <ProtectedRoute><MainLayout><Dashboard /></MainLayout></ProtectedRoute>
      } />
      <Route path="/courses" element={
        <ProtectedRoute><MainLayout><CourseCatalog /></MainLayout></ProtectedRoute>
      } />
      <Route path="/courses/details" element={
        <ProtectedRoute><MainLayout><CourseDetails /></MainLayout></ProtectedRoute>
      } />
      <Route path="/courses/my" element={
        <ProtectedRoute><MainLayout><MyCourses /></MainLayout></ProtectedRoute>
      } />
      <Route path="/courses/mine" element={
        <ProtectedRoute><MainLayout><MyCourses /></MainLayout></ProtectedRoute>
      } />
      <Route path="/schedule" element={
        <ProtectedRoute><MainLayout><MySchedule /></MainLayout></ProtectedRoute>
      } />
      <Route path="/schedule/builder" element={
        <ProtectedRoute><MainLayout><ScheduleBuilder /></MainLayout></ProtectedRoute>
      } />
      <Route path="/schedule/conflicts" element={
        <ProtectedRoute><MainLayout><ConflictResolver /></MainLayout></ProtectedRoute>
      } />
      <Route path="/registration" element={
        <ProtectedRoute><MainLayout><Registration /></MainLayout></ProtectedRoute>
      } />
      <Route path="/registration/status" element={
        <ProtectedRoute><MainLayout><RegistrationStatus /></MainLayout></ProtectedRoute>
      } />
      <Route path="/profile" element={
        <ProtectedRoute><MainLayout><Profile /></MainLayout></ProtectedRoute>
      } />
      <Route path="/settings" element={
        <ProtectedRoute><MainLayout><Settings /></MainLayout></ProtectedRoute>
      } />

      {/* Admin Routes — wrapped in AdminLayout */}
      <Route path="/admin" element={
        <AdminRoute><AdminLayout><AdminDashboard /></AdminLayout></AdminRoute>
      } />
      <Route path="/admin/courses" element={
        <AdminRoute><AdminLayout><ManageCourses /></AdminLayout></AdminRoute>
      } />
      <Route path="/admin/schedules" element={
        <AdminRoute><AdminLayout><ManageSchedules /></AdminLayout></AdminRoute>
      } />

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}