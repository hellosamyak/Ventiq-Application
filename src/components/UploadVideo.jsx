import { useState } from 'react'
import { api } from '../api/client'

export function UploadVideo({ onUploaded }) {
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')

  async function handleSubmit(event) {
    event.preventDefault()
    setBusy(true)
    setMessage('')

    try {
      const data = await api.videos.publish(new FormData(event.currentTarget))
      event.currentTarget.reset()
      setMessage('Video uploaded.')
      onUploaded?.(data)
    } catch (err) {
      setMessage(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className="workspace-panel">
      <h2>Upload video</h2>
      <form className="form-grid" onSubmit={handleSubmit}>
        <label>
          Title
          <input name="title" required />
        </label>
        <label>
          Description
          <textarea name="description" required />
        </label>
        <label>
          Video file
          <input accept="video/*" name="videoFile" required type="file" />
        </label>
        <label>
          Thumbnail
          <input accept="image/*" name="thumbnail" required type="file" />
        </label>
        <button className="primary-button" disabled={busy} type="submit">{busy ? 'Uploading...' : 'Publish video'}</button>
      </form>
      {message ? <p className="form-message">{message}</p> : null}
    </section>
  )
}
