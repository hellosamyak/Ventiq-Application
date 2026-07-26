import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

const routeMeta = [
  { match: (path) => path === '/feed', eyebrow: 'Live creator feed', title: 'Creator feed', accent: 'Watch, post, and keep the room moving.' },
  { match: (path) => path.startsWith('/watch'), eyebrow: 'Now playing', title: 'Watch', accent: 'Comments, likes, playlists, and channels stay close.' },
  { match: (path) => path.startsWith('/tweets'), eyebrow: 'Pulse', title: 'Tweets', accent: 'Short posts from your creator identity.' },
  { match: (path) => path.startsWith('/library'), eyebrow: 'Saved space', title: 'Library', accent: 'Playlists, liked videos, and your network.' },
  { match: (path) => path.startsWith('/studio'), eyebrow: 'Creator controls', title: 'Studio', accent: 'Manage uploads, visibility, and metadata.' },
  { match: (path) => path.startsWith('/history'), eyebrow: 'Recently watched', title: 'Watch history', accent: 'Return to the videos you opened before.' },
  { match: (path) => path.startsWith('/subscriptions'), eyebrow: 'Following', title: 'Subscriptions', accent: 'Channels you keep up with.' },
  { match: (path) => path.startsWith('/upload'), eyebrow: 'Publish', title: 'Upload', accent: 'Ship a new video with thumbnail and details.' },
  { match: (path) => path.startsWith('/account'), eyebrow: 'Identity', title: 'Account center', accent: 'Profile, credentials, avatar, and cover image.' },
  { match: (path) => path.startsWith('/channel'), eyebrow: 'Channel view', title: 'Channel', accent: 'Videos, tweets, and subscription state.' },
  { match: (path) => path.startsWith('/playlist'), eyebrow: 'Collection', title: 'Playlist', accent: 'Organize videos into a focused queue.' },
]

export function Header({ onLogout }) {
  const { user } = useAuth()
  const location = useLocation()
  const meta = routeMeta.find((item) => item.match(location.pathname)) || routeMeta[0]

  return (
    <header className="immersive-header">
      <div className="header-main">
        <div className="header-copy">
          <p className="eyebrow">{meta.eyebrow}</p>
          <h1>{meta.title}</h1>
          <p>{meta.accent}</p>
        </div>

        <div className="header-actions">
          <Link className="ghost-button" to="/upload">Upload</Link>
          <Link className="primary-button small" to="/studio">Studio</Link>
          <button className="ghost-button" onClick={onLogout} type="button">Logout</button>
        </div>
      </div>

      <div className="header-lens">
        <div className="header-profile">
          <img alt="" src={user?.avatar} />
          <div>
            <strong>{user?.fullName}</strong>
            <span>@{user?.username}</span>
          </div>
        </div>
        <div className="header-stat">
          <span>Route</span>
          <strong>{location.pathname === '/feed' ? 'Feed' : location.pathname.split('/')[1]}</strong>
        </div>
        <div className="header-stat">
          <span>Session</span>
          <strong>Active</strong>
        </div>
      </div>
    </header>
  )
}
