import { useState } from 'react'
import { Heart, Play } from 'lucide-react'

export function VideoCard({ video, onSelect, onLike }) {
  const [liked, setLiked] = useState(Boolean(video?.isLiked))

  function handleLike() {
    setLiked((value) => !value)
    onLike?.(video._id)
  }

  return (
    <article className="video-card">
      <button
        aria-label={`Play ${video.title}`}
        className="thumb"
        onClick={() => onSelect(video)}
        type="button"
      >
        <img alt={video.title} loading="lazy" src={video.thumbnail} />
        <span className="thumb-overlay">
          <span className="play-badge">
            <Play />
          </span>
        </span>
        <span className="duration-badge">{formatDuration(video.duration)}</span>
      </button>

      <div className="video-body">
        <img alt={video.owner?.fullName || 'Creator avatar'} className="avatar avatar-sm" loading="lazy" src={video.owner?.avatar} />
        <div className="video-meta">
          <button className="video-title" onClick={() => onSelect(video)} type="button">
            {video.title}
          </button>
          <p className="video-sub">
            {video.owner?.fullName} · {formatViews(video.views ?? 0)} views
          </p>
        </div>
        <button aria-label="Like" className={`like-btn ${liked ? 'liked' : ''}`} onClick={handleLike} type="button">
          <Heart />
        </button>
      </div>
    </article>
  )
}

function formatDuration(duration = 0) {
  const minutes = Math.floor(duration / 60)
  const seconds = Math.floor(duration % 60).toString().padStart(2, '0')
  return `${minutes}:${seconds}`
}

function formatViews(views) {
  if (views >= 1000) {
    const value = views / 1000
    return `${value >= 100 ? Math.round(value) : value.toFixed(1)}K`
  }
  return `${views}`
}
