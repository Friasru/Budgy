import React, { useMemo, useState } from 'react'
import { Plus, TrendingUp, TrendingDown, X } from 'lucide-react'
import { useApp } from '../context/AppContext.jsx'

const FILTERS = ['All', 'Income', 'Expense']

export default function Finance() {
  const { transactions, income, expenses, addTransaction, getAllCategories, addCategory } = useApp()
  const [filter, setFilter] = useState('All')
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ title: '', category: '', amount: '', type: 'Expense' })

  const filtered = useMemo(() => {
    if (filter === 'Income') return transactions.filter((t) => t.amount > 0)
    if (filter === 'Expense') return transactions.filter((t) => t.amount < 0)
    return transactions
  }, [transactions, filter])

  const handleCategoryChange = (e) => {
    const value = e.target.value
    if (value === 'create') {
      const newCat = prompt('Enter new category name:')
      if (newCat && newCat.trim()) {
        if (addCategory(newCat)) {
          setForm((f) => ({ ...f, category: newCat }))
        }
      }
    } else {
      setForm((f) => ({ ...f, category: value }))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.title || !form.amount) return
    const amount = form.type === 'Income' ? Math.abs(Number(form.amount)) : -Math.abs(Number(form.amount))
    addTransaction({
      title: form.title,
      category: form.category || (form.type === 'Income' ? 'Other Income' : 'Other'),
      amount,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    })
    setForm({ title: '', category: '', amount: '', type: 'Expense' })
    setShowForm(false)
  }

  return (
    <div className="screen finance-screen">
      {/* ── Fixed top section ── */}
      <div className="finance-fixed">
        <div className="screen-header-row">
          <div>
            <p className="eyebrow">Your finances</p>
            <h1>Finance</h1>
          </div>
          <button className="fab" onClick={() => setShowForm(true)} aria-label="Add transaction">
            <Plus size={22} />
          </button>
        </div>

        <div className="summary-row">
          <div className="summary-card summary-income">
            <div className="summary-label">
              <TrendingUp size={16} /> Income
            </div>
            <p className="summary-amount">${income.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
          </div>
          <div className="summary-card summary-expense">
            <div className="summary-label">
              <TrendingDown size={16} /> Expenses
            </div>
            <p className="summary-amount">${expenses.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
          </div>
        </div>

        <div className="pill-tabs">
          {FILTERS.map((f) => (
            <button
              key={f}
              className={`pill-tab ${filter === f ? 'pill-tab-active' : ''}`}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* ── Scrollable transactions section ── */}
      <div className="finance-scroll">
        <div className="transaction-list">
          {filtered.map((t) => (
            <div className="transaction-row transaction-row-card" key={t.id}>
              <div className="transaction-icon" style={{ background: t.amount > 0 ? '#EDEBFB' : '#FCEAEA' }}>
                <span className="dot-large" style={{ background: t.amount > 0 ? '#6C5DD3' : '#EF476F' }} />
              </div>
              <div className="transaction-info">
                <p className="transaction-title">{t.title}</p>
                <p className="muted small">
                  {t.category} · {t.date}
                </p>
              </div>
              <p className={`transaction-amount ${t.amount > 0 ? 'positive' : 'negative'}`}>
                {t.amount > 0 ? '+' : '-'}${Math.abs(t.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </p>
            </div>
          ))}
          {filtered.length === 0 && <p className="muted empty-state">No transactions yet.</p>}
        </div>
      </div>

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Add Transaction</h3>
              <button className="icon-button" onClick={() => setShowForm(false)}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="segmented">
                {['Expense', 'Income'].map((type) => (
                  <button
                    type="button"
                    key={type}
                    className={`segmented-item ${form.type === type ? 'segmented-item-active' : ''}`}
                    onClick={() => setForm((f) => ({ ...f, type }))}
                  >
                    {type}
                  </button>
                ))}
              </div>
              <input
                className="input"
                placeholder="Title (e.g. Coffee with friends)"
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              />
              <select
                className="input"
                value={form.category}
                onChange={handleCategoryChange}
              >
                <option value="">Select Category</option>
                {getAllCategories().map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
                <option value="create">+ Create Category</option>
              </select>
              <input
                className="input"
                placeholder="Amount"
                type="number"
                step="0.01"
                value={form.amount}
                onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
              />
              <button type="submit" className="primary-button">
                Add {form.type}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}