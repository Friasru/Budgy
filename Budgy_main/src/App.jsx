import React, { useState, useEffect } from 'react'
import { AppProvider, useApp } from './context/AppContext.jsx'
import Onboarding from './components/Onboarding.jsx'
import BottomNav from './components/BottomNav.jsx'
import Dashboard from './components/Dashboard.jsx'
import Finance from './components/Finance.jsx'
import Tasks from './components/Tasks.jsx'
import Settings from './components/Settings.jsx'

function Shell() {
  const [tab, setTab] = useState('dashboard')
  const { darkMode, onboardingComplete } = useApp()

  useEffect(() => {
    document.body.classList.toggle('dark', darkMode)
  }, [darkMode])

  // Show onboarding if user hasn't completed it
  if (!onboardingComplete) {
    return <Onboarding />
  }

  const screens = {
    dashboard: <Dashboard />,
    finance: <Finance />,
    tasks: <Tasks />,
    settings: <Settings />,
  }

  return (
    <div className={`app-shell ${darkMode ? 'dark' : ''}`}>
      <div className="phone-frame">
        <main className="app-content">{screens[tab]}</main>
        <BottomNav active={tab} onChange={setTab} />
      </div>
    </div>
  )
}

export default function App() {
  return (
    <AppProvider>
      <Shell />
    </AppProvider>
  )
}