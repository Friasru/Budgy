import React, { createContext, useContext, useMemo, useState } from 'react'

const AppContext = createContext(null)

const CATEGORY_COLORS = {
  Rent: '#EF476F',
  Groceries: '#F5A623',
  Entertainment: '#E84393',
  Transport: '#4A90E2',
  Salary: '#6C5DD3',
  Freelance: '#6C5DD3',
  Other: '#9AA0B4',
}

const initialTransactions = [
  { id: 't1', title: 'Weekly groceries', category: 'Groceries', amount: -156.4, date: 'Jun 28' },
  { id: 't2', title: 'Monthly salary', category: 'Salary', amount: 3500, date: 'Jun 25' },
  { id: 't3', title: 'Design project', category: 'Freelance', amount: 850, date: 'Jun 22' },
  { id: 't4', title: 'Netflix subscription', category: 'Entertainment', amount: -15.99, date: 'Jun 15' },
  { id: 't5', title: 'Monthly transit pass', category: 'Transport', amount: -48, date: 'Jun 5' },
  { id: 't6', title: 'June rent payment', category: 'Rent', amount: -1200, date: 'Jun 1' },
]

const initialTasks = [
  { id: 'd1', title: 'Morning workout', tag: 'Health', frequency: 'Daily', done: true },
  { id: 'd2', title: 'Read 20 pages', tag: 'Learning', frequency: 'Daily', done: false },
  { id: 'w1', title: 'Grocery shopping', tag: 'Home', frequency: 'Weekly', done: false },
  { id: 'w2', title: 'Review budget', tag: 'Finance', frequency: 'Weekly', done: false },
]

const FREE_TASK_LIMIT = 4

export function AppProvider({ children }) {
  const [transactions, setTransactions] = useState(initialTransactions)
  const [tasks, setTasks] = useState(initialTasks)
  const [darkMode, setDarkMode] = useState(false)
  const [isPro, setIsPro] = useState(false)

  const income = useMemo(
    () => transactions.filter((t) => t.amount > 0).reduce((sum, t) => sum + t.amount, 0),
    [transactions]
  )
  const expenses = useMemo(
    () => transactions.filter((t) => t.amount < 0).reduce((sum, t) => sum + Math.abs(t.amount), 0),
    [transactions]
  )
  const balance = income - expenses

  const categoryTotals = useMemo(() => {
    const totals = {}
    transactions
      .filter((t) => t.amount < 0)
      .forEach((t) => {
        totals[t.category] = (totals[t.category] || 0) + Math.abs(t.amount)
      })
    return Object.entries(totals)
      .map(([name, value]) => ({ name, value, color: CATEGORY_COLORS[name] || CATEGORY_COLORS.Other }))
      .sort((a, b) => b.value - a.value)
  }, [transactions])

  const addTransaction = (tx) => {
    setTransactions((prev) => [{ id: `t${Date.now()}`, ...tx }, ...prev])
  }

  const toggleTask = (id) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)))
  }

  const addTask = (task) => {
    if (!isPro && tasks.length >= FREE_TASK_LIMIT) return false
    setTasks((prev) => [...prev, { id: `task${Date.now()}`, done: false, ...task }])
    return true
  }

  const clearAllData = () => {
    setTransactions([])
    setTasks([])
  }

  const completedTasksCount = tasks.filter((t) => t.done).length
  const taskProgressPercent = tasks.length === 0 ? 0 : Math.round((completedTasksCount / tasks.length) * 100)

  const value = {
    transactions,
    tasks,
    income,
    expenses,
    balance,
    categoryTotals,
    addTransaction,
    toggleTask,
    addTask,
    clearAllData,
    completedTasksCount,
    taskProgressPercent,
    darkMode,
    setDarkMode,
    isPro,
    setIsPro,
    FREE_TASK_LIMIT,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
