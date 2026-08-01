export function Skeleton({ className = '', style }) {
  return <div aria-hidden="true" className={`skeleton ${className}`} style={style} />
}

export function SkeletonCard() {
  return (
    <div aria-hidden="true" className="skeleton-card">
      <div className="skeleton sk-thumb" />
      <div style={{ padding: '14px', display: 'grid', gap: '10px' }}>
        <Skeleton style={{ height: '14px', width: '88%' }} />
        <Skeleton style={{ height: '12px', width: '56%' }} />
      </div>
    </div>
  )
}
