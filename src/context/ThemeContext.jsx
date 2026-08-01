import { useCallback, useEffect, useMemo, useState } from 'react'
import { ThemeContext } from './ThemeContextCore'

const STORAGE_KEY = 'ventiq_theme'
const LIGHT_CANVAS = '#f6f7f9'
const DARK_CANVAS = '#0f1420'

function resolveInitialTheme() {
  if (typeof window === 'undefined') return 'light'

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (stored === 'dark' || stored === 'light') return stored
  } catch {
    // ignore storage errors
  }

  try {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  } catch {
    return 'light'
  }
}

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(resolveInitialTheme)

  useEffect(() => {
    const root = document.documentElement
    root.classList.add('theme-transition')
    root.classList.toggle('dark', theme === 'dark')
    root.dataset.theme = theme

    const meta = document.querySelector('meta[name="theme-color"]')
    if (meta) meta.setAttribute('content', theme === 'dark' ? DARK_CANVAS : LIGHT_CANVAS)

    try {
      window.localStorage.setItem(STORAGE_KEY, theme)
    } catch {
      // ignore storage errors
    }

    const timer = window.setTimeout(() => root.classList.remove('theme-transition'), 320)
    return () => window.clearTimeout(timer)
  }, [theme])

  const setTheme = useCallback((next) => {
    setThemeState(next === 'dark' ? 'dark' : 'light')
  }, [])

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => (prev === 'dark' ? 'light' : 'dark'))
  }, [])

  const value = useMemo(
    () => ({ theme, setTheme, toggleTheme }),
    [setTheme, theme, toggleTheme],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
