'use client'

import { useEffect, useState } from 'react'

type Theme = 'light' | 'dark' | 'system'

const labels: Record<Theme, string> = {
  light: '浅色',
  dark: '深色',
  system: '跟随系统'
}

const order: Theme[] = ['system', 'light', 'dark']

function applyTheme(theme: Theme) {
  const resolved =
    theme === 'system'
      ? window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'
      : theme

  document.documentElement.dataset.theme = resolved
  document.documentElement.dataset.themePreference = theme
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('system')

  useEffect(() => {
    const stored = window.localStorage.getItem('theme') as Theme | null
    const initial = stored && order.includes(stored) ? stored : 'system'
    setTheme(initial)
    applyTheme(initial)

    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const syncSystem = () => initial === 'system' && applyTheme('system')
    media.addEventListener('change', syncSystem)
    return () => media.removeEventListener('change', syncSystem)
  }, [])

  function cycleTheme() {
    const next = order[(order.indexOf(theme) + 1) % order.length]
    setTheme(next)
    window.localStorage.setItem('theme', next)
    applyTheme(next)
  }

  return (
    <button
      className="theme-toggle"
      type="button"
      onClick={cycleTheme}
      aria-label={`切换主题，当前：${labels[theme]}`}
      title={`主题：${labels[theme]}`}
    >
      <span aria-hidden="true">◐</span>
      <span className="theme-toggle__label">{labels[theme]}</span>
    </button>
  )
}
