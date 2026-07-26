import { useAuth } from '../hooks/useAuth'

const navItems = [
  { id: 'home', label: 'Home' },
  { id: 'watch', label: 'Watch' },
  { id: 'tweets', label: 'Tweets' },
  { id: 'library', label: 'Library' },
  { id: 'upload', label: 'Upload' },
]

export function Shell({ activeView, onNavigate, children }) {
  const { user, logout } = useAuth()

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <button className="brand" onClick={() => onNavigate('home')} type="button">
          <span className="brand-mark">V</span>
          <span>Ventiq</span>
        </button>

        <nav className="nav-list" aria-label="Primary">
          {navItems.map((item) => (
            <button
              className={`nav-item ${activeView === item.id ? 'active' : ''}`}
              key={item.id}
              onClick={() => onNavigate(item.id)}
              type="button"
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="sidebar-profile">
          <img alt="" src={user?.avatar} />
          <div>
            <strong>{user?.fullName}</strong>
            <span>@{user?.username}</span>
          </div>
        </div>
      </aside>

      <main className="main-panel">
        <header className="topbar">
          <div>
            <p className="eyebrow">YouTube x Twitter workspace</p>
            <h1>{activeView === 'home' ? 'Creator feed' : navItems.find((item) => item.id === activeView)?.label}</h1>
          </div>
          <button className="ghost-button" onClick={logout} type="button">Logout</button>
        </header>
        {children}
      </main>
    </div>
  )
}
