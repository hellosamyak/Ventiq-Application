import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

const featureTiles = [
  { title: 'Video feed', copy: 'Upload, watch, like, comment, and keep your history in sync.' },
  { title: 'Tweet stream', copy: 'Post short updates from the same creator identity.' },
  { title: 'Creator studio', copy: 'Manage videos, publish state, playlists, and channel presence.' },
]

export function LandingPage() {
  const { isAuthenticated, user } = useAuth()

  return (
    <main className="landing-page">
      <nav className="landing-nav" aria-label="Landing">
        <Link className="brand" to="/">
          <span className="brand-mark">V</span>
          <span>Ventiq</span>
        </Link>
        <div>
          {isAuthenticated ? (
            <Link className="primary-button small" to="/feed">Enter app</Link>
          ) : (
            <>
              <Link className="ghost-button" to="/login">Login</Link>
              <Link className="primary-button small" to="/signup">Signup</Link>
            </>
          )}
        </div>
      </nav>

      <section className="landing-hero">
        <div className="hero-media" aria-hidden="true">
          <div className="hero-video-frame">
            <div className="hero-screen">
              <span />
              <span />
              <span />
            </div>
            <div className="hero-timeline" />
          </div>
          <div className="hero-feed-card primary">
            <strong>New upload</strong>
            <span>Deep dive: building in public</span>
          </div>
          <div className="hero-feed-card secondary">
            <strong>@creator</strong>
            <span>Shipping the next idea today.</span>
          </div>
          <div className="hero-metric">
            <strong>42K</strong>
            <span>views moving through the feed</span>
          </div>
        </div>

        <div className="landing-copy">
          <p className="eyebrow">YouTube x Twitter creator space</p>
          <h1>Ventiq</h1>
          <p>
            A single social video workspace where channels, videos, tweets, comments, likes,
            subscriptions, playlists, and account controls all live in one flow.
          </p>
          <div className="landing-actions">
            <Link className="primary-button" to={isAuthenticated ? '/feed' : '/signup'}>
              {isAuthenticated ? `Continue as ${user?.username}` : 'Create your channel'}
            </Link>
            <Link className="ghost-button" to={isAuthenticated ? '/studio' : '/login'}>
              {isAuthenticated ? 'Open studio' : 'Login'}
            </Link>
          </div>
        </div>
      </section>

      <section className="landing-features">
        {featureTiles.map((tile) => (
          <article key={tile.title}>
            <h2>{tile.title}</h2>
            <p>{tile.copy}</p>
          </article>
        ))}
      </section>
    </main>
  )
}
