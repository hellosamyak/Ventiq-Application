import { Link } from 'react-router-dom'

const footerLinks = [
  { label: 'Home', to: '/' },
  { label: 'Tweets', to: '/tweets' },
  { label: 'Library', to: '/library' },
  { label: 'Studio', to: '/studio' },
  { label: 'Account', to: '/account' },
]

export function Footer() {
  return (
    <footer className="immersive-footer">
      <div>
        <div className="brand footer-brand">
          <span className="brand-mark">V</span>
          <span>Ventiq</span>
        </div>
        <p>Built around the backend routes for video, tweets, comments, likes, playlists, subscriptions, and account control.</p>
      </div>

      <nav className="footer-links" aria-label="Footer">
        {footerLinks.map((link) => (
          <Link key={link.to} to={link.to}>{link.label}</Link>
        ))}
      </nav>
    </footer>
  )
}
