import { useCallback, useEffect, useState } from 'react'
import { api } from '../api/client'
import { TweetComposer } from '../components/TweetComposer'
import { UploadVideo } from '../components/UploadVideo'
import { VideoCard } from '../components/VideoCard'
import { useAuth } from '../hooks/useAuth'

export function Dashboard({ activeView, setActiveView }) {
  const { user } = useAuth()
  const [videos, setVideos] = useState([])
  const [tweets, setTweets] = useState([])
  const [playlists, setPlaylists] = useState([])
  const [likedVideos, setLikedVideos] = useState([])
  const [selectedVideo, setSelectedVideo] = useState(null)
  const [comments, setComments] = useState([])
  const [commentText, setCommentText] = useState('')
  const [query, setQuery] = useState('')
  const [message, setMessage] = useState('')

  const loadVideos = useCallback(async (search = query) => {
    const data = await api.videos.list({ query: search, limit: 12 })
    setVideos(data.videos || [])
  }, [query])

  useEffect(() => {
    let isMounted = true

    async function initializeVideos() {
      try {
        const data = await api.videos.list({ query, limit: 12 })
        if (isMounted) setVideos(data.videos || [])
      } catch (err) {
        if (isMounted) setMessage(err.message)
      }
    }

    initializeVideos()

    return () => {
      isMounted = false
    }
  }, [query])

  useEffect(() => {
    let isMounted = true

    async function loadActiveViewData() {
      try {
        if (activeView === 'tweets') {
          const data = await api.tweets.byUser(user._id)
          if (isMounted) setTweets(data || [])
        }

        if (activeView === 'library') {
          const [playlistData, likedData] = await Promise.all([
            api.playlists.byUser(user._id),
            api.likes.likedVideos(),
          ])
          if (!isMounted) return
          setPlaylists(playlistData || [])
          setLikedVideos((likedData || []).map((item) => item.video).filter(Boolean))
        }
      } catch (err) {
        if (isMounted) setMessage(err.message)
      }
    }

    loadActiveViewData()

    return () => {
      isMounted = false
    }
  }, [activeView, user._id])

  async function selectVideo(video) {
    try {
      const data = await api.videos.get(video._id)
      setSelectedVideo(data)
      setActiveView('watch')
      const commentData = await api.comments.byVideo(video._id, { limit: 20 })
      setComments(commentData.docs || [])
    } catch (err) {
      setMessage(err.message)
    }
  }

  async function createTweet(content) {
    const tweet = await api.tweets.create(content)
    setTweets((current) => [tweet, ...current])
  }

  async function addComment(event) {
    event.preventDefault()
    if (!selectedVideo || !commentText.trim()) return
    try {
      const comment = await api.comments.add(selectedVideo._id, commentText)
      setComments((current) => [comment, ...current])
      setCommentText('')
    } catch (err) {
      setMessage(err.message)
    }
  }

  async function createPlaylist(event) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    try {
      const playlist = await api.playlists.create({
        name: form.get('name'),
        description: form.get('description'),
      })
      event.currentTarget.reset()
      setPlaylists((current) => [playlist, ...current])
    } catch (err) {
      setMessage(err.message)
    }
  }

  async function toggleVideoLike(videoId) {
    try {
      const data = await api.likes.toggleVideo(videoId)
      setMessage(data?._id ? 'Video liked.' : 'Video unliked.')
    } catch (err) {
      setMessage(err.message)
    }
  }

  if (activeView === 'upload') {
    return <UploadVideo onUploaded={() => loadVideos()} />
  }

  if (activeView === 'watch' && selectedVideo) {
    return (
      <section className="watch-layout">
        <div className="player-area">
          <video controls poster={selectedVideo.thumbnail} src={selectedVideo.videoFile} />
          <h2>{selectedVideo.title}</h2>
          <p>{selectedVideo.description}</p>
          <div className="channel-strip">
            <img alt="" src={selectedVideo.owner?.avatar} />
            <div>
              <strong>{selectedVideo.owner?.fullName}</strong>
              <span>@{selectedVideo.owner?.username}</span>
            </div>
            <button className="primary-button small" onClick={() => api.subscriptions.toggle(selectedVideo.owner?._id)} type="button">
              Subscribe
            </button>
          </div>
          <form className="comment-form" onSubmit={addComment}>
            <input onChange={(event) => setCommentText(event.target.value)} placeholder="Add a comment" value={commentText} />
            <button className="primary-button small" type="submit">Comment</button>
          </form>
          <div className="comment-list">
            {comments.map((comment) => (
              <article className="comment" key={comment._id}>
                <img alt="" src={comment.owner?.avatar} />
                <div>
                  <strong>{comment.owner?.fullName}</strong>
                  <p>{comment.content}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
        <aside className="rail">
          {videos.filter((video) => video._id !== selectedVideo._id).slice(0, 6).map((video) => (
            <VideoCard key={video._id} onLike={toggleVideoLike} onSelect={selectVideo} video={video} />
          ))}
        </aside>
      </section>
    )
  }

  if (activeView === 'tweets') {
    return (
      <section className="feed-layout narrow">
        <TweetComposer onCreate={createTweet} />
        {tweets.map((tweet) => (
          <article className="tweet" key={tweet._id}>
            <div className="tweet-author">
              <img alt="" src={tweet.owner?.avatar || user.avatar} />
              <div>
                <strong>{tweet.owner?.fullName || user.fullName}</strong>
                <span>@{tweet.owner?.username || user.username}</span>
              </div>
            </div>
            <p>{tweet.content}</p>
            <button className="tiny-button" onClick={() => api.likes.toggleTweet(tweet._id)} type="button">Like</button>
          </article>
        ))}
      </section>
    )
  }

  if (activeView === 'library') {
    return (
      <section className="library-grid">
        <div className="workspace-panel">
          <h2>Create playlist</h2>
          <form className="form-stack" onSubmit={createPlaylist}>
            <label>
              Name
              <input name="name" required />
            </label>
            <label>
              Description
              <textarea name="description" />
            </label>
            <button className="primary-button" type="submit">Create playlist</button>
          </form>
        </div>
        <div className="workspace-panel">
          <h2>Your playlists</h2>
          <div className="list-stack">
            {playlists.map((playlist) => (
              <article className="list-item" key={playlist._id}>
                <strong>{playlist.name}</strong>
                <span>{playlist.totalVideos || 0} videos</span>
              </article>
            ))}
          </div>
        </div>
        <div className="workspace-panel wide">
          <h2>Liked videos</h2>
          <div className="video-grid compact">
            {likedVideos.map((video) => (
              <VideoCard key={video._id} onLike={toggleVideoLike} onSelect={selectVideo} video={video} />
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="feed-layout">
      <form className="search-bar" onSubmit={(event) => { event.preventDefault(); loadVideos(query).catch((err) => setMessage(err.message)) }}>
        <input onChange={(event) => setQuery(event.target.value)} placeholder="Search videos" value={query} />
        <button className="primary-button small" type="submit">Search</button>
      </form>
      {message ? <p className="status-message">{message}</p> : null}
      <div className="video-grid">
        {videos.map((video) => (
          <VideoCard key={video._id} onLike={toggleVideoLike} onSelect={selectVideo} video={video} />
        ))}
      </div>
    </section>
  )
}
