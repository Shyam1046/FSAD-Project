import React, { useState, useMemo } from 'react'
import {
  Plus, Trash2, Pencil, Search, BookOpen, X,
  CheckCircle, AlertCircle, Filter, Save, Clock
} from 'lucide-react'

const DEPARTMENTS = ['CSE', 'ECE', 'MECH', 'CIVIL', 'MBA', 'EEE']
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const TIMES = ['8:00-9:00', '9:00-10:00', '10:00-11:00', '11:00-12:00',
               '12:00-13:00', '13:00-14:00', '14:00-15:00', '15:00-16:00']

const initialCourses = [
  { id: 1, name: 'Data Structures', code: 'CS201', dept: 'CSE', slots: 'Mon 9-11', credits: 4, capacity: 60, enrolled: 54, status: 'active' },
  { id: 2, name: 'Database Management', code: 'CS301', dept: 'CSE', slots: 'Tue 10-12', credits: 3, capacity: 50, enrolled: 48, status: 'active' },
  { id: 3, name: 'Computer Networks', code: 'EC401', dept: 'ECE', slots: 'Wed 11-13', credits: 4, capacity: 45, enrolled: 40, status: 'active' },
  { id: 4, name: 'Machine Learning', code: 'CS501', dept: 'CSE', slots: 'Thu 14-16', credits: 4, capacity: 55, enrolled: 50, status: 'active' },
  { id: 5, name: 'Operating Systems', code: 'CS302', dept: 'CSE', slots: 'Fri 9-11', credits: 3, capacity: 50, enrolled: 45, status: 'active' },
]

const emptyForm = { name: '', code: '', dept: '', slots: '', credits: 3, capacity: 60, status: 'active' }

function validate(form) {
  const errs = {}
  if (!form.name.trim()) errs.name = 'Course name is required'
  else if (form.name.length < 3) errs.name = 'Must be at least 3 characters'
  if (!form.code.trim()) errs.code = 'Course code is required'
  else if (!/^[A-Z]{2,4}\d{3}$/.test(form.code)) errs.code = 'Format: CS201'
  if (!form.dept) errs.dept = 'Department is required'
  if (!form.slots.trim()) errs.slots = 'Time slot is required'
  if (form.credits < 1 || form.credits > 6) errs.credits = '1–6 credits'
  if (form.capacity < 10 || form.capacity > 200) errs.capacity = '10–200 students'
  return errs
}

function Toast({ msg, type, onClose }) {
  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 ${type === 'success' ? 'bg-green-500' : 'bg-red-500'} text-white rounded-2xl shadow-xl`}>
      {type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
      <span className="text-sm font-medium">{msg}</span>
      <button onClick={onClose}><X className="w-4 h-4" /></button>
    </div>
  )
}

function CourseModal({ open, onClose, onSave, editData }) {
  const [form, setForm] = useState(editData || emptyForm)
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})

  React.useEffect(() => {
    setForm(editData || emptyForm)
    setErrors({})
    setTouched({})
  }, [editData, open])

  const set = (field, val) => {
    const next = { ...form, [field]: val }
    setForm(next)
    if (touched[field]) setErrors(validate(next))
  }

  const blur = (field) => {
    setTouched(t => ({ ...t, [field]: true }))
    setErrors(validate(form))
  }

  const submit = () => {
    setTouched({ name: true, code: true, dept: true, slots: true, credits: true, capacity: true })
    const errs = validate(form)
    setErrors(errs)
    if (Object.keys(errs).length) return
    onSave(form)
  }

  if (!open) return null

  const fieldClass = (key) =>
    `w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 transition-all ${errors[key] && touched[key] ? 'border-red-400 focus:ring-red-200' : 'border-slate-200 focus:ring-blue-200 focus:border-blue-400'}`

  const ErrMsg = ({ k }) => errors[k] && touched[k]
    ? <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors[k]}</p>
    : null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg z-10 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-1.5 bg-white/20 rounded-lg"><BookOpen className="w-4 h-4 text-white" /></div>
            <h3 className="text-base font-bold text-white">{editData ? 'Edit Course' : 'Add New Course'}</h3>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white"><X className="w-5 h-5" /></button>
        </div>

        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Course Name</label>
              <input className={fieldClass('name')} placeholder="e.g. Data Structures" value={form.name}
                onChange={e => set('name', e.target.value)} onBlur={() => blur('name')} />
              <ErrMsg k="name" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Course Code</label>
              <input className={fieldClass('code')} placeholder="e.g. CS201" value={form.code}
                onChange={e => set('code', e.target.value)} onBlur={() => blur('code')} />
              <ErrMsg k="code" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Department</label>
            <select className={fieldClass('dept')} value={form.dept}
              onChange={e => set('dept', e.target.value)} onBlur={() => blur('dept')}>
              <option value="">Select department</option>
              {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
            </select>
            <ErrMsg k="dept" />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Time Slot</label>
            <div className="grid grid-cols-2 gap-2">
              <select className="border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 bg-white"
                value={form.slots.split(' ')[0] || ''}
                onChange={e => set('slots', `${e.target.value} ${form.slots.split(' ')[1] || ''}`)}>
                <option value="">Day</option>
                {DAYS.map(d => <option key={d}>{d}</option>)}
              </select>
              <select className="border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 bg-white"
                value={form.slots.split(' ')[1] || ''}
                onChange={e => set('slots', `${form.slots.split(' ')[0] || ''} ${e.target.value}`)}>
                <option value="">Time</option>
                {TIMES.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <ErrMsg k="slots" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Credits</label>
              <input type="number" min={1} max={6} className={fieldClass('credits')} value={form.credits}
                onChange={e => set('credits', Number(e.target.value))} onBlur={() => blur('credits')} />
              <ErrMsg k="credits" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Capacity</label>
              <input type="number" min={10} max={200} className={fieldClass('capacity')} value={form.capacity}
                onChange={e => set('capacity', Number(e.target.value))} onBlur={() => blur('capacity')} />
              <ErrMsg k="capacity" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Status</label>
            <div className="flex gap-3">
              {['active', 'inactive'].map(s => (
                <button key={s} onClick={() => set('status', s)}
                  className={`flex-1 py-2 rounded-xl text-sm font-semibold border transition-all capitalize
                    ${form.status === s ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-200 text-slate-500 hover:border-blue-300'}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-sm font-semibold text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50">Cancel</button>
          <button onClick={submit} className="flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl hover:from-blue-700 hover:to-indigo-700 shadow-md shadow-blue-200">
            <Save className="w-4 h-4" /> {editData ? 'Save Changes' : 'Add Course'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function ManageCourses() {
  const [courses, setCourses] = useState(initialCourses)
  const [modal, setModal] = useState(false)
  const [editData, setEditData] = useState(null)
  const [search, setSearch] = useState('')
  const [deptFilter, setDeptFilter] = useState('')
  const [toast, setToast] = useState(null)
  const [deleteId, setDeleteId] = useState(null)

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  const saveCourse = (form) => {
    if (editData) {
      setCourses(cs => cs.map(c => c.id === editData.id ? { ...c, ...form } : c))
      showToast('Course updated successfully!')
    } else {
      setCourses(cs => [...cs, { ...form, id: Date.now(), enrolled: 0 }])
      showToast('Course added successfully!')
    }
    setModal(false)
  }

  const filtered = useMemo(() =>
    courses.filter(c =>
      (!search || c.name.toLowerCase().includes(search.toLowerCase()) || c.code.toLowerCase().includes(search.toLowerCase())) &&
      (!deptFilter || c.dept === deptFilter)
    ), [courses, search, deptFilter])

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">Manage Courses</h1>
          <p className="text-sm text-slate-400 mt-1">{courses.length} courses total</p>
        </div>
        <button onClick={() => { setEditData(null); setModal(true) }}
          className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl hover:from-blue-700 hover:to-indigo-700 shadow-md shadow-blue-200 transition-all">
          <Plus className="w-4 h-4" /> Add Course
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Courses', value: courses.length, color: 'text-blue-600' },
          { label: 'Active', value: courses.filter(c => c.status === 'active').length, color: 'text-green-600' },
          { label: 'Total Capacity', value: courses.reduce((a, c) => a + c.capacity, 0), color: 'text-indigo-600' },
          { label: 'Total Enrolled', value: courses.reduce((a, c) => a + (c.enrolled || 0), 0), color: 'text-sky-600' },
        ].map((m, i) => (
          <div key={i} className="bg-white rounded-xl border border-slate-100 shadow-sm p-4">
            <p className="text-xs text-slate-500 font-medium">{m.label}</p>
            <p className={`text-2xl font-bold mt-1 ${m.color}`}>{m.value.toLocaleString()}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 mb-4 flex flex-col sm:flex-row gap-3">
        <div className="flex-1 flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5">
          <Search className="w-4 h-4 text-slate-400" />
          <input className="flex-1 bg-transparent text-sm text-slate-700 placeholder-slate-400 outline-none"
            placeholder="Search by name or code…" value={search} onChange={e => setSearch(e.target.value)} />
          {search && <button onClick={() => setSearch('')}><X className="w-3.5 h-3.5 text-slate-400" /></button>}
        </div>
        <select className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-600 outline-none"
          value={deptFilter} onChange={e => setDeptFilter(e.target.value)}>
          <option value="">All Departments</option>
          {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
        </select>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                {['Course', 'Code', 'Dept', 'Slot', 'Credits', 'Enrollment', 'Status', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={8} className="text-center py-12 text-slate-400 text-sm">
                  <BookOpen className="w-8 h-8 mx-auto mb-2 opacity-40" />No courses found
                </td></tr>
              ) : filtered.map((c, i) => {
                const pct = c.enrolled ? Math.round((c.enrolled / c.capacity) * 100) : 0
                return (
                  <tr key={c.id} className={`border-b border-slate-50 hover:bg-blue-50/40 transition-colors ${i % 2 !== 0 ? 'bg-slate-50/30' : ''}`}>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                          <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                        </div>
                        <span className="text-sm font-semibold text-slate-800 whitespace-nowrap">{c.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5"><span className="text-xs font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg">{c.code}</span></td>
                    <td className="px-4 py-3.5"><span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-1 rounded-lg">{c.dept}</span></td>
                    <td className="px-4 py-3.5"><div className="flex items-center gap-1 text-sm text-slate-600"><Clock className="w-3 h-3 text-slate-400" />{c.slots}</div></td>
                    <td className="px-4 py-3.5 text-sm font-medium text-slate-700">{c.credits} cr</td>
                    <td className="px-4 py-3.5 min-w-[140px]">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: pct > 90 ? '#f59e0b' : '#3b82f6' }} />
                        </div>
                        <span className="text-xs text-slate-500 whitespace-nowrap">{c.enrolled || 0}/{c.capacity}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${c.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1">
                        <button onClick={() => { setEditData(c); setModal(true) }} className="p-1.5 rounded-lg text-blue-500 hover:bg-blue-100 transition-colors"><Pencil className="w-3.5 h-3.5" /></button>
                        <button onClick={() => setDeleteId(c.id)} className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        {filtered.length > 0 && (
          <div className="px-4 py-3 border-t border-slate-100 bg-slate-50 text-xs text-slate-500">
            Showing {filtered.length} of {courses.length} courses
          </div>
        )}
      </div>

      <CourseModal open={modal} onClose={() => setModal(false)} onSave={saveCourse} editData={editData} />

      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setDeleteId(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full z-10 text-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-5 h-5 text-red-500" />
            </div>
            <h3 className="text-base font-bold text-slate-800 mb-1">Delete Course?</h3>
            <p className="text-sm text-slate-500 mb-5">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 py-2 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50">Cancel</button>
              <button onClick={() => { setCourses(cs => cs.filter(c => c.id !== deleteId)); setDeleteId(null); showToast('Course removed.', 'error') }}
                className="flex-1 py-2 bg-red-500 rounded-xl text-sm font-semibold text-white hover:bg-red-600">Delete</button>
            </div>
          </div>
        </div>
      )}

      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}