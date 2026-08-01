import { Moon, Sun } from 'lucide-react'
import { useTheme } from '../hooks/useTheme'

export function ThemeToggle({ onDark = false }) {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <button
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className={`icon-btn ${onDark ? 'on-dark' : ''}`}
      onClick={toggleTheme}
      type="button"
    >
      {isDark ? <Sun /> : <Moon />}
    </button>
  )
}
