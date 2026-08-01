import { useState } from 'react'
import { Camera, KeyRound, Mail, Shield, User, UserRound } from 'lucide-react'
import { api } from '../api/client'
import { Button, FileDrop, Notice } from '../components/ui'
import { useAuth } from '../hooks/useAuth'

export function AccountCenter() {
  const { user, refreshUser, setCurrentUser } = useAuth()
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState('')

  async function handleAccountDetails(event) {
    event.preventDefault()
    setBusy('details')
    setMessage('')

    const form = new FormData(event.currentTarget)
    try {
      const updatedUser = await api.auth.updateAccount({
        fullName: form.get('fullName'),
        email: form.get('email'),
      })
      setCurrentUser(updatedUser)
      setMessage({ text: 'Account details updated.', tone: 'success' })
    } catch (err) {
      setMessage({ text: err.message, tone: 'error' })
    } finally {
      setBusy('')
    }
  }

  async function handlePassword(event) {
    event.preventDefault()
    setBusy('password')
    setMessage('')

    const form = new FormData(event.currentTarget)
    try {
      await api.auth.changePassword({
        oldPassword: form.get('oldPassword'),
        newPassword: form.get('newPassword'),
      })
      event.currentTarget.reset()
      setMessage({ text: 'Password changed.', tone: 'success' })
    } catch (err) {
      setMessage({ text: err.message, tone: 'error' })
    } finally {
      setBusy('')
    }
  }

  async function handleImageUpload(event, type) {
    event.preventDefault()
    setBusy(type)
    setMessage('')

    try {
      const formData = new FormData(event.currentTarget)
      const updatedUser = type === 'avatar'
        ? await api.auth.updateAvatar(formData)
        : await api.auth.updateCoverImage(formData)
      setCurrentUser(updatedUser)
      event.currentTarget.reset()
      setMessage({ text: `${type === 'avatar' ? 'Avatar' : 'Cover image'} updated.`, tone: 'success' })
      await refreshUser()
    } catch (err) {
      setMessage({ text: err.message, tone: 'error' })
    } finally {
      setBusy('')
    }
  }

  return (
    <section className="grid-panels">
      <div className="profile-preview">
        <div className="cover-preview">
          {user?.coverImage ? <img alt="" src={user.coverImage} /> : null}
        </div>
        <img alt={user?.fullName || 'Your avatar'} className="avatar-preview avatar-xl" loading="lazy" src={user?.avatar} />
        <div style={{ textAlign: 'center', padding: '4px 20px 24px' }}>
          <h2 style={{ margin: 0, fontSize: '20px' }}>{user?.fullName}</h2>
          <p className="muted" style={{ margin: '4px 0 0', fontSize: '13.5px' }}>@{user?.username}</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '12px' }}>
            <span className="badge badge-primary">
              <Shield />
              Creator
            </span>
          </div>
          <p className="muted" style={{ margin: '14px 0 0', fontSize: '13px', overflowWrap: 'anywhere' }}>
            {user?.email}
          </p>
        </div>
      </div>

      <div className="grid gap-5">
        <Notice message={message} />

        <div className="settings-grid">
          <section className="card section-card">
            <div className="section-header">
              <h2 className="section-title">
                <User />
                Account details
              </h2>
            </div>
            <form className="grid gap-4" onSubmit={handleAccountDetails}>
              <label className="field">
                <span className="field-label">Full name</span>
                <div className="input-wrap">
                  <User />
                  <input className="input" defaultValue={user?.fullName} name="fullName" required />
                </div>
              </label>
              <label className="field">
                <span className="field-label">Email</span>
                <div className="input-wrap">
                  <Mail />
                  <input className="input" defaultValue={user?.email} name="email" required type="email" />
                </div>
              </label>
              <Button disabled={busy === 'details'} size="sm" type="submit">
                {busy === 'details' ? 'Saving…' : 'Save details'}
              </Button>
            </form>
          </section>

          <section className="card section-card">
            <div className="section-header">
              <h2 className="section-title">
                <KeyRound />
                Password
              </h2>
            </div>
            <form className="grid gap-4" onSubmit={handlePassword}>
              <label className="field">
                <span className="field-label">Current password</span>
                <input className="input" name="oldPassword" required type="password" />
              </label>
              <label className="field">
                <span className="field-label">New password</span>
                <input className="input" name="newPassword" required type="password" />
              </label>
              <Button disabled={busy === 'password'} size="sm" type="submit">
                {busy === 'password' ? 'Changing…' : 'Change password'}
              </Button>
            </form>
          </section>

          <section className="card section-card">
            <div className="section-header">
              <h2 className="section-title">
                <Camera />
                Avatar
              </h2>
            </div>
            <form className="grid gap-4" onSubmit={(event) => handleImageUpload(event, 'avatar')}>
              <FileDrop accept="image/*" label="Choose an avatar" name="avatar" required />
              <Button disabled={busy === 'avatar'} size="sm" type="submit">
                {busy === 'avatar' ? 'Uploading…' : 'Update avatar'}
              </Button>
            </form>
          </section>

          <section className="card section-card">
            <div className="section-header">
              <h2 className="section-title">
                <UserRound />
                Cover image
              </h2>
            </div>
            <form className="grid gap-4" onSubmit={(event) => handleImageUpload(event, 'cover')}>
              <FileDrop accept="image/*" hint="Landscape, 1280×360 recommended" label="Choose a cover image" name="coverImage" required />
              <Button disabled={busy === 'cover'} size="sm" type="submit">
                {busy === 'cover' ? 'Uploading…' : 'Update cover'}
              </Button>
            </form>
          </section>
        </div>
      </div>
    </section>
  )
}
