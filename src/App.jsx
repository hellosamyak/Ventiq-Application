import { useState } from 'react'
import { AuthForms } from './components/AuthForms'
import { Shell } from './components/Shell'
import { AuthProvider } from './context/AuthContext'
import { useAuth } from './hooks/useAuth'
import { Dashboard } from './pages/Dashboard'

function AppContent() {
  const { isAuthenticated, loading } = useAuth()
  const [activeView, setActiveView] = useState('home')

  if (loading) {
    return <div className="loading-screen">Loading Ventiq...</div>
  }

  if (!isAuthenticated) {
    return <AuthForms />
  }

  return (
    <Shell activeView={activeView} onNavigate={setActiveView}>
      <Dashboard activeView={activeView} setActiveView={setActiveView} />
    </Shell>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App
