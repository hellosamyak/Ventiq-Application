import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api/client'
import { VideoCard } from '../components/VideoCard'

export function History() {
  const navigate = useNavigate()
  const [videos, setVideos] = useState([])
  const [message, setMessage] = useState('')

  useEffect(() => {
    let isMounted = true

    async function loadHistory() {
      try {
        const data = await api.users.history()
        if (isMounted) setVideos(data || [])
      } catch (err) {
        if (isMounted) setMessage(err.message)
      }
    }

    loadHistory()

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <section className="feed-layout">
      {message ? <p className="status-message">{message}</p> : null}
      <div className="video-grid">
        {videos.map((video) => (
          <VideoCard
            key={video._id}
            onLike={(videoId) => api.likes.toggleVideo(videoId)}
            onSelect={(video) => navigate(`/watch/${video._id}`)}
            video={video}
          />
        ))}
      </div>
    </section>
  )
}
