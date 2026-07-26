import { useState } from 'react'

export function TweetComposer({ onCreate }) {
  const [content, setContent] = useState('')
  const [busy, setBusy] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    if (!content.trim()) return
    setBusy(true)
    try {
      await onCreate(content)
      setContent('')
    } finally {
      setBusy(false)
    }
  }

  return (
    <form className="composer" onSubmit={handleSubmit}>
      <textarea
        maxLength="280"
        onChange={(event) => setContent(event.target.value)}
        placeholder="Share a thought with your channel..."
        value={content}
      />
      <div>
        <span>{content.length}/280</span>
        <button className="primary-button small" disabled={busy} type="submit">{busy ? 'Posting...' : 'Post'}</button>
      </div>
    </form>
  )
}
