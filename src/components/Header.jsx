import { useState } from 'react'

function Header({ currentTab, setCurrentTab }) {
  const tabs = [
    { id: 'trainers', label: 'Trainers & Clients' },
    { id: 'programs', label: 'Programs & Sessions' },
    { id: 'progress', label: 'Progress Tracking' },
  ]

  return (
    <header className="sticky top-0 z-10 backdrop-blur bg-slate-900/60 border-b border-slate-700/50">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="/flame-icon.svg" alt="logo" className="w-8 h-8" />
          <h1 className="text-white text-xl font-semibold">Private Trainer Portal</h1>
        </div>
        <nav className="flex gap-2">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setCurrentTab(t.id)}
              className={`px-3 py-2 rounded-lg text-sm transition-colors ${currentTab === t.id ? 'bg-blue-600 text-white' : 'text-blue-200 hover:bg-slate-800'}`}
            >
              {t.label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  )
}

export default Header
