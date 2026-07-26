import { useEffect, useState } from 'react'
import { api } from '../api/client'
import { VideoCard } from '../components/VideoCard'
import { useAuth } from '../hooks/useAuth'

export function Studio() {
  const { user } = useAuth()
  const [videos, setVideos] = useState([])
  const [editingVideo, setEditingVideo] = useState(null)
  const [message, setMessage] = useState('')

  useEffect(() => {
    let isMounted = true

    async function loadVideos() {
      try {
        const data = await api.videos.list({ userId: user._id, limit: 50 })
        if (isMounted) setVideos(data.videos || [])
      } catch (err) {
        if (isMounted) setMessage(err.message)
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
      setMessage('Video updated.')
    } catch (err) {
      setMessage(err.message)
    }
  }

  async function deleteVideo(videoId) {
    try {
      await api.videos.delete(videoId)
      setVideos((current) => current.filter((video) => video._id !== videoId))
      setMessage('Video deleted.')
    } catch (err) {
      setMessage(err.message)
    }
  }

  async function togglePublish(videoId) {
    try {
      const updatedVideo = await api.videos.togglePublish(videoId)
      setVideos((current) => current.map((video) => (video._id === videoId ? updatedVideo : video)))
      setMessage(updatedVideo.isPublished ? 'Video published.' : 'Video unpublished.')
    } catch (err) {
      setMessage(err.message)
    }
  }

  return (
    <section className="studio-layout">
      <div className="workspace-panel">
        <h2>Your videos</h2>
        <div className="video-grid compact">
          {videos.map((video) => (
            <article className="manage-card" key={video._id}>
              <VideoCard onLike={() => {}} onSelect={() => setEditingVideo(video)} video={video} />
              <div className="manage-actions">
                <button className="tiny-button" onClick={() => setEditingVideo(video)} type="button">Edit</button>
                <button className="tiny-button" onClick={() => togglePublish(video._id)} type="button">
                  {video.isPublished ? 'Unpublish' : 'Publish'}
                </button>
                <button className="tiny-button danger" onClick={() => deleteVideo(video._id)} type="button">Delete</button>
              </div>
            </article>
          ))}
        </div>
      </div>

      <aside className="workspace-panel">
        <h2>Edit video</h2>
        {editingVideo ? (
          <form className="form-stack" onSubmit={updateVideo}>
            <label>
              Title
              <input defaultValue={editingVideo.title} name="title" required />
            </label>
            <label>
              Description
              <textarea defaultValue={editingVideo.description} name="description" required />
            </label>
            <label>
              Thumbnail
              <input accept="image/*" name="thumbnail" type="file" />
            </label>
            <button className="primary-button" type="submit">Save video</button>
          </form>
        ) : (
          <p className="muted-text">Select a video to edit metadata, thumbnail, publish status, or delete it.</p>
        )}
        {message ? <p className="status-message">{message}</p> : null}
      </aside>
    </section>
  )
}
