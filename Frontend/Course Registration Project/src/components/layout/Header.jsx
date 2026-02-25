import React, { useState, useRef, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  Bell, Search, LogOut, User, Settings,
  ChevronDown, X, CheckCircle, AlertTriangle,
  Clock, BookOpen, Calendar
} from 'lucide-react'

const ROUTE_TITLES = {
  '/dashboard': 'Dashboard',
  '/courses': 'Course Catalog',
  '/courses/my': 'My Courses',
  '/courses/details': 'Course Details',
  '/schedule': 'My Schedule',
  '/schedule/builder': 'Schedule Builder',
  '/schedule/conflicts': 'Conflict Resolver',
  '/registration': 'Course Registration',
  '/registration/status': 'Registration Status',
  '/profile': 'Profile',
  '/settings': 'Settings',
  '/admin': 'Admin Dashboard',
  '/admin/courses': 'Manage Courses',
  '/admin/schedules': 'Manage Schedules',
}

const BREADCRUMBS = {
  '/courses/my': ['Courses', 'My Courses'],
  '/courses/details': ['Courses', 'Course Details'],
  '/schedule/builder': ['Schedule', 'Builder'],
  '/schedule/conflicts': ['Schedule', 'Conflict Resolver'],
  '/registration/status': ['Registration', 'Status'],
  '/admin/courses': ['Admin', 'Manage Courses'],
  '/admin/schedules': ['Admin', 'Manage Schedules'],
}

const notifications = [
  { id: 1, type: 'success', icon: CheckCircle, color: 'text-green-500', msg: 'Registered for Data Structures', time: '2 min ago', read: false },
  { id: 2, type: 'warn', icon: AlertTriangle, color: 'text-amber-500', msg: 'Schedule conflict in DBMS slot', time: '15 min ago', read: false },
  { id: 3, type: 'info', icon: BookOpen, color: 'text-blue-500', msg: 'New course ML Fundamentals added', time: '1 hr ago', read: true },
  { id: 4, type: 'info', icon: Calendar, color: 'text-indigo-500', msg: 'Registration deadline: Dec 15', time: '2 hrs ago', read: true },
]

export default function Header() {
  const navigate = useNavigate()
  const location = useLocation()
  const [showNotifs, setShowNotifs] = useState(false)
  const [showUser, setShowUser] = useState(false)
  const [search, setSearch] = useState('')
  const [notifList, setNotifList] = useState(notifications)
  const notifRef = useRef(null)
  const userRef = useRef(null)

  const title = ROUTE_TITLES[location.pathname] || 'KLU ERP'
  const crumbs = BREADCRUMBS[location.pathname]
  const unread = notifList.filter(n => !n.read).length
  const user = JSON.parse(localStorage.getItem('mockUser') || '{}')
  const name = user?.name || 'Student'
  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  const userType = localStorage.getItem('userType') || 'student'

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotifs(false)
      if (userRef.current && !userRef.current.contains(e.target)) setShowUser(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const markAllRead = () => setNotifList(n => n.map(x => ({ ...x, read: true })))
  const markRead = (id) => setNotifList(n => n.map(x => x.id === id ? { ...x, read: true } : x))

  const handleLogout = () => {
    localStorage.clear()
    navigate('/login')
  }

  return (
    <header className="sticky top-0 z-20 bg-white border-b border-slate-100 shadow-sm">
      <div className="flex items-center justify-between h-16 px-4 md:px-6 lg:pl-6">

        {/* Left: Title + Breadcrumb */}
        <div className="flex items-center gap-3 min-w-0 ml-12 lg:ml-0">
          <div className="min-w-0">
            {crumbs ? (
              <div className="flex items-center gap-1 text-xs text-slate-400 mb-0.5">
                {crumbs.map((c, i) => (
                  <React.Fragment key={i}>
                    {i > 0 && <span>/</span>}
                    <span className={i === crumbs.length - 1 ? 'text-blue-600 font-semibold' : 'font-medium'}>
                      {c}
                    </span>
                  </React.Fragment>
                ))}
              </div>
            ) : null}
            <h2 className="text-sm font-bold text-slate-800 truncate">{title}</h2>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 flex-shrink-0">

          {/* Search — desktop only */}
          <div className="hidden md:flex items-center gap-2 bg-slate-100 rounded-xl px-3 py-2 w-48 lg:w-56">
            <Search className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <input
              className="bg-transparent text-sm text-slate-700 placeholder-slate-400 outline-none flex-1 min-w-0"
              placeholder="Search…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            {search && (
              <button onClick={() => setSearch('')}>
                <X className="w-3 h-3 text-slate-400 hover:text-slate-600" />
              </button>
            )}
          </div>

          {/* Notifications */}
          <div ref={notifRef} className="relative">
            <button
              onClick={() => { setShowNotifs(s => !s); setShowUser(false) }}
              className="relative p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <Bell className="w-5 h-5" />
              {unread > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full text-[9px] font-bold text-white flex items-center justify-center">
                  {unread}
                </span>
              )}
            </button>

            {showNotifs && (
              <div className="absolute right-0 top-12 w-80 bg-white rounded-2xl border border-slate-100 shadow-2xl z-50 overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                  <h3 className="text-sm font-bold text-slate-800">Notifications</h3>
                  {unread > 0 && (
                    <button onClick={markAllRead} className="text-xs font-semibold text-blue-600 hover:underline">
                      Mark all read
                    </button>
                  )}
                </div>
                <div className="max-h-72 overflow-y-auto">
                  {notifList.map(n => {
                    const Icon = n.icon
                    return (
                      <div
                        key={n.id}
                        onClick={() => markRead(n.id)}
                        className={`flex items-start gap-3 px-4 py-3 hover:bg-slate-50 cursor-pointer transition-colors border-b border-slate-50 last:border-0
                          ${!n.read ? 'bg-blue-50/50' : ''}`}
                      >
                        <Icon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${n.color}`} />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-slate-700 font-medium leading-snug">{n.msg}</p>
                          <p className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1">
                            <Clock className="w-2.5 h-2.5" />{n.time}
                          </p>
                        </div>
                        {!n.read && <span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0 mt-1.5" />}
                      </div>
                    )
                  })}
                </div>
                <div className="px-4 py-2.5 border-t border-slate-100 bg-slate-50">
                  <button className="text-xs font-semibold text-blue-600 hover:underline w-full text-center">
                    View all notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User Menu */}
          <div ref={userRef} className="relative">
            <button
              onClick={() => { setShowUser(s => !s); setShowNotifs(false) }}
              className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-xl hover:bg-slate-100 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                {initials}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-xs font-bold text-slate-800 leading-none">{name}</p>
                <p className="text-[10px] text-slate-400 mt-0.5 capitalize">{userType}</p>
              </div>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform hidden md:block ${showUser ? 'rotate-180' : ''}`} />
            </button>

            {showUser && (
              <div className="absolute right-0 top-12 w-52 bg-white rounded-2xl border border-slate-100 shadow-2xl z-50 overflow-hidden">
                {/* User info */}
                <div className="px-4 py-3 border-b border-slate-100 bg-slate-50">
                  <p className="text-sm font-bold text-slate-800">{name}</p>
                  <p className="text-xs text-slate-400 capitalize mt-0.5">{userType} Account</p>
                </div>
                {/* Menu items */}
                {[
                  { icon: User, label: 'My Profile', path: '/profile' },
                  { icon: Settings, label: 'Settings', path: '/settings' },
                ].map((item, i) => {
                  const Icon = item.icon
                  return (
                    <button
                      key={i}
                      onClick={() => { navigate(item.path); setShowUser(false) }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      <Icon className="w-4 h-4 text-slate-400" />
                      {item.label}
                    </button>
                  )
                })}
                <div className="border-t border-slate-100">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}