import React, { useState, useEffect } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, BookOpen, BookMarked, GraduationCap,
  Calendar, ClipboardList, UserCheck, TrendingUp, AlertTriangle,
  ChevronLeft, ChevronRight, ChevronDown, GraduationCap as KLUIcon,
  Settings, User, LogOut, Shield, Menu, X
} from 'lucide-react'

const studentLinks = [
  {
    label: 'Dashboard',
    to: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    label: 'Courses',
    icon: BookOpen,
    to: '/courses',
    subtopics: [
      { to: '/courses', label: 'Course Catalog', icon: BookMarked },
      { to: '/courses/my', label: 'My Courses', icon: GraduationCap },
    ],
  },
  {
    label: 'Schedule',
    icon: Calendar,
    to: '/schedule',
    subtopics: [
      { to: '/schedule', label: 'My Schedule', icon: Calendar },
      { to: '/schedule/builder', label: 'Schedule Builder', icon: ClipboardList },
      { to: '/schedule/conflicts', label: 'Conflict Resolver', icon: AlertTriangle },
    ],
  },
  {
    label: 'Registration',
    icon: ClipboardList,
    to: '/registration',
    subtopics: [
      { to: '/registration', label: 'Enroll Courses', icon: UserCheck },
      { to: '/registration/status', label: 'Registration Status', icon: TrendingUp },
    ],
  },
  {
    label: 'Profile',
    to: '/profile',
    icon: User,
  },
  {
    label: 'Settings',
    to: '/settings',
    icon: Settings,
  },
]

function SidebarNav({ open, onClose }) {
  const location = useLocation()
  const navigate = useNavigate()
  const [expanded, setExpanded] = useState({})
  const userType = localStorage.getItem('userType') || 'student'
  const user = JSON.parse(localStorage.getItem('mockUser') || '{}')
  const name = user?.name || (userType === 'admin' ? 'Admin User' : 'Student')
  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)

  // Auto-expand active parent on route change
  useEffect(() => {
    studentLinks.forEach(link => {
      if (link.subtopics) {
        const isChildActive = link.subtopics.some(s => location.pathname === s.to)
        const isParentActive = location.pathname === link.to
        if (isChildActive || isParentActive) {
          setExpanded(prev => ({ ...prev, [link.to]: true }))
        }
      }
    })
  }, [location.pathname])

  const toggleExpand = (to, e) => {
    e.preventDefault()
    e.stopPropagation()
    setExpanded(prev => ({ ...prev, [to]: !prev[to] }))
  }

  const isParentActive = (link) => {
    if (!link.subtopics) return location.pathname === link.to
    return location.pathname === link.to ||
      link.subtopics.some(s => location.pathname === s.to)
  }

  const handleLogout = () => {
    localStorage.clear()
    navigate('/login')
  }

  return (
    <div className="flex flex-col h-full">

      {/* Logo */}
      <div className="flex items-center justify-between px-5 py-5 border-b border-blue-700/40 flex-shrink-0">
        {open && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
              <KLUIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-white font-bold text-sm leading-none">KLU ERP</p>
              <p className="text-blue-300 text-[10px] mt-0.5 font-medium capitalize">{userType} Portal</p>
            </div>
          </div>
        )}
        {!open && (
          <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center mx-auto">
            <KLUIcon className="w-5 h-5 text-white" />
          </div>
        )}
        {onClose && (
          <button onClick={onClose} className="text-blue-300 hover:text-white lg:hidden ml-auto">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* User badge */}
      {open && (
        <div className="mx-4 mt-4 p-3 bg-white/10 rounded-xl flex items-center gap-3 flex-shrink-0">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-300 to-indigo-400 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
            {initials}
          </div>
          <div className="min-w-0">
            <p className="text-white text-sm font-semibold truncate">{name}</p>
            <p className="text-blue-300 text-[10px] flex items-center gap-1 capitalize">
              <Shield className="w-2.5 h-2.5" /> {userType}
            </p>
          </div>
        </div>
      )}
      {!open && (
        <div className="flex justify-center mt-4 flex-shrink-0">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-300 to-indigo-400 flex items-center justify-center text-white font-bold text-sm">
            {initials}
          </div>
        </div>
      )}

      {/* Nav label */}
      {open && (
        <p className="text-[10px] uppercase tracking-widest text-blue-400 font-semibold px-5 pt-4 pb-1 flex-shrink-0">
          Navigation
        </p>
      )}

      {/* Links */}
      <nav className="flex-1 px-3 mt-1 space-y-0.5 overflow-y-auto">
        {studentLinks.map(link => {
          const Icon = link.icon
          const active = isParentActive(link)
          const isExpanded = expanded[link.to]
          const hasChildren = !!link.subtopics

          return (
            <div key={link.to}>
              {/* Parent item */}
              <div className="flex items-center group">
                <NavLink
                  to={hasChildren ? '#' : link.to}
                  onClick={hasChildren
                    ? (e) => toggleExpand(link.to, e)
                    : () => onClose?.()
                  }
                  className={`flex-1 flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
                    ${active
                      ? 'bg-white text-blue-700 shadow-md'
                      : 'text-blue-100 hover:bg-white/10 hover:text-white'
                    }
                    ${!open ? 'justify-center' : ''}`}
                  title={!open ? link.label : undefined}
                >
                  <Icon className={`w-4 h-4 flex-shrink-0 ${active ? 'text-blue-600' : 'text-blue-300 group-hover:text-white'}`} />
                  {open && (
                    <>
                      <span className="flex-1">{link.label}</span>
                      {hasChildren && (
                        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 flex-shrink-0
                          ${active ? 'text-blue-400' : 'text-blue-400/60'}
                          ${isExpanded ? 'rotate-180' : ''}`}
                        />
                      )}
                    </>
                  )}
                </NavLink>
              </div>

              {/* Subtopics */}
              {hasChildren && open && isExpanded && (
                <div className="ml-4 mt-0.5 space-y-0.5 border-l-2 border-blue-700/30 pl-3">
                  {link.subtopics.map(sub => {
                    const SubIcon = sub.icon
                    const subActive = location.pathname === sub.to
                    return (
                      <NavLink
                        key={`${sub.to}-${sub.label}`}
                        to={sub.to}
                        onClick={() => onClose?.()}
                        className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all duration-200
                          ${subActive
                            ? 'bg-white/20 text-white'
                            : 'text-blue-200 hover:bg-white/10 hover:text-white'
                          }`}
                      >
                        <SubIcon className={`w-3.5 h-3.5 flex-shrink-0 ${subActive ? 'text-white' : 'text-blue-300'}`} />
                        {sub.label}
                        {subActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white" />}
                      </NavLink>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-blue-700/40 flex-shrink-0">
        <button
          onClick={handleLogout}
          className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-blue-200 hover:text-white hover:bg-white/10 rounded-xl transition-all
            ${!open ? 'justify-center' : ''}`}
          title={!open ? 'Sign Out' : undefined}
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          {open && 'Sign Out'}
        </button>
      </div>
    </div>
  )
}

export default function Sidebar() {
  const [open, setOpen] = useState(true)
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      {/* ── Desktop Sidebar ── */}
      <aside
        className={`hidden lg:flex flex-col flex-shrink-0 h-screen sticky top-0 transition-all duration-300 z-30
          ${open ? 'w-60' : 'w-[72px]'}`}
        style={{ background: 'linear-gradient(160deg, #1d4ed8 0%, #1e40af 60%, #1e3a8a 100%)' }}
      >
        {/* Collapse toggle */}
        <button
          onClick={() => setOpen(o => !o)}
          className="absolute -right-3 top-20 z-50 w-6 h-6 bg-white border border-slate-200 rounded-full flex items-center justify-center shadow-md hover:bg-blue-50 transition-colors"
        >
          {open
            ? <ChevronLeft className="w-3.5 h-3.5 text-blue-600" />
            : <ChevronRight className="w-3.5 h-3.5 text-blue-600" />
          }
        </button>
        <SidebarNav open={open} />
      </aside>

      {/* ── Mobile Hamburger Button ── */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 w-10 h-10 bg-blue-700 text-white rounded-xl flex items-center justify-center shadow-lg"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* ── Mobile Drawer ── */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <aside
            className="relative w-64 flex flex-col z-10 h-full"
            style={{ background: 'linear-gradient(160deg, #1d4ed8 0%, #1e40af 60%, #1e3a8a 100%)' }}
          >
            <SidebarNav open={true} onClose={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}
    </>
  )
}