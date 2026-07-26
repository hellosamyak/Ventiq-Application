import { useState } from 'react'
import { api } from '../api/client'
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
      setMessage('Account details updated.')
    } catch (err) {
      setMessage(err.message)
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
      setMessage('Password changed.')
    } catch (err) {
      setMessage(err.message)
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
      setMessage(`${type === 'avatar' ? 'Avatar' : 'Cover image'} updated.`)
      await refreshUser()
    } catch (err) {
      setMessage(err.message)
    } finally {
      setBusy('')
    }
  }

  return (
    <section className="account-layout">
      <div className="profile-preview">
        <div className="cover-preview">
          {user?.coverImage ? <img alt="" src={user.coverImage} /> : null}
        </div>
        <img alt="" className="avatar-preview" src={user?.avatar} />
        <h2>{user?.fullName}</h2>
        <p>@{user?.username}</p>
        <p>{user?.email}</p>
      </div>

      <div className="settings-grid">
        <section className="workspace-panel">
          <h2>Account details</h2>
          <form className="form-stack" onSubmit={handleAccountDetails}>
            <label>
              Full name
              <input defaultValue={user?.fullName} name="fullName" required />
            </label>
            <label>
              Email
              <input defaultValue={user?.email} name="email" required type="email" />
            </label>
            <button className="primary-button" disabled={busy === 'details'} type="submit">
              {busy === 'details' ? 'Saving...' : 'Save details'}
            </button>
          </form>
        </section>

        <section className="workspace-panel">
          <h2>Password</h2>
          <form className="form-stack" onSubmit={handlePassword}>
            <label>
              Current password
              <input name="oldPassword" required type="password" />
            </label>
            <label>
              New password
              <input name="newPassword" required type="password" />
            </label>
            <button className="primary-button" disabled={busy === 'password'} type="submit">
              {busy === 'password' ? 'Changing...' : 'Change password'}
            </button>
          </form>
        </section>

        <section className="workspace-panel">
          <h2>Avatar</h2>
          <form className="form-stack" onSubmit={(event) => handleImageUpload(event, 'avatar')}>
            <label>
              Avatar image
              <input accept="image/*" name="avatar" required type="file" />
            </label>
            <button className="primary-button" disabled={busy === 'avatar'} type="submit">
              {busy === 'avatar' ? 'Uploading...' : 'Update avatar'}
            </button>
          </form>
        </section>

        <section className="workspace-panel">
          <h2>Cover image</h2>
          <form className="form-stack" onSubmit={(event) => handleImageUpload(event, 'cover')}>
            <label>
              Cover image
              <input accept="image/*" name="coverImage" required type="file" />
            </label>
            <button className="primary-button" disabled={busy === 'cover'} type="submit">
              {busy === 'cover' ? 'Uploading...' : 'Update cover'}
            </button>
          </form>
        </section>
      </div>

      {message ? <p className="status-message">{message}</p> : null}
    </section>
  )
}
