import { useState } from 'react'
import { Rocket } from 'lucide-react'
import { api } from '../api/client'
import { Button } from './ui/Button'
import { FileDrop } from './ui/FileDrop'
import { Notice } from './ui/Notice'

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
      setMessage({ text: 'Video published successfully.', tone: 'success' })
      onUploaded?.(data)
    } catch (err) {
      setMessage({ text: err.message, tone: 'error' })
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className="card card-pad-lg">
      <div className="section-header">
        <h2 className="section-title">
          <Rocket />
          Publish a new video
        </h2>
      </div>

      <form className="grid gap-5" onSubmit={handleSubmit}>
        <div className="grid gap-5 md:grid-cols-2">
          <label className="field">
            <span className="field-label">Title</span>
            <input className="input" name="title" placeholder="A clear, honest title" required />
          </label>
          <label className="field">
            <span className="field-label">Description</span>
            <textarea className="input" name="description" placeholder="What is this video about?" required />
          </label>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div className="field">
            <span className="field-label">Video file</span>
            <FileDrop accept="video/*" hint="MP4, MOV or WebM" label="Choose a video" name="videoFile" required variant="video" />
          </div>
          <div className="field">
            <span className="field-label">Thumbnail</span>
            <FileDrop accept="image/*" hint="16:9, at least 1280×720" label="Choose a thumbnail" name="thumbnail" required />
          </div>
        </div>

        <div>
          <Button disabled={busy} size="lg" type="submit">
            <Rocket />
            {busy ? 'Uploading…' : 'Publish video'}
          </Button>
        </div>
      </form>

      {message ? (
        <div className="mt-4">
          <Notice message={message} />
        </div>
      ) : null}
    </section>
  )
}
