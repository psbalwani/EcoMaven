import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth()

  // If still loading auth state, show nothing
  if (loading) {
    return null
  }

  // If not authenticated or not admin, redirect to login
  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/login" replace />
  }

  // If authenticated and admin, show the protected content
  return children
}

export default AdminRoute