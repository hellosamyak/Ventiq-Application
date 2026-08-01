import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Edit3, Film, Rocket, Trash2, X } from 'lucide-react'
import { api } from '../api/client'
import { VideoCard } from '../components/VideoCard'
import { Button, EmptyState, FileDrop, Notice, SkeletonCard } from '../components/ui'
import { useAuth } from '../hooks/useAuth'

export function Studio() {
  const { user } = useAuth()
  const [videos, setVideos] = useState([])
  const [editingVideo, setEditingVideo] = useState(null)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    async function loadVideos() {
      setLoading(true)
      try {
        const data = await api.videos.list({ userId: user._id, limit: 50 })
        if (isMounted) setVideos(data.videos || [])
      } catch (err) {
        if (isMounted) setMessage({ text: err.message, tone: 'error' })
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    loadVideos()

    return () => {
      isMounted = false
    }
  }, [user._id])

  async function updateVideo(event) {
    event.preventDefault()
    if (!editingVideo) return

    const formData = new FormData(event.currentTarget)
    try {
      const updatedVideo = await api.videos.update(editingVideo._id, formData)
      setVideos((current) => current.map((video) => (video._id === updatedVideo._id ? updatedVideo : video)))
      setEditingVideo(null)
      setMessage({ text: 'Video updated.', tone: 'success' })
    } catch (err) {
      setMessage({ text: err.message, tone: 'error' })
    }
  }

  async function deleteVideo(videoId) {
    try {
      await api.videos.delete(videoId)
      setVideos((current) => current.filter((video) => video._id !== videoId))
      setMessage({ text: 'Video deleted.', tone: 'success' })
    } catch (err) {
      setMessage({ text: err.message, tone: 'error' })
    }
  }

  async function togglePublish(videoId) {
    try {
      const updatedVideo = await api.videos.togglePublish(videoId)
      setVideos((current) => current.map((video) => (video._id === videoId ? updatedVideo : video)))
      setMessage({ text: updatedVideo.isPublished ? 'Video published.' : 'Video unpublished.', tone: 'success' })
    } catch (err) {
      setMessage({ text: err.message, tone: 'error' })
    }
  }

  return (
    <section className="grid-panels">
      <div className="grid gap-5 min-w-0">
        <Notice message={message} />

        <div className="card section-card">
          <div className="section-header">
            <h2 className="section-title">
              <Film />
              Your videos
            </h2>
            <span className="badge badge-neutral">{videos.length} total</span>
          </div>

          {loading ? (
            <div className="grid-cards compact">
              {Array.from({ length: 6 }).map((_, index) => <SkeletonCard key={index} />)}
            </div>
          ) : videos.length ? (
            <div className="grid-cards compact">
              {videos.map((video) => (
                <article className="manage-card" key={video._id}>
                  <VideoCard onLike={() => {}} onSelect={() => setEditingVideo(video)} video={video} />
                  <div className="manage-actions">
                    <Button size="sm" type="button" variant="secondary" onClick={() => setEditingVideo(video)}>
                      <Edit3 />
                      Edit
                    </Button>
                    <Button size="sm" type="button" variant="secondary" onClick={() => togglePublish(video._id)}>
                      {video.isPublished ? <Rocket /> : <X />}
                      {video.isPublished ? 'Unpublish' : 'Publish'}
                    </Button>
                    <Button size="sm" type="button" variant="danger" onClick={() => deleteVideo(video._id)}>
                      <Trash2 />
                      Delete
                    </Button>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={<Film />}
              title="No videos yet"
              description="Publish your first video and it will appear here."
              action={<Link className="btn btn-primary btn-sm" to="/upload">Publish a video</Link>}
            />
          )}
        </div>
      </div>

      <aside className="card section-card edit-aside">
        <div className="section-header">
          <h2 className="section-title">
            <Edit3 />
            Edit video
          </h2>
        </div>
        {editingVideo ? (
          <form className="grid gap-4" onSubmit={updateVideo}>
            <label className="field">
              <span className="field-label">Title</span>
              <input className="input" defaultValue={editingVideo.title} name="title" required />
            </label>
            <label className="field">
              <span className="field-label">Description</span>
              <textarea className="input" defaultValue={editingVideo.description} name="description" required />
            </label>
            <div className="field">
              <span className="field-label">Thumbnail</span>
              <FileDrop accept="image/*" label="Replace thumbnail" name="thumbnail" />
            </div>
            <div className="flex gap-3">
              <Button size="md" type="submit">
                Save video
              </Button>
              <Button size="md" type="button" variant="secondary" onClick={() => setEditingVideo(null)}>
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          <EmptyState
            icon={<Edit3 />}
            title="Nothing selected"
            description="Select a video to edit metadata, thumbnail, publish status, or delete it."
          />
        )}
      </aside>
    </section>
  )
}
