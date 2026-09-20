import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, expect, test, vi } from 'vitest'
import { ThemeToggle } from '@/components/theme-toggle'

afterEach(() => {
  localStorage.clear()
  delete document.documentElement.dataset.theme
  delete document.documentElement.dataset.themePreference
  vi.unstubAllGlobals()
})

test('switching back to system keeps following operating-system changes', async () => {
  const listeners = new Set<(event: MediaQueryListEvent) => void>()
  const media = {
    matches: false,
    media: '(prefers-color-scheme: dark)',
    onchange: null,
    addEventListener: (_: string, listener: (event: MediaQueryListEvent) => void) => listeners.add(listener),
    removeEventListener: (_: string, listener: (event: MediaQueryListEvent) => void) => listeners.delete(listener),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn()
  } as unknown as MediaQueryList
  vi.stubGlobal('matchMedia', vi.fn(() => media))
  localStorage.setItem('theme', 'dark')

  render(<ThemeToggle />)
  await waitFor(() => expect(document.documentElement.dataset.theme).toBe('dark'))

  await userEvent.click(screen.getByRole('button', { name: /当前：深色/ }))
  expect(localStorage.getItem('theme')).toBe('system')
  expect(document.documentElement.dataset.theme).toBe('light')

  Object.defineProperty(media, 'matches', { value: true, configurable: true })
  listeners.forEach((listener) => listener({ matches: true } as MediaQueryListEvent))
  expect(document.documentElement.dataset.theme).toBe('dark')
})
