import { CircleAlert, CircleCheck } from 'lucide-react'

export function Notice({ message, className = '' }) {
  if (!message) return null

  const tone = typeof message === 'object' && message !== null ? message.tone || 'error' : 'error'
  const text = typeof message === 'object' && message !== null ? message.text : message
  const Icon = tone === 'success' ? CircleCheck : CircleAlert
  const role = tone === 'error' ? 'alert' : 'status'
  const ariaLive = tone === 'error' ? 'assertive' : 'polite'

  return (
    <div aria-live={ariaLive} className={`notice notice-${tone} ${className}`} role={role}>
      <Icon />
      <span>{text}</span>
    </div>
  )
}
