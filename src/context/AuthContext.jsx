import { createContext, useContext, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import axios from 'axios'

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  // Check if user is logged in
  const checkAuthStatus = useCallback(async () => {
    try {
      const { data } = await axios.get('/api/users/profile', {
        withCredentials: true
      })
      setUser(data)
    } catch (error) {
      setUser(null)
    }
  }, [])

  // Register user
  const register = async (userData) => {
    setLoading(true)
    try {
      const { data } = await axios.post('/api/users/register', userData)
      setUser(data)
      toast.success('Registration successful')
      navigate('/')
      return data
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed'
      toast.error(message)
      throw new Error(message)
    } finally {
      setLoading(false)
    }
  }

  // Login user
  const login = async (email, password) => {
    setLoading(true)
    try {
      const { data } = await axios.post('/api/users/login', { email, password }, {
        withCredentials: true
      })
      setUser(data)
      toast.success('Login successful')
      navigate('/')
      return data
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed'
      toast.error(message)
      throw new Error(message)
    } finally {
      setLoading(false)
    }
  }

  // Logout user
  const logout = async () => {
    try {
      await axios.post('/api/users/logout', {}, {
        withCredentials: true
      })
      setUser(null)
      toast.success('Logged out successfully')
      navigate('/')
    } catch (error) {
      toast.error('Logout failed')
    }
  }

  // Update user profile
  const updateProfile = async (userData) => {
    setLoading(true)
    try {
      const { data } = await axios.put('/api/users/profile', userData, {
        withCredentials: true
      })
      setUser(data)
      toast.success('Profile updated successfully')
      return data
    } catch (error) {
      const message = error.response?.data?.message || 'Profile update failed'
      toast.error(message)
      throw new Error(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      register, 
      login, 
      logout, 
      updateProfile, 
      checkAuthStatus,
      isAuthenticated: !!user,
      isAdmin: user?.isAdmin || false
    }}>
      {children}
    </AuthContext.Provider>
  )
}