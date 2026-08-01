import { useCallback, useEffect, useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import {
  FolderPlus,
  Heart,
  ListVideo,
  PenLine,
  Plus,
  Search,
  Send,
  ThumbsUp,
  Trash2,
  UserPlus,
} from 'lucide-react'
import { api } from '../api/client'
import { TweetComposer } from '../components/TweetComposer'
import { UploadVideo } from '../components/UploadVideo'
import { VideoCard } from '../components/VideoCard'
import { Button, EmptyState, Notice, Skeleton, SkeletonCard } from '../components/ui'
import { useAuth } from '../hooks/useAuth'

export function Dashboard({ activeView }) {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { videoId } = useParams()
  const [videos, setVideos] = useState([])
  const [tweets, setTweets] = useState([])
  const [playlists, setPlaylists] = useState([])
  const [likedVideos, setLikedVideos] = useState([])
  const [subscriptions, setSubscriptions] = useState([])
  const [subscribers, setSubscribers] = useState([])
  const [selectedVideo, setSelectedVideo] = useState(null)
  const [comments, setComments] = useState([])
  const [commentText, setCommentText] = useState('')
  const [query, setQuery] = useState('')
  const [message, setMessage] = useState('')
  const [editingTweetId, setEditingTweetId] = useState('')
  const [editingCommentId, setEditingCommentId] = useState('')
  const [loadingVideos, setLoadingVideos] = useState(true)

  const loadVideos = useCallback(async (search = query) => {
    setLoadingVideos(true)
    try {
      const data = await api.videos.list({ query: search, limit: 12 })
      setVideos(data.videos || [])
    } catch (err) {
      setMessage({ text: err.message, tone: 'error' })
    } finally {
      setLoadingVideos(false)
    }
  }, [query])

  useEffect(() => {
    let isMounted = true

    async function initializeVideos() {
      setLoadingVideos(true)
      try {
        const data = await api.videos.list({ query, limit: 12 })
        if (isMounted) setVideos(data.videos || [])
      } catch (err) {
        if (isMounted) setMessage({ text: err.message, tone: 'error' })
      } finally {
        if (isMounted) setLoadingVideos(false)
      }
    }

    initializeVideos()

    return () => {
      isMounted = false
    }
  }, [query])

  useEffect(() => {
    if (activeView !== 'watch' || !videoId) return undefined

    let isMounted = true

    async function loadWatchVideo() {
      try {
        const [videoData, commentData, playlistData] = await Promise.all([
          api.videos.get(videoId),
          api.comments.byVideo(videoId, { limit: 20 }),
          api.playlists.byUser(user._id),
        ])
        if (!isMounted) return
        setSelectedVideo(videoData)
        setComments(commentData.docs || [])
        setPlaylists(playlistData || [])
      } catch (err) {
        if (isMounted) setMessage({ text: err.message, tone: 'error' })
      }
    }

    loadWatchVideo()

    return () => {
      isMounted = false
    }
  }, [activeView, user._id, videoId])

  useEffect(() => {
    let isMounted = true

    async function loadActiveViewData() {
      try {
        if (activeView === 'tweets') {
          const data = await api.tweets.byUser(user._id)
          if (isMounted) setTweets(data || [])
        }

        if (activeView === 'library') {
          const [playlistData, likedData, subscriptionData, subscriberData] = await Promise.all([
            api.playlists.byUser(user._id),
            api.likes.likedVideos(),
            api.subscriptions.subscribedChannels(user._id),
            api.subscriptions.subscribers(user._id),
          ])
          if (!isMounted) return
          setPlaylists(playlistData || [])
          setLikedVideos((likedData || []).map((item) => item.video).filter(Boolean))
          setSubscriptions(subscriptionData || [])
          setSubscribers(subscriberData || [])
        }
      } catch (err) {
        if (isMounted) setMessage({ text: err.message, tone: 'error' })
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
      const commentData = await api.comments.byVideo(video._id, { limit: 20 })
      setComments(commentData.docs || [])
      navigate(`/watch/${video._id}`)
    } catch (err) {
      setMessage({ text: err.message, tone: 'error' })
    }
  }

  async function createTweet(content) {
    const tweet = await api.tweets.create(content)
    setTweets((current) => [tweet, ...current])
  }

  async function updateTweet(event, tweetId) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    try {
      const updatedTweet = await api.tweets.update(tweetId, form.get('content'))
      setTweets((current) => current.map((tweet) => (tweet._id === tweetId ? { ...tweet, ...updatedTweet } : tweet)))
      setEditingTweetId('')
    } catch (err) {
      setMessage({ text: err.message, tone: 'error' })
    }
  }

  async function deleteTweet(tweetId) {
    try {
      await api.tweets.delete(tweetId)
      setTweets((current) => current.filter((tweet) => tweet._id !== tweetId))
    } catch (err) {
      setMessage({ text: err.message, tone: 'error' })
    }
  }

  async function addComment(event) {
    event.preventDefault()
    if (!selectedVideo || !commentText.trim()) return
    try {
      const comment = await api.comments.add(selectedVideo._id, commentText)
      setComments((current) => [comment, ...current])
      setCommentText('')
    } catch (err) {
      setMessage({ text: err.message, tone: 'error' })
    }
  }

  async function updateComment(event, commentId) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    try {
      const updatedComment = await api.comments.update(commentId, form.get('content'))
      setComments((current) => current.map((comment) => (
        comment._id === commentId ? { ...comment, ...updatedComment, owner: comment.owner } : comment
      )))
      setEditingCommentId('')
    } catch (err) {
      setMessage({ text: err.message, tone: 'error' })
    }
  }

  async function deleteComment(commentId) {
    try {
      await api.comments.delete(commentId)
      setComments((current) => current.filter((comment) => comment._id !== commentId))
    } catch (err) {
      setMessage({ text: err.message, tone: 'error' })
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
      setMessage({ text: 'Playlist created.', tone: 'success' })
    } catch (err) {
      setMessage({ text: err.message, tone: 'error' })
    }
  }

  async function addVideoToPlaylist(event) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    try {
      await api.playlists.addVideo(form.get('videoId'), form.get('playlistId'))
      setMessage({ text: 'Video added to playlist.', tone: 'success' })
    } catch (err) {
      setMessage({ text: err.message, tone: 'error' })
    }
  }

  async function toggleVideoLike(videoId) {
    try {
      const data = await api.likes.toggleVideo(videoId)
      setMessage({ text: data?._id ? 'Video liked.' : 'Video unliked.', tone: 'success' })
    } catch (err) {
      setMessage({ text: err.message, tone: 'error' })
    }
  }

  if (activeView === 'upload') {
    return <UploadVideo onUploaded={() => loadVideos()} />
  }

  if (activeView === 'watch' && !videoId) {
    return <Navigate replace to="/feed" />
  }

  if (activeView === 'watch' && videoId && !selectedVideo) {
    return (
      <section className="watch-grid">
        <div className="card player-frame">
          <div aria-hidden="true" className="skeleton" style={{ aspectRatio: '16 / 9', borderRadius: 0 }} />
          <div className="video-info grid gap-3">
            <Skeleton style={{ height: '24px', width: '72%' }} />
            <Skeleton style={{ height: '14px', width: '42%' }} />
            <Skeleton style={{ height: '14px', width: '58%' }} />
          </div>
        </div>
        <div className="rail">
          <p className="rail-title">Up next</p>
          {Array.from({ length: 4 }).map((_, index) => <SkeletonCard key={index} />)}
        </div>
      </section>
    )
  }

  if (activeView === 'watch' && selectedVideo) {
    return (
      <section className="watch-grid">
        <div className="grid gap-5 min-w-0">
          <Notice message={message} />

          <div className="card player-frame">
            <video controls poster={selectedVideo.thumbnail} src={selectedVideo.videoFile} />
            <div className="video-info">
              <h2>{selectedVideo.title}</h2>
              <p className="video-sub">
                {selectedVideo.owner?.fullName} · {selectedVideo.views ?? 0} views
              </p>

              <div className="channel-strip">
                <img alt={selectedVideo.owner?.fullName || 'Creator avatar'} className="avatar avatar-md" loading="lazy" src={selectedVideo.owner?.avatar} />
                <div className="channel-name">
                  <strong>{selectedVideo.owner?.fullName}</strong>
                  <span>@{selectedVideo.owner?.username}</span>
                </div>
                <div className="channel-actions">
                  <Button size="sm" type="button" variant="secondary" onClick={() => toggleVideoLike(selectedVideo._id)}>
                    <ThumbsUp />
                    Like
                  </Button>
                  <Button
                    size="sm"
                    type="button"
                    onClick={() => api.subscriptions.toggle(selectedVideo.owner?._id)}
                  >
                    <UserPlus />
                    Subscribe
                  </Button>
                </div>
              </div>

              <Link className="video-title text-primary-600" style={{ WebkitLineClamp: 1, display: 'inline-block' }} to={`/channel/${selectedVideo.owner?.username}`}>
                View channel →
              </Link>

              {playlists.length ? (
                <form className="playlist-add-form" onSubmit={addVideoToPlaylist}>
                  <input name="videoId" type="hidden" value={selectedVideo._id} />
                  <select className="input" name="playlistId" required>
                    <option value="">Add to playlist…</option>
                    {playlists.map((playlist) => (
                      <option key={playlist._id} value={playlist._id}>{playlist.name}</option>
                    ))}
                  </select>
                  <Button size="sm" type="submit">
                    <ListVideo />
                    Add
                  </Button>
                </form>
              ) : null}

              <div className="comments-section">
                <div className="section-header" style={{ marginBottom: '10px' }}>
                  <h3 className="section-title" style={{ fontSize: '15px' }}>
                    <Send />
                    Comments
                  </h3>
                </div>
                <form className="comment-form" onSubmit={addComment}>
                  <input
                    className="input"
                    onChange={(event) => setCommentText(event.target.value)}
                    placeholder="Add a comment…"
                    value={commentText}
                  />
                  <Button size="sm" type="submit">
                    Comment
                  </Button>
                </form>

                {comments.length ? (
                  <div className="comment-list">
                    {comments.map((comment) => (
                      <article className="comment-item" key={comment._id}>
                        <img alt={comment.owner?.fullName || 'Comment author avatar'} className="avatar avatar-sm" loading="lazy" src={comment.owner?.avatar} />
                        <div className="comment-body">
                          <div className="comment-head">
                            <strong>{comment.owner?.fullName}</strong>
                          </div>
                          {editingCommentId === comment._id ? (
                            <form className="inline-edit" onSubmit={(event) => updateComment(event, comment._id)}>
                              <input className="input" defaultValue={comment.content} name="content" required />
                              <Button size="sm" type="submit">Save</Button>
                              <Button size="sm" type="button" variant="secondary" onClick={() => setEditingCommentId('')}>
                                Cancel
                              </Button>
                            </form>
                          ) : (
                            <p>{comment.content}</p>
                          )}
                          {comment.owner?._id === user._id ? (
                            <div className="manage-actions" style={{ marginTop: '8px' }}>
                              <button className="action-btn" onClick={() => setEditingCommentId(comment._id)} type="button">
                                <PenLine />
                                Edit
                              </button>
                              <button className="action-btn danger" onClick={() => deleteComment(comment._id)} type="button">
                                <Trash2 />
                                Delete
                              </button>
                            </div>
                          ) : null}
                        </div>
                      </article>
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    icon={<Send />}
                    title="No comments yet"
                    description="Be the first to start the conversation."
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        <aside className="rail">
          <p className="rail-title">Up next</p>
          {videos.filter((video) => video._id !== selectedVideo._id).slice(0, 6).map((video) => (
            <VideoCard key={video._id} onLike={toggleVideoLike} onSelect={selectVideo} video={video} />
          ))}
        </aside>
      </section>
    )
  }

  if (activeView === 'tweets') {
    return (
      <section className="grid gap-5 max-w-3xl">
        <TweetComposer onCreate={createTweet} />
        {tweets.length ? (
          tweets.map((tweet) => (
            <article className="card tweet-card" key={tweet._id}>
              <div className="tweet-author">
                <img alt={(tweet.owner?.fullName || user.fullName) || 'Author avatar'} className="avatar avatar-md" loading="lazy" src={tweet.owner?.avatar || user.avatar} />
                <div className="tweet-author-name">
                  <strong>{tweet.owner?.fullName || user.fullName}</strong>
                  <span>@{tweet.owner?.username || user.username}</span>
                </div>
              </div>
              {editingTweetId === tweet._id ? (
                <form className="inline-edit" onSubmit={(event) => updateTweet(event, tweet._id)}>
                  <input className="input" defaultValue={tweet.content} name="content" required />
                  <Button size="sm" type="submit">Save</Button>
                  <Button size="sm" type="button" variant="secondary" onClick={() => setEditingTweetId('')}>
                    Cancel
                  </Button>
                </form>
              ) : (
                <p className="tweet-body">{tweet.content}</p>
              )}
              <div className="tweet-actions">
                <button className="action-btn" onClick={() => api.likes.toggleTweet(tweet._id)} type="button">
                  <Heart />
                  Like
                </button>
                <button className="action-btn" onClick={() => setEditingTweetId(tweet._id)} type="button">
                  <PenLine />
                  Edit
                </button>
                <button className="action-btn danger" onClick={() => deleteTweet(tweet._id)} type="button">
                  <Trash2 />
                  Delete
                </button>
              </div>
            </article>
          ))
        ) : (
          <EmptyState
            icon={<Send />}
            title="Nothing posted yet"
            description="Share an update with your channel — it shows up right here."
          />
        )}
      </section>
    )
  }

  if (activeView === 'library') {
    return (
      <section className="grid-panels wide-left">
        <div className="grid gap-5">
          <section className="card section-card">
            <div className="section-header">
              <h2 className="section-title">
                <FolderPlus />
                Create playlist
              </h2>
            </div>
            <form className="grid gap-4" onSubmit={createPlaylist}>
              <label className="field">
                <span className="field-label">Name</span>
                <input className="input" name="name" placeholder="e.g. Weekend watchlist" required />
              </label>
              <label className="field">
                <span className="field-label">Description</span>
                <textarea className="input" name="description" placeholder="What is this collection for?" />
              </label>
              <Button size="sm" type="submit">
                <Plus />
                Create playlist
              </Button>
            </form>
          </section>

          <section className="card section-card">
            <div className="section-header">
              <h2 className="section-title">
                <ListVideo />
                Your playlists
              </h2>
            </div>
            {playlists.length ? (
              <div className="list-stack">
                {playlists.map((playlist) => (
                  <Link className="list-item" key={playlist._id} to={`/playlist/${playlist._id}`}>
                    <span className="li-icon">
                      <ListVideo />
                    </span>
                    <strong>{playlist.name}</strong>
                    <span>{playlist.totalVideos || 0} videos</span>
                  </Link>
                ))}
              </div>
            ) : (
              <EmptyState
                icon={<ListVideo />}
                title="No playlists yet"
                description="Create a playlist to organize your favorite videos."
              />
            )}
          </section>

          <section className="card section-card">
            <div className="section-header">
              <h2 className="section-title">
                <Heart />
                Network
              </h2>
            </div>
            <div className="list-stack">
              <Link className="list-item" to="/subscriptions">
                <span className="li-icon">
                  <Heart />
                </span>
                <strong>Subscriptions</strong>
                <span>{subscriptions.length} channels</span>
              </Link>
              <Link className="list-item" to={`/subscribers/${user._id}`}>
                <span className="li-icon">
                  <UserPlus />
                </span>
                <strong>Subscribers</strong>
                <span>{subscribers.length} people</span>
              </Link>
            </div>
          </section>
        </div>

        <section className="card section-card">
          <div className="section-header">
            <h2 className="section-title">
              <Heart />
              Liked videos
            </h2>
          </div>
          {likedVideos.length ? (
            <div className="grid-cards compact">
              {likedVideos.map((video) => (
                <VideoCard key={video._id} onLike={toggleVideoLike} onSelect={selectVideo} video={video} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={<Heart />}
              title="No liked videos yet"
              description="Tap the heart on any video and it will show up here."
            />
          )}
        </section>
      </section>
    )
  }

  return (
    <section className="grid gap-5">
      <form
        className="card flex items-center gap-3 p-3"
        onSubmit={(event) => { event.preventDefault(); loadVideos(query) }}
      >
        <div className="input-wrap flex-1">
          <Search />
          <input
            className="input"
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search videos…"
            value={query}
          />
        </div>
        <Button size="md" type="submit">
          <Search />
          Search
        </Button>
      </form>

      <Notice message={message} />

      {loadingVideos ? (
        <div className="grid-cards">
          {Array.from({ length: 6 }).map((_, index) => <SkeletonCard key={index} />)}
        </div>
      ) : videos.length ? (
        <div className="grid-cards">
          {videos.map((video) => (
            <VideoCard key={video._id} onLike={toggleVideoLike} onSelect={selectVideo} video={video} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<Search />}
          title="No videos found"
          description="Try a different search term or check back later."
        />
      )}
    </section>
  )
}
