import React, { useMemo, useState } from 'react'
import { Plus, Crown, Check, X } from 'lucide-react'
import { useApp } from '../context/AppContext.jsx'

export default function Tasks() {
  const { tasks, toggleTask, addTask, isPro, FREE_TASK_LIMIT } = useApp()
  const [frequency, setFrequency] = useState('Daily')
  const [showForm, setShowForm] = useState(false)
  const [title, setTitle] = useState('')
  const [tag, setTag] = useState('')

  const visibleTasks = useMemo(() => tasks.filter((t) => t.frequency === frequency), [tasks, frequency])
  const completedCount = visibleTasks.filter((t) => t.done).length
  const atLimit = !isPro && tasks.length >= FREE_TASK_LIMIT

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!title) return
    const ok = addTask({ title, tag: tag || 'General', frequency })
    if (ok) {
      setTitle('')
      setTag('')
      setShowForm(false)
    }
  }

  return (
    <div className="screen">
      <div className="screen-header-row">
        <div>
          <p className="eyebrow">
            {completedCount}/{visibleTasks.length} completed
          </p>
          <h1>Tasks</h1>
        </div>
        <button className="fab" onClick={() => setShowForm(true)} aria-label="Add task">
          <Plus size={22} />
        </button>
      </div>

      {!isPro && (
        <div className="upgrade-banner">
          <Crown size={18} className="crown-icon" />
          <div>
            <p className="upgrade-title">
              {tasks.length}/{FREE_TASK_LIMIT} free tasks used
            </p>
            <p className="upgrade-sub">
              Free plan · <span className="upgrade-link">Upgrade for unlimited</span>
            </p>
          </div>
        </div>
      )}

      <div className="segmented segmented-wide">
        {['Daily', 'Weekly'].map((f) => (
          <button
            key={f}
            className={`segmented-item ${frequency === f ? 'segmented-item-active' : ''}`}
            onClick={() => setFrequency(f)}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="task-list">
        {visibleTasks.map((t) => (
          <div className="task-row" key={t.id}>
            <button
              className={`checkbox ${t.done ? 'checkbox-checked' : ''}`}
              onClick={() => toggleTask(t.id)}
              aria-label={t.done ? 'Mark incomplete' : 'Mark complete'}
            >
              {t.done && <Check size={14} color="#fff" strokeWidth={3} />}
            </button>
            <div>
              <p className={`task-title ${t.done ? 'task-title-done' : ''}`}>{t.title}</p>
              <p className="task-tag">
                <span className="dot-small" /> {t.tag}
              </p>
            </div>
          </div>
        ))}
        {visibleTasks.length === 0 && <p className="muted empty-state">No {frequency.toLowerCase()} tasks yet.</p>}
      </div>

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Add {frequency} Task</h3>
              <button className="icon-button" onClick={() => setShowForm(false)}>
                <X size={20} />
              </button>
            </div>
            {atLimit ? (
              <div className="modal-form">
                <p className="muted">
                  You've used all {FREE_TASK_LIMIT} free tasks. Upgrade to add unlimited tasks.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="modal-form">
                <input
                  className="input"
                  placeholder="Task title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <input
                  className="input"
                  placeholder="Tag (e.g. Health)"
                  value={tag}
                  onChange={(e) => setTag(e.target.value)}
                />
                <button type="submit" className="primary-button">
                  Add Task
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
