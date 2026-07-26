import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../api/client'
import { VideoCard } from '../components/VideoCard'
import { useAuth } from '../hooks/useAuth'

export function PlaylistDetail() {
  const { playlistId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [playlist, setPlaylist] = useState(null)
  const [message, setMessage] = useState('')

  useEffect(() => {
    let isMounted = true

    async function loadPlaylist() {
      try {
        const data = await api.playlists.get(playlistId)
        if (isMounted) setPlaylist(data)
      } catch (err) {
        if (isMounted) setMessage(err.message)
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
      setMessage('Playlist updated.')
    } catch (err) {
      setMessage(err.message)
    }
  }

  async function deletePlaylist() {
    try {
      await api.playlists.delete(playlistId)
      navigate('/library')
    } catch (err) {
      setMessage(err.message)
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
      setMessage(err.message)
    }
  }

  if (!playlist) {
    return <p className="status-message">{message || 'Loading playlist...'}</p>
  }

  const ownsPlaylist = playlist.owner?._id === user._id

  return (
    <section className="studio-layout">
      <div className="workspace-panel">
        <h2>{playlist.name}</h2>
        <p className="muted-text">{playlist.description}</p>
        <p className="muted-text">{playlist.totalVideos || 0} videos</p>
        <div className="video-grid compact">
          {playlist.videos?.map((video) => (
            <article className="manage-card" key={video._id}>
              <VideoCard
                onLike={(videoId) => api.likes.toggleVideo(videoId)}
                onSelect={(selected) => navigate(`/watch/${selected._id}`)}
                video={video}
              />
              {ownsPlaylist ? (
                <div className="manage-actions">
                  <button className="tiny-button danger" onClick={() => removeVideo(video._id)} type="button">Remove</button>
                </div>
              ) : null}
            </article>
          ))}
        </div>
      </div>

      {ownsPlaylist ? (
        <aside className="workspace-panel">
          <h2>Manage playlist</h2>
          <form className="form-stack" onSubmit={updatePlaylist}>
            <label>
              Name
              <input defaultValue={playlist.name} name="name" required />
            </label>
            <label>
              Description
              <textarea defaultValue={playlist.description} name="description" />
            </label>
            <button className="primary-button" type="submit">Save playlist</button>
            <button className="ghost-button danger" onClick={deletePlaylist} type="button">Delete playlist</button>
          </form>
          {message ? <p className="status-message">{message}</p> : null}
        </aside>
      ) : null}
    </section>
  )
}
