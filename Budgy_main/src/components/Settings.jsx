import React, { useState } from 'react'
import { Sun, Moon, Crown, Trash2 } from 'lucide-react'
import { useApp } from '../context/AppContext.jsx'

export default function Settings() {
  const { darkMode, setDarkMode, isPro, setIsPro, clearAllData, FREE_TASK_LIMIT } = useApp()
  const [confirmClear, setConfirmClear] = useState(false)

  const handleClear = () => {
    if (confirmClear) {
      clearAllData()
      setConfirmClear(false)
    } else {
      setConfirmClear(true)
    }
  }

  return (
    <div className="screen">
      <div className="screen-header">
        <p className="eyebrow">Preferences</p>
        <h1>Settings</h1>
      </div>

      <p className="section-title">Appearance</p>
      <div className="card row-card">
        <div className="row-left">
          <div className="row-icon" style={{ background: '#FCEFD8' }}>
            {darkMode ? <Moon size={18} color="#F5A623" /> : <Sun size={18} color="#F5A623" />}
          </div>
          <span className="row-label">Dark Mode</span>
        </div>
        <button
          className={`switch ${darkMode ? 'switch-on' : ''}`}
          onClick={() => setDarkMode((d) => !d)}
          aria-label="Toggle dark mode"
        >
          <span className="switch-knob" />
        </button>
      </div>

      <p className="section-title">Subscription</p>
      <div className="card row-card">
        <div className="row-left">
          <div className="row-icon" style={{ background: '#EDEBFB' }}>
            <Crown size={18} color="#6C5DD3" />
          </div>
          <div>
            <p className="row-label">{isPro ? 'Pro Plan' : 'Free Plan'}</p>
            <p className="muted small">{isPro ? 'Unlimited tasks' : `${FREE_TASK_LIMIT} tasks maximum`}</p>
          </div>
        </div>
        {!isPro && (
          <button className="upgrade-button" onClick={() => setIsPro(true)}>
            Upgrade
          </button>
        )}
      </div>

      <p className="section-title">Data</p>
      <button className="card row-card row-card-button" onClick={handleClear}>
        <div className="row-left">
          <div className="row-icon" style={{ background: '#FCEAEA' }}>
            <Trash2 size={18} color="#EF4444" />
          </div>
          <div>
            <p className="row-label danger-text">{confirmClear ? 'Tap again to confirm' : 'Clear All Data'}</p>
            <p className="muted small">Remove all transactions and tasks</p>
          </div>
        </div>
      </button>

      <p className="section-title">About</p>
      <div className="card about-card">
        <div className="about-row">
          <span className="muted">Version</span>
          <span>1.0.0</span>
        </div>
        <div className="about-row">
          <span className="muted">Platform</span>
          <span>Web</span>
        </div>
        <div className="about-row">
          <span className="muted">Build</span>
          <span>{new Date().toISOString().slice(0, 10).replace(/-/g, '.')}</span>
        </div>
      </div>
    </div>
  )
}
