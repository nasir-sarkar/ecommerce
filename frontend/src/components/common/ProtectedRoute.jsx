import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function ProtectedRoute({ requiredRole, redirectTo = '/login', children }) {
  const { isLoggedIn, role, loading } = useAuth()
  const location = useLocation()

  if (loading) return null

  if (!isLoggedIn) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />
  }

  if (requiredRole === 'admin' && role !== 'admin') {
    return <Navigate to="/login" replace />
  }
  if (requiredRole === 'seller' && role !== 'seller') {
    return <Navigate to="/seller-login" replace />
  }

  return children
}