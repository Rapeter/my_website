'use client'

import { useEffect, useSyncExternalStore } from 'react'

type Theme = 'light' | 'dark' | 'system'

const labels: Record<Theme, string> = {
  light: '浅色',
  dark: '深色',
  system: '跟随系统'
}

const order: Theme[] = ['system', 'light', 'dark']

function readStoredTheme(): Theme {
  const stored = window.localStorage.getItem('theme') as Theme | null
  return stored && order.includes(stored) ? stored : 'system'
}

function subscribeToTheme(onStoreChange: () => void) {
  window.addEventListener('storage', onStoreChange)
  window.addEventListener('themechange', onStoreChange)
  return () => {
    window.removeEventListener('storage', onStoreChange)
    window.removeEventListener('themechange', onStoreChange)
  }
}

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
  const theme = useSyncExternalStore<Theme>(subscribeToTheme, readStoredTheme, () => 'system')

  useEffect(() => {
    applyTheme(theme)

    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const syncSystem = () => {
      if (readStoredTheme() === 'system') applyTheme('system')
    }
    media.addEventListener('change', syncSystem)
    return () => media.removeEventListener('change', syncSystem)
  }, [theme])

  function cycleTheme() {
    const next = order[(order.indexOf(theme) + 1) % order.length]
    window.localStorage.setItem('theme', next)
    window.dispatchEvent(new Event('themechange'))
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
