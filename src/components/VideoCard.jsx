export function VideoCard({ video, onSelect, onLike }) {
  return (
    <article className="video-card">
      <button className="video-thumb" onClick={() => onSelect(video)} type="button">
        <img alt={video.title} src={video.thumbnail} />
        <span>{formatDuration(video.duration)}</span>
      </button>
      <div className="video-meta">
        <img alt="" src={video.owner?.avatar} />
        <div>
          <button className="link-title" onClick={() => onSelect(video)} type="button">{video.title}</button>
          <p>{video.owner?.fullName} - {video.views ?? 0} views</p>
          <button className="tiny-button" onClick={() => onLike(video._id)} type="button">Like</button>
        </div>
      </div>
    </article>
  )
}

function formatDuration(duration = 0) {
  const minutes = Math.floor(duration / 60)
  const seconds = Math.floor(duration % 60).toString().padStart(2, '0')
  return `${minutes}:${seconds}`
}
