import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { Bell, History, Home, LayoutGrid, Library, LogOut, MessageSquareText, Plus, X } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { Brand } from './Brand'
import { Footer } from './Footer'
import { Header } from './Header'

const navItems = [
  { id: 'feed', label: 'Feed', to: '/feed', icon: Home },
  { id: 'tweets', label: 'Tweets', to: '/tweets', icon: MessageSquareText },
  { id: 'library', label: 'Library', to: '/library', icon: Library },
  { id: 'studio', label: 'Studio', to: '/studio', icon: LayoutGrid },
  { id: 'history', label: 'History', to: '/history', icon: History },
  { id: 'subscriptions', label: 'Subscriptions', to: '/subscriptions', icon: Bell },
]

function SidebarNav({ onNavigate }) {
  const { user, logout } = useAuth()

  return (
    <>
      <div className="sidebar-brand">
        <Brand to="/feed" />
      </div>

      <Link className="btn btn-primary btn-sm sidebar-cta" onClick={onNavigate} to="/upload">
        <Plus />
        New upload
      </Link>

      <nav className="nav-group" aria-label="Primary">
        <p className="nav-group-title">Menu</p>
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              key={item.id}
              onClick={onNavigate}
              to={item.to}
            >
              <Icon />
              <span>{item.label}</span>
            </NavLink>
          )
        })}
      </nav>

      <div className="sidebar-footer">
        <Link className="profile-card" onClick={onNavigate} to="/account">
          <img alt={user?.fullName || 'Account avatar'} className="avatar avatar-sm" loading="lazy" src={user?.avatar} />
          <div className="profile-card-info">
            <strong>{user?.fullName}</strong>
            <span>@{user?.username}</span>
          </div>
        </Link>
        <button className="nav-item logout-item" onClick={() => logout()} type="button">
          <LogOut />
          <span>Log out</span>
        </button>
      </div>
    </>
  )
}

export function Shell() {
  const [open, setOpen] = useState(false)
  const { logout } = useAuth()
  const location = useLocation()
  const closeDrawer = () => setOpen(false)

  useEffect(() => {
    function handleKey(event) {
      if (event.key === 'Escape') closeDrawer()
    }

    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [])

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <SidebarNav />
      </aside>

      <div className={`sidebar-drawer ${open ? 'open' : ''}`}>
        <div className="drawer-backdrop" onClick={closeDrawer} />
        <div aria-label="Menu" aria-modal="true" className="drawer-panel" role="dialog">
          <button aria-label="Close menu" className="icon-btn drawer-close" onClick={closeDrawer} type="button">
            <X />
          </button>
          <SidebarNav onNavigate={closeDrawer} />
        </div>
      </div>

      <main className="main-panel">
        <Header onLogout={logout} onMenu={() => setOpen(true)} />
        <div className="page-container">
          <div className="route-surface" key={location.pathname}>
            <Outlet />
          </div>
        </div>
        <Footer />
      </main>
    </div>
  )
}
