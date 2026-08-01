import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { UserPlus } from 'lucide-react'
import { api } from '../api/client'
import { EmptyState, Notice, Skeleton } from '../components/ui'

export function Subscribers() {
  const { channelId } = useParams()
  const [subscribers, setSubscribers] = useState([])
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    async function loadSubscribers() {
      setLoading(true)
      try {
        const data = await api.subscriptions.subscribers(channelId)
        if (isMounted) setSubscribers(data || [])
      } catch (err) {
        if (isMounted) setMessage({ text: err.message, tone: 'error' })
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    loadSubscribers()

    return () => {
      isMounted = false
    }
  }, [channelId])

  return (
    <section className="grid gap-5">
      <Notice message={message} />

      {loading ? (
        <div className="people-grid">
          {Array.from({ length: 6 }).map((_, index) => (
            <div className="skeleton-card" key={index} style={{ padding: '18px', display: 'grid', justifyItems: 'center', gap: '8px' }}>
              <Skeleton className="avatar-xl" style={{ borderRadius: '50%' }} />
              <Skeleton style={{ height: '14px', width: '60%' }} />
              <Skeleton style={{ height: '12px', width: '40%' }} />
            </div>
          ))}
        </div>
      ) : subscribers.length ? (
        <div className="people-grid">
          {subscribers.map((item) => (
            <Link className="person-card" key={item._id} to={`/channel/${item.subscriber?.username}`}>
              <img alt={item.subscriber?.fullName || 'Subscriber avatar'} className="avatar avatar-lg" loading="lazy" src={item.subscriber?.avatar} />
              <strong>{item.subscriber?.fullName}</strong>
              <span>@{item.subscriber?.username}</span>
            </Link>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<UserPlus />}
          title="No subscribers yet"
          description="When people follow your channel, they will appear here."
        />
      )}
    </section>
  )
}
