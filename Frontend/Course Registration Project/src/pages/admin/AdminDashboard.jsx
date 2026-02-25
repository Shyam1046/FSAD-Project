import React, { useState, useEffect, useRef } from 'react'
import {
  Users, BookOpen, Calendar, AlertTriangle, TrendingUp,
  TrendingDown, Bell, CheckCircle, Clock, ChevronRight,
  Activity, Award, BarChart2, RefreshCw
} from 'lucide-react'

function Sparkline({ data, color = '#3b82f6', height = 40 }) {
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1
  const w = 120, h = height
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w
    const y = h - ((v - min) / range) * h
    return `${x},${y}`
  }).join(' ')
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="overflow-visible">
      <defs>
        <linearGradient id={`g-${color.replace('#','')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polyline
        points={pts}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  )
}

function BarChart({ data, labels }) {
  const max = Math.max(...data)
  const [animated, setAnimated] = useState(false)
  useEffect(() => { setTimeout(() => setAnimated(true), 200) }, [])
  const colors = ['#3b82f6','#6366f1','#8b5cf6','#0ea5e9','#06b6d4','#10b981','#f59e0b']
  return (
    <div className="flex items-end gap-2 h-32 px-2">
      {data.map((v, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1">
          <span className="text-xs font-semibold text-blue-700">{v}</span>
          <div className="w-full rounded-t-md transition-all duration-700 ease-out"
            style={{
              height: animated ? `${(v / max) * 100}%` : '0%',
              background: colors[i % colors.length],
              minHeight: 4
            }} />
          <span className="text-[10px] text-slate-500 truncate w-full text-center">{labels[i]}</span>
        </div>
      ))}
    </div>
  )
}

function DonutChart({ segments }) {
  const size = 120, r = 45, cx = 60, cy = 60
  const circ = 2 * Math.PI * r
  const total = segments.reduce((a, b) => a + b.value, 0)
  let offset = 0
  const [animated, setAnimated] = useState(false)
  useEffect(() => { setTimeout(() => setAnimated(true), 300) }, [])
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {segments.map((seg, i) => {
        const dash = (seg.value / total) * circ
        const gap = circ - dash
        const el = (
          <circle
            key={i}
            cx={cx} cy={cy} r={r}
            fill="none"
            stroke={seg.color}
            strokeWidth="14"
            strokeDasharray={animated ? `${dash} ${gap}` : `0 ${circ}`}
            strokeDashoffset={-offset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dasharray 0.8s ease, stroke-dashoffset 0s' }}
            transform={`rotate(-90 ${cx} ${cy})`}
          />
        )
        offset += dash
        return el
      })}
      <text x={cx} y={cy + 5} textAnchor="middle" fontSize="13" fontWeight="700" fill="#1e40af">
        {total}
      </text>
    </svg>
  )
}

const stats = [
  {
    title: 'Total Students', value: 1240, change: '+8.2%', up: true, icon: Users,
    spark: [80,95,88,102,110,98,124], color: 'blue', light: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-100',
  },
  {
    title: 'Courses Offered', value: 86, change: '+3', up: true, icon: BookOpen,
    spark: [70,72,74,78,80,83,86], color: 'indigo', light: 'bg-indigo-50', text: 'text-indigo-600', border: 'border-indigo-100',
  },
  {
    title: 'Schedules Created', value: 312, change: '+12.4%', up: true, icon: Calendar,
    spark: [200,230,255,270,290,305,312], color: 'sky', light: 'bg-sky-50', text: 'text-sky-600', border: 'border-sky-100',
  },
  {
    title: 'Conflicts Detected', value: 27, change: '-5', up: false, icon: AlertTriangle,
    spark: [40,38,35,33,30,29,27], color: 'amber', light: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-100',
  },
]

const recentActivity = [
  { msg: 'Arjun Mehta registered for Algorithms', time: '2 min ago', icon: CheckCircle, color: 'text-green-500' },
  { msg: 'Schedule conflict: DBMS vs Networks (Priya S.)', time: '15 min ago', icon: AlertTriangle, color: 'text-amber-500' },
  { msg: 'New course "ML Fundamentals" added', time: '1 hr ago', icon: BookOpen, color: 'text-blue-500' },
  { msg: 'Rahul Kumar registered for DBMS', time: '2 hrs ago', icon: CheckCircle, color: 'text-green-500' },
  { msg: 'Batch schedule updated for CSE-3A', time: '3 hrs ago', icon: Calendar, color: 'text-indigo-500' },
]

const enrollmentData = [180, 210, 195, 240, 228, 265, 312]
const enrollmentLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul']

const courseDistribution = [
  { label: 'CSE', value: 32, color: '#3b82f6' },
  { label: 'ECE', value: 24, color: '#6366f1' },
  { label: 'MECH', value: 18, color: '#0ea5e9' },
  { label: 'CIVIL', value: 12, color: '#10b981' },
]

const topCourses = [
  { name: 'Data Structures & Algorithms', enrolled: 312, capacity: 350, dept: 'CSE' },
  { name: 'Database Management Systems', enrolled: 289, capacity: 300, dept: 'CSE' },
  { name: 'Computer Networks', enrolled: 245, capacity: 280, dept: 'ECE' },
  { name: 'Operating Systems', enrolled: 238, capacity: 260, dept: 'CSE' },
  { name: 'Machine Learning', enrolled: 210, capacity: 250, dept: 'CSE' },
]

export default function AdminDashboard() {
  const [counters, setCounters] = useState(stats.map(() => 0))
  const [refreshing, setRefreshing] = useState(false)
  const [greeting, setGreeting] = useState('')

  useEffect(() => {
    const h = new Date().getHours()
    setGreeting(h < 12 ? 'Good Morning' : h < 17 ? 'Good Afternoon' : 'Good Evening')
  }, [])

  useEffect(() => {
    stats.forEach((s, i) => {
      let start = 0
      const end = s.value
      const step = Math.ceil(end / 60)
      const timer = setInterval(() => {
        start = Math.min(start + step, end)
        setCounters(prev => prev.map((v, idx) => idx === i ? start : v))
        if (start >= end) clearInterval(timer)
      }, 20)
    })
  }, [])

  const handleRefresh = () => {
    setRefreshing(true)
    setTimeout(() => setRefreshing(false), 1200)
  }

  const sparkColor = (color) => ({
    blue: '#3b82f6', indigo: '#6366f1', sky: '#0ea5e9', amber: '#f59e0b'
  })[color] || '#3b82f6'

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <p className="text-sm text-slate-500 font-medium mb-0.5">{greeting}, Admin 👋</p>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">Dashboard Overview</h1>
          <p className="text-sm text-slate-400 mt-1">KLU ERP · Academic Year 2024–25</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={handleRefresh} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-100 rounded-xl hover:bg-blue-100 transition-all">
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} /> Refresh
          </button>
          <button className="relative p-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all shadow-sm">
            <Bell className="w-5 h-5 text-slate-600" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {stats.map((s, i) => {
          const Icon = s.icon
          return (
            <div key={i} className={`bg-white rounded-2xl border ${s.border} shadow-sm hover:shadow-md transition-all duration-300 p-5 flex flex-col gap-4`}>
              <div className="flex items-start justify-between">
                <div className={`p-2.5 rounded-xl ${s.light}`}>
                  <Icon className={`w-5 h-5 ${s.text}`} />
                </div>
                <span className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${s.up ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}>
                  {s.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {s.change}
                </span>
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wide mb-1">{s.title}</p>
                <p className="text-3xl font-bold text-slate-800 tabular-nums">{counters[i].toLocaleString()}</p>
              </div>
              <Sparkline data={s.spark} color={sparkColor(s.color)} />
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-base font-bold text-slate-800">Monthly Enrollments</h2>
              <p className="text-xs text-slate-400 mt-0.5">Students enrolled per month</p>
            </div>
            <span className="flex items-center gap-1 text-xs font-semibold text-green-600 bg-green-50 px-2.5 py-1 rounded-full">
              <TrendingUp className="w-3 h-3" /> +18% vs last year
            </span>
          </div>
          <BarChart data={enrollmentData} labels={enrollmentLabels} />
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <div className="mb-4">
            <h2 className="text-base font-bold text-slate-800">Course Distribution</h2>
            <p className="text-xs text-slate-400 mt-0.5">By department</p>
          </div>
          <div className="flex flex-col items-center gap-4">
            <DonutChart segments={courseDistribution} />
            <div className="w-full space-y-2">
              {courseDistribution.map((seg, i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ background: seg.color }} />
                    <span className="text-slate-600 font-medium">{seg.label}</span>
                  </div>
                  <span className="font-bold text-slate-800">{seg.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-base font-bold text-slate-800">Top Courses by Enrollment</h2>
              <p className="text-xs text-slate-400 mt-0.5">Capacity utilization</p>
            </div>
            <button className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:underline">
              View all <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          <div className="space-y-4">
            {topCourses.map((c, i) => {
              const pct = Math.round((c.enrolled / c.capacity) * 100)
              return (
                <div key={i}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold flex items-center justify-center">{i + 1}</span>
                      <span className="text-sm font-medium text-slate-700 truncate max-w-[200px]">{c.name}</span>
                      <span className="hidden sm:inline text-[10px] text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded font-medium">{c.dept}</span>
                    </div>
                    <span className="text-xs text-slate-500">{c.enrolled}/{c.capacity}</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${pct}%`, background: pct > 90 ? '#f59e0b' : '#3b82f6' }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-bold text-slate-800">Recent Activity</h2>
            <Activity className="w-4 h-4 text-slate-400" />
          </div>
          <div className="space-y-4">
            {recentActivity.map((a, i) => {
              const Icon = a.icon
              return (
                <div key={i} className="flex items-start gap-3">
                  <Icon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${a.color}`} />
                  <div>
                    <p className="text-xs text-slate-700 font-medium leading-snug">{a.msg}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {a.time}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
          <button className="mt-5 w-full text-center text-xs font-semibold text-blue-600 hover:underline flex items-center justify-center gap-1">
            View all activity <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      <div className="mt-6 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-white">
          <p className="text-sm font-medium opacity-80">Academic Performance</p>
          <h3 className="text-xl font-bold mt-0.5">Semester is 68% complete</h3>
          <p className="text-sm opacity-70 mt-1">14 weeks remaining · Exams start March 15</p>
        </div>
        <div className="flex items-center gap-6">
          {[{ label: 'Avg Attendance', value: '84%' }, { label: 'Pass Rate', value: '91%' }, { label: 'Pending Approvals', value: '7' }].map((m, i) => (
            <div key={i} className="text-center">
              <p className="text-2xl font-bold text-white">{m.value}</p>
              <p className="text-xs text-blue-200 font-medium">{m.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}