import { useAuth } from '../hooks/useAuth'
import { NavLink, Outlet } from 'react-router-dom'
import { Footer } from './Footer'
import { Header } from './Header'

const navItems = [
  { id: 'home', label: 'Home', to: '/' },
  { id: 'tweets', label: 'Tweets', to: '/tweets' },
  { id: 'library', label: 'Library', to: '/library' },
  { id: 'studio', label: 'Studio', to: '/studio' },
  { id: 'history', label: 'History', to: '/history' },
  { id: 'subscriptions', label: 'Subscriptions', to: '/subscriptions' },
  { id: 'upload', label: 'Upload', to: '/upload' },
]

export function Shell() {
  const { user, logout } = useAuth()

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <NavLink className="brand" to="/">
          <span className="brand-mark">V</span>
          <span>Ventiq</span>
        </NavLink>

        <nav className="nav-list" aria-label="Primary">
          {navItems.map((item) => (
            <NavLink
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              key={item.id}
              to={item.to}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <NavLink className="sidebar-profile" to="/account">
          <img alt="" src={user?.avatar} />
          <div>
            <strong>{user?.fullName}</strong>
            <span>@{user?.username}</span>
          </div>
        </NavLink>
      </aside>

      <main className="main-panel">
        <Header onLogout={logout} />
        <div className="route-surface">
          <Outlet />
        </div>
        <Footer />
      </main>
    </div>
  )
}
