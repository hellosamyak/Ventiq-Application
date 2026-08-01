import { Link } from 'react-router-dom'
import { ArrowRight, Clapperboard, MessageSquareText, Sparkles, TrendingUp } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { Brand } from '../components/Brand'
import { ThemeToggle } from '../components/ThemeToggle'

const featureTiles = [
  { title: 'Video feed', copy: 'Upload, watch, like, comment, and keep your history in sync.', icon: Clapperboard },
  { title: 'Tweet stream', copy: 'Post short updates from the same creator identity.', icon: MessageSquareText },
  { title: 'Creator studio', copy: 'Manage videos, publish state, playlists, and channel presence.', icon: TrendingUp },
]

export function LandingPage() {
  const { isAuthenticated, user } = useAuth()

  return (
    <main className="landing">
      <nav aria-label="Landing" className="landing-nav">
        <Brand onDark to="/" />
        <div className="landing-nav-actions">
          <ThemeToggle onDark />
          {isAuthenticated ? (
            <Link className="btn-gradient" to="/feed">
              Enter app
              <ArrowRight />
            </Link>
          ) : (
            <>
              <Link className="ghost-light" to="/login">
                Login
              </Link>
              <Link className="btn-gradient" to="/signup">
                Create channel
              </Link>
            </>
          )}
        </div>
      </nav>

      <section className="landing-hero">
        <div className="hero-glow" aria-hidden="true" />

        <div className="landing-copy">
          <span className="hero-eyebrow">
            <Sparkles />
            YouTube × Twitter, rebuilt for creators
          </span>
          <h1>
            Your videos. Your voice. <span className="text-gradient">One stage.</span>
          </h1>
          <p className="landing-sub">
            Ventiq is a single social video workspace where channels, videos, tweets, comments,
            likes, subscriptions, and account controls live in one flow.
          </p>
          <div className="landing-actions">
            <Link className="btn-gradient" to={isAuthenticated ? '/feed' : '/signup'}>
              {isAuthenticated ? `Continue as @${user?.username}` : 'Create your channel'}
              <ArrowRight />
            </Link>
            <Link className="btn-ghost-light" to={isAuthenticated ? '/studio' : '/login'}>
              {isAuthenticated ? 'Open studio' : 'Login'}
            </Link>
          </div>
        </div>

        <div className="landing-media">
          <div className="mock-frame">
            <div className="mock-screen" aria-hidden="true">
              <span className="mock-tile main" />
              <span className="mock-tile" />
              <span className="mock-tile" />
            </div>
            <div className="mock-timeline" aria-hidden="true" />
          </div>

          <div className="mock-chip primary">
            <strong>New upload</strong>
            <span>Deep dive: building in public</span>
          </div>
          <div className="mock-chip secondary">
            <span className="chip-dot" />
            <strong>@creator</strong>
            <span>Shipping the next idea today.</span>
          </div>
          <div className="mock-chip metric">
            <strong>42K</strong>
            <span>views this week</span>
          </div>
        </div>
      </section>

      <section className="landing-features">
        {featureTiles.map((tile) => {
          const Icon = tile.icon
          return (
            <article className="feature-card" key={tile.title}>
              <span className="feature-icon">
                <Icon />
              </span>
              <h3>{tile.title}</h3>
              <p>{tile.copy}</p>
            </article>
          )
        })}
      </section>

      <footer className="landing-footer">
        <span>© {new Date().getFullYear()} Ventiq</span>
        <div style={{ display: 'flex', gap: '18px' }}>
          <Link to="/login">Login</Link>
          <Link to="/signup">Sign up</Link>
        </div>
      </footer>
    </main>
  )
}
