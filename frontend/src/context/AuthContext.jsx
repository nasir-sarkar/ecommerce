import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null)
  const [token,   setToken]   = useState(null)
  const [role,    setRole]    = useState(null)
  const [loading, setLoading] = useState(true)   

  useEffect(() => {
    const storedToken = localStorage.getItem('ec_token')
    const storedUser  = localStorage.getItem('ec_user')
    const storedRole  = localStorage.getItem('ec_role')
    if (storedToken && storedUser) {
      setToken(storedToken)
      setUser(JSON.parse(storedUser))
      setRole(storedRole)
    }
    setLoading(false)   // ← done hydrating
  }, [])

  const login = (tokenVal, userData, roleVal) => {
    localStorage.setItem('ec_token', tokenVal)
    localStorage.setItem('ec_user',  JSON.stringify(userData))
    localStorage.setItem('ec_role',  roleVal)
    setToken(tokenVal)
    setUser(userData)
    setRole(roleVal)
  }

  const logout = () => {
    localStorage.removeItem('ec_token')
    localStorage.removeItem('ec_user')
    localStorage.removeItem('ec_role')
    setToken(null)
    setUser(null)
    setRole(null)
  }

  return (
    <AuthContext.Provider value={{ user, token, role, login, logout, isLoggedIn: !!token, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)