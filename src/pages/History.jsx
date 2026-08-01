import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Clock } from 'lucide-react'
import { api } from '../api/client'
import { VideoCard } from '../components/VideoCard'
import { EmptyState, Notice, SkeletonCard } from '../components/ui'

export function History() {
  const navigate = useNavigate()
  const [videos, setVideos] = useState([])
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    async function loadHistory() {
      setLoading(true)
      try {
        const data = await api.users.history()
        if (isMounted) setVideos(data || [])
      } catch (err) {
        if (isMounted) setMessage({ text: err.message, tone: 'error' })
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    loadHistory()

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <section className="grid gap-5">
      <Notice message={message} />

      {loading ? (
        <div className="grid-cards">
          {Array.from({ length: 6 }).map((_, index) => <SkeletonCard key={index} />)}
        </div>
      ) : videos.length ? (
        <div className="grid-cards">
          {videos.map((video) => (
            <VideoCard
              key={video._id}
              onLike={(videoId) => api.likes.toggleVideo(videoId)}
              onSelect={(video) => navigate(`/watch/${video._id}`)}
              video={video}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<Clock />}
          title="No watch history yet"
          description="Videos you open will show up here so you can pick up where you left off."
        />
      )}
    </section>
  )
}
