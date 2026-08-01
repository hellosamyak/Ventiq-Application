import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ChevronDown, LogOut, Menu, Plus, Settings, Upload } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { ThemeToggle } from '../ThemeToggle'

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

export function Header({ onLogout, onMenu }) {
  const { user } = useAuth()
  const location = useLocation()
  const meta = routeMeta.find((item) => item.match(location.pathname)) || routeMeta[0]
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef(null)
  const menuId = 'account-menu'

  useEffect(() => {
    function handlePointer(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) setMenuOpen(false)
    }
    function handleKey(event) {
      if (event.key === 'Escape') setMenuOpen(false)
    }
    document.addEventListener('mousedown', handlePointer)
    document.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('mousedown', handlePointer)
      document.removeEventListener('keydown', handleKey)
    }
  }, [])

  return (
    <header className="topbar">
      <button aria-label="Open menu" className="icon-btn lg:hidden" onClick={onMenu} type="button">
        <Menu />
      </button>

      <div className="topbar-copy">
        <p className="eyebrow">{meta.eyebrow}</p>
        <h1>{meta.title}</h1>
      </div>

      <div className="topbar-actions">
        <Link className="btn btn-secondary btn-sm hidden sm:inline-flex" to="/studio">
          <Upload />
          Studio
        </Link>
        <Link className="btn btn-primary btn-sm" to="/upload">
          <Plus />
          Upload
        </Link>

        <ThemeToggle />

        <div className="relative" ref={menuRef}>
          <button
            aria-expanded={menuOpen}
            aria-haspopup="menu"
            aria-controls={menuId}
            className="profile-chip"
            onClick={() => setMenuOpen((value) => !value)}
            type="button"
          >
            <img alt={user?.fullName || 'Account avatar'} className="avatar avatar-sm" loading="lazy" src={user?.avatar} />
            <span>{user?.fullName}</span>
            <ChevronDown />
          </button>

          {menuOpen ? (
            <div className="menu-card" id={menuId} role="menu">
              <Link className="menu-item" onClick={() => setMenuOpen(false)} role="menuitem" to="/account">
                <Settings />
                Account settings
              </Link>
              <div className="menu-divider" />
              <button className="menu-item danger" onClick={() => { setMenuOpen(false); onLogout() }} role="menuitem" type="button">
                <LogOut />
                Log out
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  )
}
