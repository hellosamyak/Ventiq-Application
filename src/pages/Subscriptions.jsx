import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Bell } from 'lucide-react'
import { api } from '../api/client'
import { useAuth } from '../hooks/useAuth'
import { EmptyState, Notice, Skeleton } from '../components/ui'

export function Subscriptions() {
  const { user } = useAuth()
  const [channels, setChannels] = useState([])
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    async function loadSubscriptions() {
      setLoading(true)
      try {
        const data = await api.subscriptions.subscribedChannels(user._id)
        if (isMounted) setChannels(data || [])
      } catch (err) {
        if (isMounted) setMessage({ text: err.message, tone: 'error' })
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    loadSubscriptions()

    return () => {
      isMounted = false
    }
  }, [user._id])

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
      ) : channels.length ? (
        <div className="people-grid">
          {channels.map((item) => (
            <Link className="person-card" key={item._id} to={`/channel/${item.channel?.username}`}>
              <img alt={item.channel?.fullName || 'Channel avatar'} className="avatar avatar-lg" loading="lazy" src={item.channel?.avatar} />
              <strong>{item.channel?.fullName}</strong>
              <span>@{item.channel?.username}</span>
            </Link>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<Bell />}
          title="No subscriptions yet"
          description="Follow channels to keep up with their latest videos and tweets."
        />
      )}
    </section>
  )
}
