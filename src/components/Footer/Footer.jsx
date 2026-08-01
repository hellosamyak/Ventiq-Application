import { Link } from 'react-router-dom'

const footerLinks = [
  { label: 'Feed', to: '/feed' },
  { label: 'Tweets', to: '/tweets' },
  { label: 'Library', to: '/library' },
  { label: 'Studio', to: '/studio' },
]

export function Footer() {
  return (
    <footer className="app-footer">
      <span>© {new Date().getFullYear()} Ventiq · Built for creators</span>
      <nav aria-label="Footer" className="footer-links">
        {footerLinks.map((link) => (
          <Link key={link.to} to={link.to}>
            {link.label}
          </Link>
        ))}
      </nav>
    </footer>
  )
}
