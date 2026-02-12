import React, { useEffect, useMemo, useState } from 'react'
import { Users, CalendarCheck2, Briefcase, FileSpreadsheet, Plus, Search, Trash2, Edit, Download } from 'lucide-react'

const API = 'http://localhost:8080/api/employees'

function currencyINR(v) {
  try {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(v || 0)
  } catch { return v }
}

function Stat({ title, value, Icon, hint }) {
  return (
    <div className="rounded-2xl bg-white shadow-sm border p-4">
      <div className="flex items-center justify-between text-sm text-slate-500">
        <span>{title}</span>
        <Icon size={18} />
      </div>
      <div className="text-2xl font-semibold mt-1">{value}</div>
      {hint && <div className="text-xs text-slate-500 mt-1">{hint}</div>}
    </div>
  )
}

export default function App() {
  const [employees, setEmployees] = useState([])
  const [query, setQuery] = useState('')
  const [filterDept, setFilterDept] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [form, setForm] = useState({ empId: '', name: '', email: '', phone: '', department: 'Engineering', role: '', salary: 0, doj: new Date().toISOString().slice(0,10), status: 'Active' })
  const [editing, setEditing] = useState(null)

  async function load() {
    const res = await fetch(API)
    const data = await res.json()
    setEmployees(data)
  }

  useEffect(() => { load() }, [])

  const stats = useMemo(() => {
    const total = employees.length
    const presentToday = employees.filter(e => e.status === 'Active').length
    const pendingLeaves = employees.filter(e => e.status === 'On Leave').length
    const avgCtc = total ? Math.round(employees.reduce((s,e)=>s+(e.salary||0),0)/total) : 0
    return { total, presentToday, pendingLeaves, avgCtc }
  }, [employees])

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim()
    let list = employees.filter(e => [e.empId, e.name, e.department, e.role, e.email].some(v => String(v).toLowerCase().includes(q)))
    if (filterDept !== 'all') list = list.filter(e => e.department === filterDept)
    if (filterStatus !== 'all') list = list.filter(e => e.status === filterStatus)
    return list.sort((a,b) => a.name.localeCompare(b.name))
  }, [employees, query, filterDept, filterStatus])

  async function saveEmployee(e) {
    e.preventDefault()
    const method = editing ? 'PUT' : 'POST'
    const url = editing ? `${API}/${editing.empId}` : API
    await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    setForm({ empId: '', name: '', email: '', phone: '', department: 'Engineering', role: '', salary: 0, doj: new Date().toISOString().slice(0,10), status: 'Active' })
    setEditing(null)
    load()
  }

  async function editRow(row) {
    setEditing(row)
    setForm({ ...row })
  }

  async function deleteRow(empId) {
    await fetch(`${API}/${empId}`, { method: 'DELETE' })
    load()
  }

  function exportCSV() {
    const rows = filtered
    if (!rows.length) return
    const headers = Object.keys(rows[0])
    const data = [headers.join(','), ...rows.map(r => headers.map(h => `"${String(r[h] ?? '').replaceAll('"','""')}"`).join(','))].join('\n')
    const blob = new Blob([data], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'employees.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50">
      <div className="sticky top-0 z-10 bg-white/70 backdrop-blur border-b">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center">EM</div>
            <h1 className="text-xl font-semibold">Employee Management</h1>
          </div>
          <div className="flex items-center gap-2 w-full max-w-xl">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-500" />
              <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search by name, id, department..." className="pl-7 pr-3 py-2 w-full rounded-xl border focus:outline-none focus:ring" />
            </div>
            <button onClick={exportCSV} className="px-3 py-2 rounded-xl border flex items-center gap-2">
              <Download size={16}/> Export
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        <aside className="lg:col-span-3 space-y-4">
          <div className="rounded-2xl bg-white border shadow-sm p-4">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <button className="px-3 py-2 rounded-lg border text-left">Employees</button>
              <button className="px-3 py-2 rounded-lg border text-left">Departments</button>
              <button className="px-3 py-2 rounded-lg border text-left">Attendance</button>
              <button className="px-3 py-2 rounded-lg border text-left">Salary</button>
            </div>

            <div className="mt-4 space-y-2 text-sm">
              <label className="block text-slate-600">Department</label>
              <select value={filterDept} onChange={e=>setFilterDept(e.target.value)} className="w-full border rounded-lg p-2">
                <option value="all">All</option>
                {['Engineering','HR','Finance','Operations','Marketing','Sales'].map(d => <option key={d} value={d}>{d}</option>)}
              </select>

              <label className="block text-slate-600 mt-2">Status</label>
              <select value={filterStatus} onChange={e=>setFilterStatus(e.target.value)} className="w-full border rounded-lg p-2">
                {['all','Active','On Leave','Resigned'].map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-2 gap-3">
            <Stat title="Total Employees" value={stats.total} Icon={Users} hint="All records" />
            <Stat title="Present Today" value={stats.presentToday} Icon={CalendarCheck2} hint="Marked Active" />
            <Stat title="On Leave" value={stats.pendingLeaves} Icon={Briefcase} hint="Approved leaves" />
            <Stat title="Avg CTC" value={currencyINR(stats.avgCtc)} Icon={FileSpreadsheet} hint="Across company" />
          </div>
        </aside>

        <main className="lg:col-span-9 space-y-4">
          <div className="rounded-2xl bg-white border shadow-sm">
            <div className="p-4 border-b flex items-center justify-between">
              <div className="font-semibold flex items-center gap-2"><Users size={18}/> Employees</div>
              <button onClick={()=>{ setEditing(null); setForm({ empId: '', name: '', email: '', phone: '', department: 'Engineering', role: '', salary: 0, doj: new Date().toISOString().slice(0,10), status: 'Active' })}} className="px-3 py-2 rounded-lg bg-black text-white flex items-center gap-2"><Plus size={16}/> Add</button>
            </div>

            <div className="p-4 overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-left text-slate-600">
                  <tr>
                    <th className="py-2">ID</th>
                    <th>Name</th>
                    <th>Dept</th>
                    <th>Role</th>
                    <th>CTC</th>
                    <th>Joined</th>
                    <th>Status</th>
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(e => (
                    <tr key={e.empId} className="border-t">
                      <td className="py-2 font-medium">{e.empId}</td>
                      <td>
                        <div className="font-medium">{e.name}</div>
                        <div className="text-xs text-slate-500">{e.email}</div>
                      </td>
                      <td>{e.department}</td>
                      <td>{e.role}</td>
                      <td>{currencyINR(e.salary)}</td>
                      <td>{new Date(e.doj).toLocaleDateString()}</td>
                      <td>{e.status}</td>
                      <td className="text-right">
                        <button onClick={()=>editRow(e)} className="px-2 py-1 border rounded-lg mr-2 inline-flex items-center gap-1"><Edit size={14}/> Edit</button>
                        <button onClick={()=>deleteRow(e.empId)} className="px-2 py-1 border rounded-lg inline-flex items-center gap-1 text-red-600"><Trash2 size={14}/> Delete</button>
                      </td>
                    </tr>
                  ))}
                  {!filtered.length && (
                    <tr><td colSpan="8" className="text-center py-6 text-slate-500">No employees found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="rounded-2xl bg-white border shadow-sm">
            <div className="p-4 border-b font-semibold">{editing ? 'Edit Employee' : 'Add Employee'}</div>
            <form onSubmit={saveEmployee} className="p-4 grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              {['empId','name','email','phone','role'].map(k => (
                <div key={k}>
                  <label className="block text-slate-600 capitalize">{k}</label>
                  <input value={form[k]} onChange={e=>setForm({...form,[k]:e.target.value})} className="w-full border rounded-lg p-2" required />
                </div>
              ))}
              <div>
                <label className="block text-slate-600">Department</label>
                <select value={form.department} onChange={e=>setForm({...form,department:e.target.value})} className="w-full border rounded-lg p-2">
                  {['Engineering','HR','Finance','Operations','Marketing','Sales'].map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-slate-600">Salary (CTC)</label>
                <input type="number" value={form.salary} onChange={e=>setForm({...form,salary:Number(e.target.value)})} className="w-full border rounded-lg p-2" />
              </div>
              <div>
                <label className="block text-slate-600">Joining Date</label>
                <input type="date" value={form.doj} onChange={e=>setForm({...form,doj:e.target.value})} className="w-full border rounded-lg p-2" />
              </div>
              <div>
                <label className="block text-slate-600">Status</label>
                <select value={form.status} onChange={e=>setForm({...form,status:e.target.value})} className="w-full border rounded-lg p-2">
                  {['Active','On Leave','Resigned'].map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="md:col-span-2 flex gap-2 justify-end">
                <button type="submit" className="px-4 py-2 rounded-lg bg-black text-white">{editing ? 'Save Changes' : 'Create'}</button>
              </div>
            </form>
          </div>
        </main>
      </div>

      <footer className="text-xs text-slate-500 max-w-7xl mx-auto px-4 py-6">
        © {new Date().getFullYear()} ACME Corp • Employee Management Suite
      </footer>
    </div>
  )
}
