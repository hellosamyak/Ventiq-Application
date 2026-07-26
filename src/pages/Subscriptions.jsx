import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api/client'
import { useAuth } from '../hooks/useAuth'

export function Subscriptions() {
  const { user } = useAuth()
  const [channels, setChannels] = useState([])
  const [message, setMessage] = useState('')

  useEffect(() => {
    let isMounted = true

    async function loadSubscriptions() {
      try {
        const data = await api.subscriptions.subscribedChannels(user._id)
        if (isMounted) setChannels(data || [])
      } catch (err) {
        if (isMounted) setMessage(err.message)
      }
    }

    loadSubscriptions()

    return () => {
      isMounted = false
    }
  }, [user._id])

  return (
    <section className="workspace-panel">
      <h2>Subscribed channels</h2>
      {message ? <p className="status-message">{message}</p> : null}
      <div className="people-grid">
        {channels.map((item) => (
          <Link className="person-card" key={item._id} to={`/channel/${item.channel?.username}`}>
            <img alt="" src={item.channel?.avatar} />
            <strong>{item.channel?.fullName}</strong>
            <span>@{item.channel?.username}</span>
          </Link>
        ))}
      </div>
    </section>
  )
}
