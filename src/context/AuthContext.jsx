import { useCallback, useEffect, useMemo, useState } from 'react'
import { api, tokenStore } from '../api/client'
import { AuthContext } from './AuthContextCore'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadCurrentUser = useCallback(async () => {
    if (!tokenStore.getAccessToken()) {
      setLoading(false)
      return null
    }

    try {
      const currentUser = await api.auth.currentUser()
      setUser(currentUser)
      setError('')
      return currentUser
    } catch (err) {
      tokenStore.clear()
      setUser(null)
      setError(err.message)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    let isMounted = true

    async function initializeUser() {
      if (!tokenStore.getAccessToken()) {
        if (isMounted) setLoading(false)
        return
      }

      try {
        const currentUser = await api.auth.currentUser()
        if (!isMounted) return
        setUser(currentUser)
        setError('')
      } catch (err) {
        if (!isMounted) return
        tokenStore.clear()
        setUser(null)
        setError(err.message)
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    initializeUser()

    return () => {
      isMounted = false
    }
  }, [])

  const login = useCallback(async (credentials) => {
    const data = await api.auth.login(credentials)
    tokenStore.setTokens(data)
    setUser(data.user)
    setError('')
    return data.user
  }, [])

  const register = useCallback(async (formData) => {
    return api.auth.register(formData)
  }, [])

  const logout = useCallback(async () => {
    try {
      await api.auth.logout()
    } finally {
      tokenStore.clear()
      setUser(null)
    }
  }, [])

  const value = useMemo(
    () => ({ user, loading, error, isAuthenticated: Boolean(user), login, logout, register, refreshUser: loadCurrentUser }),
    [error, loadCurrentUser, loading, login, logout, register, user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
