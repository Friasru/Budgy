import React from 'react'
import { ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { useApp } from '../context/AppContext.jsx'
import DonutChart from './DonutChart.jsx'

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
}

export default function Dashboard() {
  const { balance, income, expenses, categoryTotals, tasks, completedTasksCount, taskProgressPercent, transactions } =
    useApp()

  const recent = transactions.slice(0, 2)

  return (
    <div className="screen">
      <div className="screen-header">
        <p className="eyebrow">{getGreeting()} 👋</p>
        <h1>Overview</h1>
      </div>

      <div className="balance-card">
        <p className="balance-label">Total Balance</p>
        <h2 className="balance-amount">
          ${balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </h2>
        <div className="balance-row">
          <div>
            <div className="balance-sub-label">
              <ArrowUpRight size={14} /> Income
            </div>
            <p className="balance-sub-amount">${income.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
          </div>
          <div>
            <div className="balance-sub-label">
              <ArrowDownRight size={14} /> Expenses
            </div>
            <p className="balance-sub-amount">${expenses.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header-row">
          <h3>Task Progress</h3>
          <span className="muted">
            {completedTasksCount}/{tasks.length} done
          </span>
        </div>
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${taskProgressPercent}%` }} />
        </div>
        <p className="muted small">{taskProgressPercent}% completed today</p>
      </div>

      <div className="card">
        <h3>Expenses by Category</h3>
        <div className="donut-row">
          <DonutChart data={categoryTotals} />
          <ul className="legend">
            {categoryTotals.map((c) => (
              <li key={c.name}>
                <span className="dot" style={{ background: c.color }} />
                <span className="legend-name">{c.name}</span>
                <span className="legend-value">
                  ${c.value.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <h3 className="section-title">Recent Transactions</h3>
      <div className="transaction-list">
        {recent.map((t) => (
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
    </div>
  )
}
