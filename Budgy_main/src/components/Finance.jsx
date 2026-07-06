import React, { useMemo, useState } from 'react'
import { Plus, TrendingUp, TrendingDown, X } from 'lucide-react'
import { useApp } from '../context/AppContext.jsx'

const FILTERS = ['All', 'Income', 'Expense']

export default function Finance() {
  const { transactions, income, expenses, addTransaction, getAllCategories, addCategory } = useApp()
  const [filter, setFilter] = useState('All')
  const [showForm, setShowForm] = useState(false)
  const [showNewCategory, setShowNewCategory] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState('')
  const [form, setForm] = useState({ title: '', category: '', amount: '', type: 'Expense' })

  const allCategories = getAllCategories()

  const filtered = useMemo(() => {
    if (filter === 'Income') return transactions.filter((t) => t.amount > 0)
    if (filter === 'Expense') return transactions.filter((t) => t.amount < 0)
    return transactions
  }, [transactions, filter])

  const handleAddCategory = () => {
    if (newCategoryName.trim()) {
      if (addCategory(newCategoryName)) {
        setForm({ ...form, category: newCategoryName })
        setNewCategoryName('')
        setShowNewCategory(false)
      }
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.title || !form.amount || !form.category) return
    const amount = form.type === 'Income' ? Math.abs(Number(form.amount)) : -Math.abs(Number(form.amount))
    addTransaction({
      title: form.title,
      category: form.category,
      amount,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    })
    setForm({ title: '', category: '', amount: '', type: 'Expense' })
    setShowForm(false)
  }

  return (
    <div className="screen">
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

      <div className="filter-buttons">
        {FILTERS.map((f) => (
          <button
            key={f}
            className={`filter-btn ${filter === f ? 'active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="transaction-list">
        {filtered.map((t) => (
          <div className="transaction-row" key={t.id}>
            <div className="transaction-icon" style={{ background: t.amount > 0 ? '#EDEBFB' : '#FCEFE2' }}>
              <span className="dot-large" style={{ background: t.amount > 0 ? '#6C5DD3' : '#F5A623' }} />
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
      </div>

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add Transaction</h2>
              <button className="close-btn" onClick={() => setShowForm(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="transaction-form">
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  placeholder="Transaction title"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Type</label>
                <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                  <option>Expense</option>
                  <option>Income</option>
                </select>
              </div>

              <div className="form-group">
                <label>Amount</label>
                <input
                  type="number"
                  placeholder="0.00"
                  step="0.01"
                  value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Category</label>
                {showNewCategory ? (
                  <div className="new-category-input">
                    <input
                      type="text"
                      placeholder="Enter category name"
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      autoFocus
                    />
                    <button type="button" onClick={handleAddCategory}>Add</button>
                    <button type="button" onClick={() => setShowNewCategory(false)}>Cancel</button>
                  </div>
                ) : (
                  <>
                    <div className="category-list">
                      {allCategories.map((cat) => (
                        <button
                          key={cat}
                          type="button"
                          className={`category-btn ${form.category === cat ? 'active' : ''}`}
                          onClick={() => setForm({ ...form, category: cat })}
                        >
                          {cat}
                        </button>
                      ))}
                      <button
                        type="button"
                        className="category-btn create-btn"
                        onClick={() => setShowNewCategory(true)}
                      >
                        + Create
                      </button>
                    </div>
                  </>
                )}
              </div>

              <button type="submit" className="submit-btn">Add Transaction</button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}