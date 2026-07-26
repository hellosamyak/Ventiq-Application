import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { api } from '../api/client'

export function Subscribers() {
  const { channelId } = useParams()
  const [subscribers, setSubscribers] = useState([])
  const [message, setMessage] = useState('')

  useEffect(() => {
    let isMounted = true

    async function loadSubscribers() {
      try {
        const data = await api.subscriptions.subscribers(channelId)
        if (isMounted) setSubscribers(data || [])
      } catch (err) {
        if (isMounted) setMessage(err.message)
      }
    }

    loadSubscribers()

    return () => {
      isMounted = false
    }
  }, [channelId])

  return (
    <section className="workspace-panel">
      <h2>Subscribers</h2>
      {message ? <p className="status-message">{message}</p> : null}
      <div className="people-grid">
        {subscribers.map((item) => (
          <Link className="person-card" key={item._id} to={`/channel/${item.subscriber?.username}`}>
            <img alt="" src={item.subscriber?.avatar} />
            <strong>{item.subscriber?.fullName}</strong>
            <span>@{item.subscriber?.username}</span>
          </Link>
        ))}
      </div>
    </section>
  )
}
