import { useState } from 'react'
import Header from './components/Header'
import TrainerClient from './components/TrainerClient'
import ProgramsSessions from './components/ProgramsSessions'
import ProgressTracker from './components/ProgressTracker'

function App() {
  const [currentTab, setCurrentTab] = useState('trainers')

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-blue-100">
      <Header currentTab={currentTab} setCurrentTab={setCurrentTab} />

      <main className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        {currentTab === 'trainers' && (
          <TrainerClient />
        )}

        {currentTab === 'programs' && (
          <ProgramsSessions />)
        }

        {currentTab === 'progress' && (
          <ProgressTracker />
        )}
      </main>
    </div>
  )
}

export default App
