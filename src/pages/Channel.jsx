import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Bell, Film, Heart, MessageSquareText, UserPlus } from 'lucide-react'
import { api } from '../api/client'
import { VideoCard } from '../components/VideoCard'
import { Button, EmptyState, Notice, Skeleton, SkeletonCard } from '../components/ui'

export function Channel() {
  const navigate = useNavigate()
  const { username } = useParams()
  const [channel, setChannel] = useState(null)
  const [videos, setVideos] = useState([])
  const [tweets, setTweets] = useState([])
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    async function loadChannel() {
      setLoading(true)
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
        if (isMounted) setMessage({ text: err.message, tone: 'error' })
      } finally {
        if (isMounted) setLoading(false)
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
      setMessage({ text: err.message, tone: 'error' })
    }
  }

  if (loading) {
    return (
      <section className="grid gap-5">
        <div className="channel-hero">
          <div className="channel-cover">
            <div aria-hidden="true" className="skeleton" style={{ height: '100%', borderRadius: 0 }} />
          </div>
          <div className="channel-info">
            <Skeleton className="avatar-xl" style={{ borderRadius: '50%' }} />
            <div className="grid gap-2">
              <Skeleton style={{ height: '20px', width: '180px' }} />
              <Skeleton style={{ height: '12px', width: '260px' }} />
            </div>
          </div>
        </div>
        <div className="grid-cards compact">
          {Array.from({ length: 6 }).map((_, index) => <SkeletonCard key={index} />)}
        </div>
      </section>
    )
  }

  if (!channel) {
    return <Notice message={message || { text: 'Channel not found.', tone: 'error' }} />
  }

  return (
    <section className="grid gap-5">
      <div className="channel-hero">
        <div className="channel-cover">
          {channel.coverImage ? <img alt="" src={channel.coverImage} /> : null}
        </div>
        <div className="channel-info">
          <img alt={channel.fullName || 'Channel avatar'} className="avatar avatar-xl" loading="lazy" src={channel.avatar} />
          <div>
            <h2>{channel.fullName}</h2>
            <p>
              @{channel.username} · {channel.subscribersCount || 0} subscribers ·{' '}
              {channel.channelsSubscribedToCount || 0} subscriptions
            </p>
          </div>
          <div className="channel-actions">
            <Button
              size="md"
              type="button"
              variant={channel.isSubscribed ? 'secondary' : 'primary'}
              onClick={toggleSubscription}
            >
              {channel.isSubscribed ? <Bell /> : <UserPlus />}
              {channel.isSubscribed ? 'Subscribed' : 'Subscribe'}
            </Button>
          </div>
        </div>
      </div>

      <Notice message={message} />

      <div className="card section-card">
        <div className="section-header">
          <h2 className="section-title">
            <Film />
            Videos
          </h2>
          <span className="badge badge-neutral">{videos.length}</span>
        </div>
        {videos.length ? (
          <div className="grid-cards compact">
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
            icon={<Film />}
            title="No videos yet"
            description="This channel hasn't published any videos."
          />
        )}
      </div>

      <div className="card section-card">
        <div className="section-header">
          <h2 className="section-title">
            <MessageSquareText />
            Tweets
          </h2>
          <span className="badge badge-neutral">{tweets.length}</span>
        </div>
        {tweets.length ? (
          <div className="list-stack">
            {tweets.map((tweet) => (
              <article className="tweet-card" key={tweet._id}>
                <div className="tweet-author">
                  <img alt={channel.fullName || 'Channel avatar'} className="avatar avatar-sm" loading="lazy" src={channel.avatar} />
                  <div className="tweet-author-name">
                    <strong>{channel.fullName}</strong>
                    <span>@{channel.username}</span>
                  </div>
                </div>
                <p className="tweet-body">{tweet.content}</p>
                <div className="tweet-actions">
                  <button className="action-btn" onClick={() => api.likes.toggleTweet(tweet._id)} type="button">
                    <Heart />
                    Like
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<MessageSquareText />}
            title="No tweets yet"
            description="This channel hasn't posted any updates."
          />
        )}
      </div>
    </section>
  )
}
