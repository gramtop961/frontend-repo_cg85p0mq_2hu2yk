import { useEffect, useState } from 'react'

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

function ProgramsSessions() {
  const [programs, setPrograms] = useState([])
  const [sessions, setSessions] = useState([])
  const [clients, setClients] = useState([])
  const [trainers, setTrainers] = useState([])
  const [form, setForm] = useState({ title: '', clientId: '', trainerId: '', sessionClientId: '', sessionTrainerId: '', sessionDate: '' })

  const fetchAll = async () => {
    const [p, s, c, t] = await Promise.all([
      fetch(`${API}/programs`).then(r => r.json()),
      fetch(`${API}/sessions`).then(r => r.json()),
      fetch(`${API}/clients`).then(r => r.json()),
      fetch(`${API}/trainers`).then(r => r.json()),
    ])
    setPrograms(p)
    setSessions(s)
    setClients(c)
    setTrainers(t)
  }

  useEffect(() => { fetchAll() }, [])

  const addProgram = async (e) => {
    e.preventDefault()
    await fetch(`${API}/programs`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title: form.title, client_id: form.clientId || null, trainer_id: form.trainerId || null, exercises: [] }) })
    setForm(f => ({ ...f, title: '' }))
    await fetchAll()
  }

  const addSession = async (e) => {
    e.preventDefault()
    await fetch(`${API}/sessions`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ client_id: form.sessionClientId, trainer_id: form.sessionTrainerId, date: form.sessionDate || new Date().toISOString().slice(0,10) }) })
    setForm(f => ({ ...f, sessionClientId: '', sessionTrainerId: '', sessionDate: '' }))
    await fetchAll()
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-5">
        <h3 className="text-white font-semibold mb-4">Create Program</h3>
        <form onSubmit={addProgram} className="space-y-3">
          <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Program title" className="w-full px-3 py-2 rounded bg-slate-900/60 text-white border border-slate-700" />
          <select value={form.clientId} onChange={e => setForm({ ...form, clientId: e.target.value })} className="w-full px-3 py-2 rounded bg-slate-900/60 text-white border border-slate-700">
            <option value="">No client</option>
            {clients.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
          </select>
          <select value={form.trainerId} onChange={e => setForm({ ...form, trainerId: e.target.value })} className="w-full px-3 py-2 rounded bg-slate-900/60 text-white border border-slate-700">
            <option value="">No trainer</option>
            {trainers.map(t => <option key={t._id} value={t._id}>{t.name}</option>)}
          </select>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">Create Program</button>
        </form>

        <h4 className="text-blue-200 mt-6 mb-2">Programs</h4>
        <ul className="space-y-2 max-h-64 overflow-auto pr-2">
          {programs.map(p => (
            <li key={p._id} className="text-sm text-blue-100 bg-slate-900/40 border border-slate-700/40 rounded px-3 py-2">
              <div className="flex items-center justify-between">
                <span className="font-medium">{p.title}</span>
                <span className="text-slate-400 text-xs">{p.trainer_id ? trainers.find(t => t._id === p.trainer_id)?.name : '—'}</span>
              </div>
              <div className="text-slate-400 text-xs">Client: {p.client_id ? clients.find(c => c._id === p.client_id)?.name : '—'}</div>
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-5">
        <h3 className="text-white font-semibold mb-4">Schedule Session</h3>
        <form onSubmit={addSession} className="space-y-3">
          <select value={form.sessionClientId} onChange={e => setForm({ ...form, sessionClientId: e.target.value })} className="w-full px-3 py-2 rounded bg-slate-900/60 text-white border border-slate-700">
            <option value="">Select client</option>
            {clients.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
          </select>
          <select value={form.sessionTrainerId} onChange={e => setForm({ ...form, sessionTrainerId: e.target.value })} className="w-full px-3 py-2 rounded bg-slate-900/60 text-white border border-slate-700">
            <option value="">Select trainer</option>
            {trainers.map(t => <option key={t._id} value={t._id}>{t.name}</option>)}
          </select>
          <input type="date" value={form.sessionDate} onChange={e => setForm({ ...form, sessionDate: e.target.value })} className="w-full px-3 py-2 rounded bg-slate-900/60 text-white border border-slate-700" />
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">Create Session</button>
        </form>

        <h4 className="text-blue-200 mt-6 mb-2">Upcoming Sessions</h4>
        <ul className="space-y-2 max-h-64 overflow-auto pr-2">
          {sessions.map(s => (
            <li key={s._id} className="text-sm text-blue-100 bg-slate-900/40 border border-slate-700/40 rounded px-3 py-2">
              <div className="flex items-center justify-between">
                <span>{new Date(s.date).toLocaleDateString()}</span>
                <span className="text-slate-400 text-xs">{trainers.find(t => t._id === s.trainer_id)?.name || '—'}</span>
              </div>
              <div className="text-slate-400 text-xs">Client: {clients.find(c => c._id === s.client_id)?.name || '—'}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default ProgramsSessions
