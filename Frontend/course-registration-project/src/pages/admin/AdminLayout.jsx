import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard, BookOpen, Calendar, Users, Settings,
  LogOut, ChevronRight, Menu, X, Bell, Search,
  GraduationCap, AlertTriangle, BarChart2, Shield
} from 'lucide-react'

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
  { label: 'Manage Courses', icon: BookOpen, path: '/admin/courses' },
  { label: 'Manage Schedules', icon: Calendar, path: '/admin/schedules' },
  { label: 'Students', icon: Users, path: '/admin/students' },
  { label: 'Conflicts', icon: AlertTriangle, path: '/admin/conflicts' },
  { label: 'Analytics', icon: BarChart2, path: '/admin/analytics' },
  { label: 'Settings', icon: Settings, path: '/admin/settings' },
]

function SidebarContent({ location, onClose }) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-5 py-5 border-b border-blue-700/40">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-white font-bold text-sm leading-none">KLU ERP</p>
            <p className="text-blue-300 text-[10px] mt-0.5 font-medium">Admin Panel</p>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} className="text-blue-300 hover:text-white lg:hidden">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <div className="mx-4 mt-4 mb-2 p-3 bg-white/10 rounded-xl flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-300 to-indigo-400 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
          AD
        </div>
        <div className="min-w-0">
          <p className="text-white text-sm font-semibold truncate">Admin User</p>
          <p className="text-blue-300 text-[10px] flex items-center gap-1">
            <Shield className="w-2.5 h-2.5" /> Super Administrator
          </p>
        </div>
      </div>

      <nav className="flex-1 px-3 mt-2 space-y-0.5 overflow-y-auto">
        <p className="text-[10px] uppercase tracking-widest text-blue-400 font-semibold px-3 py-2">Main Menu</p>
        {navItems.map((item) => {
          const Icon = item.icon
          const active = location?.pathname === item.path
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group
                ${active ? 'bg-white text-blue-700 shadow-md' : 'text-blue-100 hover:bg-white/10 hover:text-white'}`}
            >
              <Icon className={`w-4 h-4 flex-shrink-0 ${active ? 'text-blue-600' : 'text-blue-300 group-hover:text-white'}`} />
              <span className="flex-1">{item.label}</span>
              {active && <ChevronRight className="w-3 h-3 text-blue-400" />}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-blue-700/40">
        <button className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-blue-200 hover:text-white hover:bg-white/10 rounded-xl transition-all">
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </div>
    </div>
  )
}

export default function AdminLayout({ children }) {
  const location = useLocation?.() || { pathname: '/admin' }
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const currentNav = navItems.find(n => n.path === location.pathname)
  const pageTitle = currentNav?.label || 'Dashboard'

  return (
    <div className="flex min-h-screen bg-slate-50">
      <aside
        className="hidden lg:flex flex-col w-60 flex-shrink-0 fixed inset-y-0 left-0 z-30"
        style={{ background: 'linear-gradient(160deg, #1d4ed8 0%, #1e40af 60%, #1e3a8a 100%)' }}
      >
        <SidebarContent location={location} />
      </aside>

      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <aside
            className="relative w-64 flex flex-col z-10"
            style={{ background: 'linear-gradient(160deg, #1d4ed8 0%, #1e40af 60%, #1e3a8a 100%)' }}
          >
            <SidebarContent location={location} onClose={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}

      <div className="flex-1 flex flex-col lg:ml-60">
        <header className={`sticky top-0 z-20 flex items-center justify-between h-16 px-4 md:px-6 bg-white transition-shadow duration-200 ${scrolled ? 'shadow-md' : 'border-b border-slate-100'}`}>
          <div className="flex items-center gap-3">
            <button onClick={() => setMobileOpen(true)} className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100">
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-sm font-bold text-slate-800">{pageTitle}</h2>
              <p className="text-[10px] text-slate-400 leading-none mt-0.5">KLU ERP Admin</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-2 bg-slate-100 rounded-xl px-3 py-2 w-52">
              <Search className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
              <input className="bg-transparent text-sm text-slate-700 placeholder-slate-400 outline-none flex-1" placeholder="Search..." />
            </div>
            <button className="relative p-2 rounded-xl text-slate-600 hover:bg-slate-100">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-1 ring-white" />
            </button>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold cursor-pointer">
              AD
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  )
}