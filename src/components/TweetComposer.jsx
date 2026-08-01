import { useState } from 'react'
import { Send } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { Button } from './ui/Button'

const LIMIT = 280

export function TweetComposer({ onCreate }) {
  const { user } = useAuth()
  const [content, setContent] = useState('')
  const [busy, setBusy] = useState(false)
  const remaining = LIMIT - content.length

  async function handleSubmit(event) {
    event.preventDefault()
    if (!content.trim() || busy) return
    setBusy(true)
    try {
      await onCreate(content)
      setContent('')
    } finally {
      setBusy(false)
    }
  }

  return (
    <form className="card composer" onSubmit={handleSubmit}>
      <div className="flex items-start gap-3">
        <img alt={user?.fullName || 'Your avatar'} className="avatar avatar-md" loading="lazy" src={user?.avatar} />
        <textarea
          className="input"
          maxLength={LIMIT}
          onChange={(event) => setContent(event.target.value)}
          placeholder="Share a thought with your channel..."
          rows={3}
          value={content}
        />
      </div>
      <div className="composer-footer">
        <span className={`char-count ${remaining <= 20 ? (remaining <= 0 ? 'limit' : 'near') : ''}`}>
          {remaining} characters left
        </span>
        <Button disabled={busy || !content.trim()} size="sm" type="submit">
          <Send />
          {busy ? 'Posting…' : 'Post'}
        </Button>
      </div>
    </form>
  )
}
