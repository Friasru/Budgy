import React, { useState } from 'react'
import { useApp } from '../context/AppContext.jsx'

const slides = [
  {
    title: 'Welcome to Budgy',
    description: 'Your personal finance companion that helps you track spending, manage categories, and stay on top of your budget.',
    icon: '💰',
  },
  {
    title: 'Organize Your Finances',
    description: 'Create custom categories for your income and expenses. Organize transactions exactly the way you need them, and watch your spending patterns in real-time.',
    icon: '📊',
  },
  {
    title: 'Your Data Stays Safe',
    description: 'All your changes are saved automatically and will remain even after app updates. Your data is yours and syncs across sessions.',
    icon: '🔒',
  },
]

export default function Onboarding() {
  const [slideIndex, setSlideIndex] = useState(0)
  const { completeOnboarding } = useApp()

  const slide = slides[slideIndex]
  const isFirst = slideIndex === 0
  const isLast = slideIndex === slides.length - 1

  const handleNext = () => {
    if (isLast) {
      completeOnboarding()
    } else {
      setSlideIndex((prev) => prev + 1)
    }
  }

  const handleBack = () => {
    if (!isFirst) {
      setSlideIndex((prev) => prev - 1)
    }
  }

  return (
    <div className="app-shell">
      <div className="phone-frame">
        <div className="onboarding-screen">
          <div className="onboarding-content">
            <div className="onboarding-icon">{slide.icon}</div>
            <h1 className="onboarding-title">{slide.title}</h1>
            <p className="onboarding-description">{slide.description}</p>
          </div>

          <div className="onboarding-dots">
            {slides.map((_, idx) => (
              <div
                key={idx}
                className={`dot ${idx === slideIndex ? 'active' : ''}`}
              />
            ))}
          </div>

          <div className="onboarding-actions">
            <button
              onClick={handleBack}
              className="btn-secondary"
              style={{ visibility: isFirst ? 'hidden' : 'visible' }}
            >
              Back
            </button>
            <button onClick={handleNext} className="btn-primary">
              {isLast ? 'Get Started' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}