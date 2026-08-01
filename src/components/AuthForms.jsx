import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AtSign, Check, Eye, EyeOff, Image, Lock, LogIn, Mail, User, UserPlus } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { Brand } from './Brand'
import { ThemeToggle } from './ThemeToggle'
import { Button } from './ui/Button'
import { FileDrop } from './ui/FileDrop'
import { Notice } from './ui/Notice'

const brandPoints = [
  'Upload and publish videos in a few clicks',
  'Post short updates your audience sees instantly',
  'Follow channels, build playlists, and grow',
]

export function AuthForms({ initialMode = 'login' }) {
  const { login, register } = useAuth()
  const navigate = useNavigate()
  const [mode, setMode] = useState(initialMode)
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  async function handleLogin(event) {
    event.preventDefault()
    setBusy(true)
    setMessage('')

    const form = new FormData(event.currentTarget)
    const identifier = String(form.get('emailOrUsername') || '')
    try {
      await login({
        email: identifier.includes('@') ? identifier : '',
        username: identifier.includes('@') ? '' : identifier,
        password: String(form.get('password') || ''),
      })
    } catch (err) {
      setMessage({ text: err.message, tone: 'error' })
    } finally {
      setBusy(false)
    }
  }

  async function handleRegister(event) {
    event.preventDefault()
    setBusy(true)
    setMessage('')

    const form = new FormData(event.currentTarget)
    try {
      await register(form)
      setMessage({ text: 'Account created. Sign in to continue.', tone: 'success' })
      setMode('login')
      navigate('/login')
    } catch (err) {
      setMessage({ text: err.message, tone: 'error' })
    } finally {
      setBusy(false)
    }
  }

  function switchMode(next) {
    setMode(next)
    setMessage('')
    navigate(next === 'login' ? '/login' : '/signup')
  }

  return (
    <main className="auth-screen">
      <section className="auth-brand">
        <div>
          <Brand onDark to="/" />
          <h1>Your videos. Your voice. One stage.</h1>
          <p className="auth-brand-sub">
            Ventiq brings video publishing, short updates, and community into a single focused workspace.
          </p>
          <ul className="auth-brand-list">
            {brandPoints.map((point) => (
              <li key={point}>
                <span className="check">
                  <Check />
                </span>
                {point}
              </li>
            ))}
          </ul>
        </div>
        <div className="auth-brand-quote">
          <p>One place to publish, connect, and keep every conversation close to the content.</p>
          <span>The Ventiq creator flow</span>
        </div>
      </section>

      <section className="auth-card-wrap">
        <div className="auth-toggle">
          <ThemeToggle />
        </div>
        <div className="auth-card">
          <div className="segmented w-full" role="tablist">
            <button
              aria-selected={mode === 'login'}
              className={mode === 'login' ? 'active' : ''}
              onClick={() => switchMode('login')}
              role="tab"
              type="button"
            >
              <LogIn />
              Login
            </button>
            <button
              aria-selected={mode === 'signup'}
              className={mode === 'signup' ? 'active' : ''}
              onClick={() => switchMode('signup')}
              role="tab"
              type="button"
            >
              <UserPlus />
              Sign up
            </button>
          </div>

          <h2>{mode === 'login' ? 'Welcome back' : 'Create your channel'}</h2>
          <p className="auth-card-sub">
            {mode === 'login' ? 'Sign in to continue to your workspace.' : 'Start your creator journey in under a minute.'}
          </p>

          {mode === 'login' ? (
            <form className="auth-form" onSubmit={handleLogin}>
              <label className="field">
                <span className="field-label">
                  <AtSign />
                  Email or username
                </span>
                <div className="input-wrap">
                  <AtSign />
                  <input className="input" name="emailOrUsername" placeholder="samyak or samyak@example.com" required />
                </div>
              </label>
              <label className="field">
                <span className="field-label">
                  <Lock />
                  Password
                </span>
                <div className="input-wrap">
                  <Lock />
                  <input
                    className="input input-pad-right"
                    name="password"
                    placeholder="••••••••"
                    required
                    type={showPassword ? 'text' : 'password'}
                  />
                  <button
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="input-toggle"
                    onClick={() => setShowPassword((value) => !value)}
                    type="button"
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>
              </label>
              <Button disabled={busy} size="lg" type="submit">
                {busy ? 'Signing in…' : 'Login'}
              </Button>
            </form>
          ) : (
            <form className="auth-form" onSubmit={handleRegister}>
              <label className="field">
                <span className="field-label">
                  <User />
                  Full name
                </span>
                <div className="input-wrap">
                  <User />
                  <input className="input" name="fullName" placeholder="Samyak Jain" required />
                </div>
              </label>
              <label className="field">
                <span className="field-label">
                  <AtSign />
                  Username
                </span>
                <div className="input-wrap">
                  <AtSign />
                  <input className="input" name="username" placeholder="samyak" required />
                </div>
              </label>
              <label className="field">
                <span className="field-label">
                  <Mail />
                  Email
                </span>
                <div className="input-wrap">
                  <Mail />
                  <input className="input" name="email" placeholder="you@example.com" required type="email" />
                </div>
              </label>
              <label className="field">
                <span className="field-label">
                  <Lock />
                  Password
                </span>
                <div className="input-wrap">
                  <Lock />
                  <input
                    className="input input-pad-right"
                    name="password"
                    placeholder="Create a password"
                    required
                    type={showPassword ? 'text' : 'password'}
                  />
                  <button
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="input-toggle"
                    onClick={() => setShowPassword((value) => !value)}
                    type="button"
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>
              </label>
              <div className="field">
                <span className="field-label">
                  <Image />
                  Avatar
                </span>
                <FileDrop accept="image/*" label="Choose an avatar" name="avatar" required />
              </div>
              <div className="field">
                <span className="field-label">
                  <Image />
                  Cover image
                </span>
                <FileDrop accept="image/*" label="Choose a cover image" name="coverImage" />
              </div>
              <Button disabled={busy} size="lg" type="submit">
                {busy ? 'Creating account…' : 'Create account'}
              </Button>
            </form>
          )}

          <Notice message={message} />

          <p className="auth-alt">
            {mode === 'login' ? 'New to Ventiq? ' : 'Already have an account? '}
            <button onClick={() => switchMode(mode === 'login' ? 'signup' : 'login')} type="button">
              {mode === 'login' ? 'Create an account' : 'Sign in'}
            </button>
          </p>
        </div>
      </section>
    </main>
  )
}
