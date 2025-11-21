import { useEffect, useState } from 'react'

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

function ProgressTracker() {
  const [clients, setClients] = useState([])
  const [entries, setEntries] = useState([])
  const [form, setForm] = useState({ clientId: '', date: '', weight: '', bodyfat: '', notes: '' })

  const fetchAll = async () => {
    const c = await fetch(`${API}/clients`).then(r => r.json())
    setClients(c)
    if (form.clientId) {
      const e = await fetch(`${API}/progress?client_id=${form.clientId}`).then(r => r.json())
      setEntries(e)
    }
  }

  useEffect(() => { fetchAll() }, [])
  useEffect(() => { if (form.clientId) fetchAll() }, [form.clientId])

  const addEntry = async (e) => {
    e.preventDefault()
    await fetch(`${API}/progress`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ client_id: form.clientId, date: form.date || new Date().toISOString().slice(0,10), weight_kg: form.weight ? parseFloat(form.weight) : null, bodyfat_pct: form.bodyfat ? parseFloat(form.bodyfat) : null, notes: form.notes || null }) })
    setForm(f => ({ ...f, date: '', weight: '', bodyfat: '', notes: '' }))
    await fetchAll()
  }

  return (
    <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-5">
      <h3 className="text-white font-semibold mb-4">Track Client Progress</h3>
      <div className="grid md:grid-cols-3 gap-4">
        <div className="md:col-span-1">
          <label className="text-blue-200 text-sm mb-2 block">Select Client</label>
          <select value={form.clientId} onChange={e => setForm({ ...form, clientId: e.target.value })} className="w-full px-3 py-2 rounded bg-slate-900/60 text-white border border-slate-700">
            <option value="">Choose client</option>
            {clients.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
          </select>
        </div>
        <form onSubmit={addEntry} className="md:col-span-2 grid sm:grid-cols-4 gap-3 items-end">
          <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} className="px-3 py-2 rounded bg-slate-900/60 text-white border border-slate-700" />
          <input type="number" step="0.1" placeholder="Weight (kg)" value={form.weight} onChange={e => setForm({ ...form, weight: e.target.value })} className="px-3 py-2 rounded bg-slate-900/60 text-white border border-slate-700" />
          <input type="number" step="0.1" placeholder="Bodyfat %" value={form.bodyfat} onChange={e => setForm({ ...form, bodyfat: e.target.value })} className="px-3 py-2 rounded bg-slate-900/60 text-white border border-slate-700" />
          <input type="text" placeholder="Notes" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} className="px-3 py-2 rounded bg-slate-900/60 text-white border border-slate-700" />
          <button disabled={!form.clientId} className="sm:col-span-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white px-4 py-2 rounded">Add Entry</button>
        </form>
      </div>

      {form.clientId && (
        <div className="mt-6">
          <h4 className="text-blue-200 mb-2">Entries</h4>
          <ul className="space-y-2 max-h-64 overflow-auto pr-2">
            {entries.map(e => (
              <li key={e._id} className="text-sm text-blue-100 bg-slate-900/40 border border-slate-700/40 rounded px-3 py-2 flex items-center justify-between">
                <span>{new Date(e.date).toLocaleDateString()}</span>
                <span className="text-slate-400 text-xs">{e.weight_kg ? `${e.weight_kg} kg` : '—'} | {e.bodyfat_pct ? `${e.bodyfat_pct}%` : '—'}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default ProgressTracker
