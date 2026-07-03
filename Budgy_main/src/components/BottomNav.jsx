import React from 'react'
import { LayoutGrid, Wallet, ListChecks, Settings } from 'lucide-react'

const TABS = [
  { key: 'dashboard', label: 'Dashboard', icon: LayoutGrid },
  { key: 'finance', label: 'Finance', icon: Wallet },
  { key: 'tasks', label: 'Tasks', icon: ListChecks },
  { key: 'settings', label: 'Settings', icon: Settings },
]

export default function BottomNav({ active, onChange }) {
  return (
    <nav className="bottom-nav">
      {TABS.map(({ key, label, icon: Icon }) => {
        const isActive = active === key
        return (
          <button
            key={key}
            className={`nav-item ${isActive ? 'nav-item-active' : ''}`}
            onClick={() => onChange(key)}
          >
            <Icon size={22} strokeWidth={isActive ? 2.4 : 1.8} />
            <span>{label}</span>
          </button>
        )
      })}
    </nav>
  )
}
