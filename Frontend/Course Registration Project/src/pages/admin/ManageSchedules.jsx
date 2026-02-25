import React, { useState, useMemo } from 'react'
import {
  Calendar, Search, AlertTriangle, CheckCircle,
  Clock, X, Eye, Trash2, Download, ArrowUpDown, BookOpen
} from 'lucide-react'

const initialSchedules = [
  { id: 1, student: 'Arjun Mehta', studentId: 'KLU2021001', course: 'Data Structures', courseCode: 'CS201', time: 'Mon 9-11', dept: 'CSE', status: 'confirmed', conflict: false },
  { id: 2, student: 'Priya Sharma', studentId: 'KLU2021002', course: 'DBMS', courseCode: 'CS301', time: 'Tue 10-12', dept: 'CSE', status: 'confirmed', conflict: false },
  { id: 3, student: 'Rahul Kumar', studentId: 'KLU2021003', course: 'Computer Networks', courseCode: 'EC401', time: 'Mon 9-11', dept: 'ECE', status: 'pending', conflict: false },
  { id: 4, student: 'Sneha Patel', studentId: 'KLU2021004', course: 'Machine Learning', courseCode: 'CS501', time: 'Thu 14-16', dept: 'CSE', status: 'confirmed', conflict: false },
  { id: 5, student: 'Vikram Singh', studentId: 'KLU2021005', course: 'DBMS', courseCode: 'CS301', time: 'Tue 10-12', dept: 'CSE', status: 'conflict', conflict: true },
  { id: 6, student: 'Ananya Rao', studentId: 'KLU2021006', course: 'Operating Systems', courseCode: 'CS302', time: 'Fri 9-11', dept: 'CSE', status: 'confirmed', conflict: false },
  { id: 7, student: 'Karthik Reddy', studentId: 'KLU2021007', course: 'Data Structures', courseCode: 'CS201', time: 'Mon 9-11', dept: 'CSE', status: 'pending', conflict: false },
  { id: 8, student: 'Divya Nair', studentId: 'KLU2021008', course: 'Machine Learning', courseCode: 'CS501', time: 'Thu 14-16', dept: 'CSE', status: 'conflict', conflict: true },
]

const STATUS_CONFIG = {
  confirmed: { label: 'Confirmed', color: 'bg-green-100 text-green-700', dot: 'bg-green-500' },
  pending:   { label: 'Pending',   color: 'bg-amber-100 text-amber-700', dot: 'bg-amber-500' },
  conflict:  { label: 'Conflict',  color: 'bg-red-100 text-red-600',     dot: 'bg-red-500' },
}

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.pending
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${cfg.color}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  )
}

function DetailModal({ schedule, onClose, onResolve }) {
  if (!schedule) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md z-10 overflow-hidden">
        <div className={`px-6 py-4 flex items-center justify-between ${schedule.conflict ? 'bg-gradient-to-r from-red-500 to-orange-500' : 'bg-gradient-to-r from-blue-600 to-indigo-600'}`}>
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-white" />
            <h3 className="text-base font-bold text-white">Schedule Details</h3>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-6 space-y-4">
          {schedule.conflict && (
            <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl p-3">
              <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-red-700">Schedule Conflict Detected</p>
                <p className="text-xs text-red-500 mt-0.5">Overlapping class times. Please resolve before confirming.</p>
              </div>
            </div>
          )}
          {[
            { label: 'Student', value: schedule.student, sub: schedule.studentId },
            { label: 'Course', value: schedule.course, sub: schedule.courseCode },
            { label: 'Department', value: schedule.dept },
            { label: 'Time Slot', value: schedule.time },
            { label: 'Status', value: <StatusBadge status={schedule.status} /> },
          ].map((row, i) => (
            <div key={i} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{row.label}</span>
              <div className="text-right">
                <div className="text-sm font-semibold text-slate-800">{row.value}</div>
                {row.sub && <div className="text-xs text-slate-400">{row.sub}</div>}
              </div>
            </div>
          ))}
        </div>
        <div className="px-6 py-4 border-t border-slate-100 flex gap-3">
          <button onClick={onClose} className="flex-1 py-2 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50">Close</button>
          {schedule.conflict && (
            <button onClick={() => { onResolve(schedule.id); onClose() }}
              className="flex-1 py-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl text-sm font-semibold text-white hover:from-green-600">
              Resolve Conflict
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default function ManageSchedules() {
  const [schedules, setSchedules] = useState(initialSchedules)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [deptFilter, setDeptFilter] = useState('')
  const [selected, setSelected] = useState(null)
  const [sortBy, setSortBy] = useState('student')
  const [sortDir, setSortDir] = useState('asc')

  const toggleSort = (col) => {
    if (sortBy === col) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortBy(col); setSortDir('asc') }
  }

  const resolveConflict = (id) =>
    setSchedules(ss => ss.map(s => s.id === id ? { ...s, conflict: false, status: 'confirmed' } : s))

  const filtered = useMemo(() => {
    let res = schedules.filter(s =>
      (!search || s.student.toLowerCase().includes(search.toLowerCase()) ||
        s.course.toLowerCase().includes(search.toLowerCase()) ||
        s.studentId.toLowerCase().includes(search.toLowerCase())) &&
      (!statusFilter || s.status === statusFilter) &&
      (!deptFilter || s.dept === deptFilter)
    )
    res.sort((a, b) => {
      const av = (a[sortBy] || '').toString().toLowerCase()
      const bv = (b[sortBy] || '').toString().toLowerCase()
      return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av)
    })
    return res
  }, [schedules, search, statusFilter, deptFilter, sortBy, sortDir])

  const conflicts = schedules.filter(s => s.conflict)

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">Manage Schedules</h1>
          <p className="text-sm text-slate-400 mt-1">{schedules.length} total · {conflicts.length} conflicts pending</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 shadow-sm">
          <Download className="w-4 h-4" /> Export
        </button>
      </div>

      {conflicts.length > 0 && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-2xl p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-xl"><AlertTriangle className="w-5 h-5 text-red-500" /></div>
            <div>
              <p className="text-sm font-bold text-red-700">{conflicts.length} Conflict{conflicts.length > 1 ? 's' : ''} Detected</p>
              <p className="text-xs text-red-400 mt-0.5">{conflicts.map(c => c.student).join(', ')}</p>
            </div>
          </div>
          <button onClick={() => setStatusFilter('conflict')}
            className="flex-shrink-0 px-3 py-1.5 text-xs font-bold text-red-600 bg-red-100 hover:bg-red-200 rounded-lg">
            View Conflicts
          </button>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total', value: schedules.length, icon: Calendar, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
          { label: 'Confirmed', value: schedules.filter(s => s.status === 'confirmed').length, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-100' },
          { label: 'Pending', value: schedules.filter(s => s.status === 'pending').length, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100' },
          { label: 'Conflicts', value: conflicts.length, icon: AlertTriangle, color: 'text-red-500', bg: 'bg-red-50', border: 'border-red-100' },
        ].map((m, i) => {
          const Icon = m.icon
          return (
            <div key={i} className={`bg-white rounded-xl border ${m.border} shadow-sm p-4 flex items-center gap-3`}>
              <div className={`p-2 rounded-xl ${m.bg}`}><Icon className={`w-4 h-4 ${m.color}`} /></div>
              <div>
                <p className="text-xs text-slate-500 font-medium">{m.label}</p>
                <p className={`text-xl font-bold ${m.color}`}>{m.value}</p>
              </div>
            </div>
          )
        })}
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 mb-4 flex flex-wrap gap-3">
        <div className="flex-1 min-w-[180px] flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5">
          <Search className="w-4 h-4 text-slate-400" />
          <input className="flex-1 bg-transparent text-sm text-slate-700 placeholder-slate-400 outline-none"
            placeholder="Search student, course, ID…" value={search} onChange={e => setSearch(e.target.value)} />
          {search && <button onClick={() => setSearch('')}><X className="w-3.5 h-3.5 text-slate-400" /></button>}
        </div>
        <select className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-600 outline-none"
          value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="">All Status</option>
          <option value="confirmed">Confirmed</option>
          <option value="pending">Pending</option>
          <option value="conflict">Conflict</option>
        </select>
        <select className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-600 outline-none"
          value={deptFilter} onChange={e => setDeptFilter(e.target.value)}>
          <option value="">All Departments</option>
          {[...new Set(schedules.map(s => s.dept))].map(d => <option key={d}>{d}</option>)}
        </select>
        {(search || statusFilter || deptFilter) && (
          <button onClick={() => { setSearch(''); setStatusFilter(''); setDeptFilter('') }}
            className="flex items-center gap-1 px-3 py-2.5 text-sm text-slate-500 hover:text-slate-700 bg-slate-50 border border-slate-200 rounded-xl">
            <X className="w-3.5 h-3.5" /> Clear
          </button>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                {[
                  { label: 'Student', col: 'student' },
                  { label: 'Student ID', col: 'studentId' },
                  { label: 'Course', col: 'course' },
                  { label: 'Time Slot', col: 'time' },
                  { label: 'Dept', col: 'dept' },
                  { label: 'Status', col: 'status' },
                  { label: 'Actions', col: null },
                ].map(h => (
                  <th key={h.label} onClick={() => h.col && toggleSort(h.col)}
                    className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap cursor-pointer select-none">
                    {h.label}
                    {h.col && <ArrowUpDown className={`w-3 h-3 ml-1 inline ${sortBy === h.col ? 'text-blue-500' : 'opacity-30'}`} />}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-12 text-slate-400 text-sm">
                  <Calendar className="w-8 h-8 mx-auto mb-2 opacity-40" />No schedules found
                </td></tr>
              ) : filtered.map((s, i) => (
                <tr key={s.id} className={`border-b border-slate-50 hover:bg-blue-50/30 transition-colors ${s.conflict ? 'bg-red-50/40' : i % 2 !== 0 ? 'bg-slate-50/30' : ''}`}>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                        {s.student.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span className="text-sm font-semibold text-slate-800 whitespace-nowrap">{s.student}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5"><span className="text-xs font-mono text-slate-500">{s.studentId}</span></td>
                  <td className="px-4 py-3.5">
                    <p className="text-sm font-medium text-slate-700 whitespace-nowrap">{s.course}</p>
                    <p className="text-xs text-indigo-500 font-semibold">{s.courseCode}</p>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-1.5 text-sm text-slate-600">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />{s.time}
                    </div>
                  </td>
                  <td className="px-4 py-3.5"><span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-1 rounded-lg">{s.dept}</span></td>
                  <td className="px-4 py-3.5"><StatusBadge status={s.status} /></td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-1">
                      <button onClick={() => setSelected(s)} className="p-1.5 rounded-lg text-blue-500 hover:bg-blue-100 transition-colors" title="View"><Eye className="w-3.5 h-3.5" /></button>
                      {s.conflict && (
                        <button onClick={() => resolveConflict(s.id)} className="p-1.5 rounded-lg text-green-500 hover:bg-green-100 transition-colors" title="Resolve"><CheckCircle className="w-3.5 h-3.5" /></button>
                      )}
                      <button onClick={() => setSchedules(ss => ss.filter(x => x.id !== s.id))} className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 transition-colors" title="Remove"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length > 0 && (
          <div className="px-4 py-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
            <span>Showing {filtered.length} of {schedules.length} schedules</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-400" />{conflicts.length} conflicts need attention</span>
          </div>
        )}
      </div>

      <DetailModal schedule={selected} onClose={() => setSelected(null)} onResolve={resolveConflict} />
    </div>
  )
}