import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { AuthForms } from './components/AuthForms'
import { Shell } from './components/Shell'
import { LoadingScreen } from './components/ui'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import { useAuth } from './hooks/useAuth'
import { AccountCenter } from './pages/AccountCenter'
import { Channel } from './pages/Channel'
import { Dashboard } from './pages/Dashboard'
import { History } from './pages/History'
import { LandingPage } from './pages/LandingPage'
import { PlaylistDetail } from './pages/PlaylistDetail'
import { Studio } from './pages/Studio'
import { Subscribers } from './pages/Subscribers'
import { Subscriptions } from './pages/Subscriptions'

function RequireAuth() {
  const { isAuthenticated, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return <LoadingScreen />
  }

  if (!isAuthenticated) {
    return <Navigate replace state={{ from: location }} to="/login" />
  }

  return <Shell />
}

function PublicAuth({ mode }) {
  const { isAuthenticated, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return <LoadingScreen />
  }

  if (isAuthenticated) {
    return <Navigate replace to={location.state?.from?.pathname || '/feed'} />
  }

  return <AuthForms initialMode={mode} />
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<LandingPage />} path="/" />
            <Route element={<PublicAuth mode="login" />} path="/login" />
            <Route element={<PublicAuth mode="signup" />} path="/signup" />
            <Route element={<RequireAuth />}>
              <Route element={<Dashboard activeView="home" />} path="/feed" />
              <Route element={<Dashboard activeView="watch" />} path="/watch/:videoId" />
              <Route element={<Dashboard activeView="tweets" />} path="/tweets" />
              <Route element={<Dashboard activeView="library" />} path="/library" />
              <Route element={<Dashboard activeView="upload" />} path="/upload" />
              <Route element={<AccountCenter />} path="/account" />
              <Route element={<Studio />} path="/studio" />
              <Route element={<History />} path="/history" />
              <Route element={<Subscriptions />} path="/subscriptions" />
              <Route element={<Subscribers />} path="/subscribers/:channelId" />
              <Route element={<Channel />} path="/channel/:username" />
              <Route element={<PlaylistDetail />} path="/playlist/:playlistId" />
            </Route>
            <Route element={<Navigate replace to="/" />} path="*" />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
