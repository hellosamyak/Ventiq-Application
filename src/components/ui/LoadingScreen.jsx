export function LoadingScreen() {
  return (
    <div aria-busy="true" aria-live="polite" className="loading-screen" role="status">
      <div className="splash">
        <span className="brand-mark">V</span>
        <p>Ventiq</p>
      </div>
    </div>
  )
}
