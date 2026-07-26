import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'

export function AuthForms() {
  const { login, register } = useAuth()
  const [mode, setMode] = useState('login')
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')

  async function handleLogin(event) {
    event.preventDefault()
    setBusy(true)
    setMessage('')

    const form = new FormData(event.currentTarget)
    try {
      await login({
        email: form.get('emailOrUsername').includes('@') ? form.get('emailOrUsername') : '',
        username: form.get('emailOrUsername').includes('@') ? '' : form.get('emailOrUsername'),
        password: form.get('password'),
      })
    } catch (err) {
      setMessage(err.message)
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
      setMessage('Account created. Sign in to continue.')
      setMode('login')
    } catch (err) {
      setMessage(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <main className="auth-screen">
      <section className="auth-copy">
        <div className="brand large">
          <span className="brand-mark">V</span>
          <span>Ventiq</span>
        </div>
        <h1>Video, conversation, and community in one flow.</h1>
        <p>Use the backend auth, media upload, tweet, comment, like, subscription, and playlist APIs from a single React surface.</p>
      </section>

      <section className="auth-panel">
        <div className="segmented-control">
          <button className={mode === 'login' ? 'active' : ''} onClick={() => setMode('login')} type="button">Login</button>
          <button className={mode === 'signup' ? 'active' : ''} onClick={() => setMode('signup')} type="button">Signup</button>
        </div>

        {mode === 'login' ? (
          <form className="form-stack" onSubmit={handleLogin}>
            <label>
              Email or username
              <input name="emailOrUsername" placeholder="samyak or samyak@example.com" required />
            </label>
            <label>
              Password
              <input name="password" required type="password" />
            </label>
            <button className="primary-button" disabled={busy} type="submit">{busy ? 'Signing in...' : 'Login'}</button>
          </form>
        ) : (
          <form className="form-stack" onSubmit={handleRegister}>
            <label>
              Full name
              <input name="fullName" required />
            </label>
            <label>
              Username
              <input name="username" required />
            </label>
            <label>
              Email
              <input name="email" required type="email" />
            </label>
            <label>
              Password
              <input name="password" required type="password" />
            </label>
            <label>
              Avatar
              <input accept="image/*" name="avatar" required type="file" />
            </label>
            <label>
              Cover image
              <input accept="image/*" name="coverImage" type="file" />
            </label>
            <button className="primary-button" disabled={busy} type="submit">{busy ? 'Creating...' : 'Create account'}</button>
          </form>
        )}

        {message ? <p className="form-message">{message}</p> : null}
      </section>
    </main>
  )
}
