import { useEffect, useState } from 'react'

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

function TrainerClient() {
  const [trainers, setTrainers] = useState([])
  const [clients, setClients] = useState([])
  const [form, setForm] = useState({ trainerName: '', trainerEmail: '', clientName: '', clientTrainerId: '' })
  const [loading, setLoading] = useState(false)

  const fetchData = async () => {
    const [tRes, cRes] = await Promise.all([
      fetch(`${API}/trainers`).then(r => r.json()),
      fetch(`${API}/clients`).then(r => r.json()),
    ])
    setTrainers(tRes)
    setClients(cRes)
  }

  useEffect(() => {
    fetchData()
  }, [])

  const addTrainer = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await fetch(`${API}/trainers`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: form.trainerName, email: form.trainerEmail }) })
      setForm(f => ({ ...f, trainerName: '', trainerEmail: '' }))
      await fetchData()
    } finally {
      setLoading(false)
    }
  }

  const addClient = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await fetch(`${API}/clients`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: form.clientName, trainer_id: form.clientTrainerId || null }) })
      setForm(f => ({ ...f, clientName: '' }))
      await fetchData()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-5">
        <h3 className="text-white font-semibold mb-4">Add Trainer</h3>
        <form onSubmit={addTrainer} className="space-y-3">
          <input value={form.trainerName} onChange={e => setForm({ ...form, trainerName: e.target.value })} placeholder="Name" className="w-full px-3 py-2 rounded bg-slate-900/60 text-white border border-slate-700" />
          <input value={form.trainerEmail} onChange={e => setForm({ ...form, trainerEmail: e.target.value })} placeholder="Email" className="w-full px-3 py-2 rounded bg-slate-900/60 text-white border border-slate-700" />
          <button disabled={loading} className="bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white px-4 py-2 rounded">Add Trainer</button>
        </form>
        <h4 className="text-blue-200 mt-6 mb-2">Trainers</h4>
        <ul className="space-y-2 max-h-64 overflow-auto pr-2">
          {trainers.map(t => (
            <li key={t._id} className="text-sm text-blue-100 flex items-center justify-between bg-slate-900/40 border border-slate-700/40 rounded px-3 py-2">
              <span>{t.name}</span>
              <span className="text-slate-400 text-xs">{t.email}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-5">
        <h3 className="text-white font-semibold mb-4">Add Client</h3>
        <form onSubmit={addClient} className="space-y-3">
          <input value={form.clientName} onChange={e => setForm({ ...form, clientName: e.target.value })} placeholder="Name" className="w-full px-3 py-2 rounded bg-slate-900/60 text-white border border-slate-700" />
          <select value={form.clientTrainerId} onChange={e => setForm({ ...form, clientTrainerId: e.target.value })} className="w-full px-3 py-2 rounded bg-slate-900/60 text-white border border-slate-700">
            <option value="">No trainer</option>
            {trainers.map(t => (
              <option key={t._id} value={t._id}>{t.name}</option>
            ))}
          </select>
          <button disabled={loading} className="bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white px-4 py-2 rounded">Add Client</button>
        </form>
        <h4 className="text-blue-200 mt-6 mb-2">Clients</h4>
        <ul className="space-y-2 max-h-64 overflow-auto pr-2">
          {clients.map(c => (
            <li key={c._id} className="text-sm text-blue-100 flex items-center justify-between bg-slate-900/40 border border-slate-700/40 rounded px-3 py-2">
              <span>{c.name}</span>
              <span className="text-slate-400 text-xs">{c.trainer_id ? trainers.find(t => t._id === c.trainer_id)?.name || '—' : '—'}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default TrainerClient
