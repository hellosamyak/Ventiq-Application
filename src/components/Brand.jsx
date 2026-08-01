import { Link } from 'react-router-dom'

export function Brand({ to = '/feed', onDark = false, className = '' }) {
  return (
    <Link className={`brand ${onDark ? 'on-dark' : ''} ${className}`} to={to}>
      <span className="brand-mark">V</span>
      <span>Ventiq</span>
    </Link>
  )
}
