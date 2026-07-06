import React, { createContext, useContext, useMemo, useState, useEffect } from 'react'

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

// Generate consistent color for any category
function getCategoryColor(categoryName) {
  if (CATEGORY_COLORS[categoryName]) {
    return CATEGORY_COLORS[categoryName]
  }
  
  // Generate color based on category name hash
  const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2']
  let hash = 0
  for (let i = 0; i < categoryName.length; i++) {
    hash = categoryName.charCodeAt(i) + ((hash << 5) - hash)
  }
  return colors[Math.abs(hash) % colors.length]
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
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('budgy_transactions')
    return saved ? JSON.parse(saved) : initialTransactions
  })
  
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('budgy_tasks')
    return saved ? JSON.parse(saved) : initialTasks
  })
  
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('budgy_darkMode')
    return saved ? JSON.parse(saved) : false
  })
  
  const [isPro, setIsPro] = useState(() => {
    const saved = localStorage.getItem('budgy_isPro')
    return saved ? JSON.parse(saved) : false
  })

  // Save transactions to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('budgy_transactions', JSON.stringify(transactions))
  }, [transactions])

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('budgy_tasks', JSON.stringify(tasks))
  }, [tasks])

  // Save darkMode to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('budgy_darkMode', JSON.stringify(darkMode))
  }, [darkMode])

  // Save isPro to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('budgy_isPro', JSON.stringify(isPro))
  }, [isPro])

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
      .map(([name, value]) => ({ name, value, color: getCategoryColor(name) }))
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
