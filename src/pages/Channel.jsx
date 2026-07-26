import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../api/client'
import { VideoCard } from '../components/VideoCard'

export function Channel() {
  const navigate = useNavigate()
  const { username } = useParams()
  const [channel, setChannel] = useState(null)
  const [videos, setVideos] = useState([])
  const [tweets, setTweets] = useState([])
  const [message, setMessage] = useState('')

  useEffect(() => {
    let isMounted = true

    async function loadChannel() {
      try {
        const channelData = await api.users.channel(username)
        const [videoData, tweetData] = await Promise.all([
          api.videos.list({ userId: channelData._id, limit: 30 }),
          api.tweets.byUser(channelData._id),
        ])
        if (!isMounted) return
        setChannel(channelData)
        setVideos(videoData.videos || [])
        setTweets(tweetData || [])
      } catch (err) {
        if (isMounted) setMessage(err.message)
      }
    }

    loadChannel()

    return () => {
      isMounted = false
    }
  }, [username])

  async function toggleSubscription() {
    if (!channel) return
    try {
      await api.subscriptions.toggle(channel._id)
      setChannel((current) => current ? { ...current, isSubscribed: !current.isSubscribed } : current)
    } catch (err) {
      setMessage(err.message)
    }
  }

  if (!channel) {
    return <p className="status-message">{message || 'Loading channel...'}</p>
  }

  return (
    <section className="feed-layout">
      <header className="channel-hero">
        <div className="cover-preview">
          {channel.coverImage ? <img alt="" src={channel.coverImage} /> : null}
        </div>
        <div className="channel-info">
          <img alt="" src={channel.avatar} />
          <div>
            <h2>{channel.fullName}</h2>
            <p>@{channel.username} · {channel.subscribersCount || 0} subscribers · {channel.channelsSubscribedToCount || 0} subscriptions</p>
          </div>
          <button className="primary-button small" onClick={toggleSubscription} type="button">
            {channel.isSubscribed ? 'Subscribed' : 'Subscribe'}
          </button>
        </div>
      </header>

      {message ? <p className="status-message">{message}</p> : null}

      <section className="workspace-panel">
        <h2>Videos</h2>
        <div className="video-grid compact">
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

      <section className="feed-layout narrow">
        <h2>Tweets</h2>
        {tweets.map((tweet) => (
          <article className="tweet" key={tweet._id}>
            <p>{tweet.content}</p>
            <button className="tiny-button" onClick={() => api.likes.toggleTweet(tweet._id)} type="button">Like</button>
          </article>
        ))}
      </section>
    </section>
  )
}
