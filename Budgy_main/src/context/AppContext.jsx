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

const DEFAULT_CATEGORIES = ['Groceries', 'Entertainment', 'Transport', 'Salary']

// Generate consistent color for any category (case-insensitive)
function getCategoryColor(categoryName) {
  const normalized = categoryName.toLowerCase()
  
  // Check predefined colors (case-insensitive)
  for (const [key, color] of Object.entries(CATEGORY_COLORS)) {
    if (key.toLowerCase() === normalized) {
      return color
    }
  }
  
  // Load stored category colors
  const storedColors = JSON.parse(localStorage.getItem('budgy_categoryColors') || '{}')
  
  if (storedColors[normalized]) {
    return storedColors[normalized]
  }
  
  // Generate new color
  const customColors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2', '#F38181', '#AA96DA', '#FCBAD3', '#A8D8EA']
  const usedColors = Object.values(storedColors)
  const color = customColors.find(c => !usedColors.includes(c)) || customColors[usedColors.length % customColors.length]
  
  // Save the new color
  storedColors[normalized] = color
  localStorage.setItem('budgy_categoryColors', JSON.stringify(storedColors))
  
  return color
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

  const [customCategories, setCustomCategories] = useState(() => {
    const saved = localStorage.getItem('budgy_customCategories')
    return saved ? JSON.parse(saved) : []
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

  // Save custom categories to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('budgy_customCategories', JSON.stringify(customCategories))
  }, [customCategories])

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

  const addCategory = (categoryName) => {
    if (!customCategories.includes(categoryName) && !DEFAULT_CATEGORIES.includes(categoryName)) {
      setCustomCategories((prev) => [...prev, categoryName])
      return true
    }
    return false
  }

  const getAllCategories = () => [...DEFAULT_CATEGORIES, ...customCategories]

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
    customCategories,
    addCategory,
    getAllCategories,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}