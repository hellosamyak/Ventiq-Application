import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ListVideo, PenLine, Play, Trash2 } from 'lucide-react'
import { api } from '../api/client'
import { VideoCard } from '../components/VideoCard'
import { Button, EmptyState, Notice, SkeletonCard } from '../components/ui'
import { useAuth } from '../hooks/useAuth'

export function PlaylistDetail() {
  const { playlistId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [playlist, setPlaylist] = useState(null)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    async function loadPlaylist() {
      setLoading(true)
      try {
        const data = await api.playlists.get(playlistId)
        if (isMounted) setPlaylist(data)
      } catch (err) {
        if (isMounted) setMessage({ text: err.message, tone: 'error' })
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    loadPlaylist()

    return () => {
      isMounted = false
    }
  }, [playlistId])

  async function updatePlaylist(event) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    try {
      const updatedPlaylist = await api.playlists.update(playlistId, {
        name: form.get('name'),
        description: form.get('description'),
      })
      setPlaylist((current) => current ? { ...current, ...updatedPlaylist } : updatedPlaylist)
      setMessage({ text: 'Playlist updated.', tone: 'success' })
    } catch (err) {
      setMessage({ text: err.message, tone: 'error' })
    }
  }

  async function deletePlaylist() {
    try {
      await api.playlists.delete(playlistId)
      navigate('/library')
    } catch (err) {
      setMessage({ text: err.message, tone: 'error' })
    }
  }

  async function removeVideo(videoId) {
    try {
      await api.playlists.removeVideo(videoId, playlistId)
      setPlaylist((current) => current ? {
        ...current,
        videos: current.videos.filter((video) => video._id !== videoId),
        totalVideos: Math.max((current.totalVideos || 1) - 1, 0),
      } : current)
    } catch (err) {
      setMessage({ text: err.message, tone: 'error' })
    }
  }

  if (loading) {
    return (
      <div className="grid-cards compact">
        {Array.from({ length: 6 }).map((_, index) => <SkeletonCard key={index} />)}
      </div>
    )
  }

  if (!playlist) {
    return <Notice message={message || { text: 'Playlist not found.', tone: 'error' }} />
  }

  const ownsPlaylist = playlist.owner?._id === user._id

  return (
    <section className="grid-panels">
      <div className="grid gap-5 min-w-0">
        <div className="card card-pad-lg">
          <div className="flex items-center gap-4">
            <span className="empty-icon">
              <ListVideo />
            </span>
            <div style={{ minWidth: 0 }}>
              <h2 style={{ margin: 0, fontSize: '22px' }}>{playlist.name}</h2>
              <p className="muted" style={{ margin: '4px 0 0', fontSize: '14px' }}>
                {playlist.description || 'No description added yet.'}
              </p>
              <p className="muted" style={{ margin: '3px 0 0', fontSize: '12.5px' }}>
                {playlist.totalVideos || 0} videos
              </p>
            </div>
          </div>
        </div>

        {playlist.videos?.length ? (
          <div className="grid-cards compact">
            {playlist.videos.map((video) => (
              <article className="manage-card" key={video._id}>
                <VideoCard
                  onLike={(videoId) => api.likes.toggleVideo(videoId)}
                  onSelect={(selected) => navigate(`/watch/${selected._id}`)}
                  video={video}
                />
                {ownsPlaylist ? (
                  <div className="manage-actions">
                    <Button size="sm" type="button" variant="danger" onClick={() => removeVideo(video._id)}>
                      <Trash2 />
                      Remove
                    </Button>
                  </div>
                ) : null}
              </article>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<Play />}
            title="This playlist is empty"
            description="Add videos from the watch page and they will appear here."
          />
        )}
      </div>

      {ownsPlaylist ? (
        <aside className="card section-card edit-aside">
          <div className="section-header">
            <h2 className="section-title">
              <PenLine />
              Manage playlist
            </h2>
          </div>
          <form className="grid gap-4" onSubmit={updatePlaylist}>
            <label className="field">
              <span className="field-label">Name</span>
              <input className="input" defaultValue={playlist.name} name="name" required />
            </label>
            <label className="field">
              <span className="field-label">Description</span>
              <textarea className="input" defaultValue={playlist.description} name="description" />
            </label>
            <Button size="sm" type="submit">
              Save playlist
            </Button>
            <Button size="sm" type="button" variant="solid-danger" onClick={deletePlaylist}>
              <Trash2 />
              Delete playlist
            </Button>
          </form>
          <div className="mt-3">
            <Notice message={message} />
          </div>
        </aside>
      ) : (
        <Notice message={message} />
      )}
    </section>
  )
}
