import React, { createContext, useContext, useEffect, useState } from "react"
import { fetchCsrfToken, fetchCurrentUser, loginUser, logoutUser } from "../api/auth"

export const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const restoreSession = async () => {
      try {
        await fetchCsrfToken()
        const currentUser = await fetchCurrentUser()
        setUser(currentUser)
      } catch {
        setUser(null)
      } finally {
        setLoading(false)
      }
    }
    restoreSession()
  }, [])

  useEffect(() => {
    const handleLogout = () => setUser(null)
    window.addEventListener("force-logout", handleLogout)
    return () => window.removeEventListener("force-logout", handleLogout)
  }, [])

  const login = async (credentials) => {
    const currentUser = await loginUser(credentials)
    setUser(currentUser)
    return currentUser
  }

  const logout = async () => {
    try {
      await logoutUser()
    } catch {
      // Cookie clear can fail if the session is already gone.
    }
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
