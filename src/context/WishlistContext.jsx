import { createContext, useContext, useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import axios from 'axios'
import { useAuth } from './AuthContext'

const WishlistContext = createContext()

export const useWishlist = () => useContext(WishlistContext)

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([])
  const [loading, setLoading] = useState(false)
  const { isAuthenticated } = useAuth()

  // Fetch wishlist from API if authenticated, otherwise from localStorage
  useEffect(() => {
    const fetchWishlist = async () => {
      if (isAuthenticated) {
        try {
          setLoading(true)
          const { data } = await axios.get('/api/wishlist', {
            withCredentials: true
          })
          setWishlist(data || [])
        } catch (error) {
          console.error('Error fetching wishlist:', error)
        } finally {
          setLoading(false)
        }
      } else {
        // Get wishlist from localStorage
        const localWishlist = localStorage.getItem('wishlist')
        if (localWishlist) {
          setWishlist(JSON.parse(localWishlist))
        }
      }
    }

    fetchWishlist()
  }, [isAuthenticated])

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.setItem('wishlist', JSON.stringify(wishlist))
    }
  }, [wishlist, isAuthenticated])

  // Add item to wishlist
  const addToWishlist = async (product) => {
    try {
      setLoading(true)
      
      // Check if product already in wishlist
      const isInWishlist = wishlist.some(item => 
        item._id === product._id || item.product?._id === product._id
      )
      
      if (isInWishlist) {
        toast.info(`${product.name} is already in your wishlist`)
        setLoading(false)
        return
      }
      
      if (isAuthenticated) {
        // If authenticated, use API
        const { data } = await axios.post('/api/wishlist', {
          productId: product._id
        }, {
          withCredentials: true
        })
        setWishlist(data)
      } else {
        // If not authenticated, update local wishlist
        setWishlist([...wishlist, product])
      }
      
      toast.success(`${product.name} added to wishlist`)
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      toast.error(error.response?.data?.message || 'Failed to add item to wishlist')
    } finally {
      setLoading(false)
    }
  }

  // Remove item from wishlist
  const removeFromWishlist = async (productId) => {
    try {
      setLoading(true)
      
      if (isAuthenticated) {
        // If authenticated, use API
        await axios.delete(`/api/wishlist/${productId}`, {
          withCredentials: true
        })
        const { data } = await axios.get('/api/wishlist', {
          withCredentials: true
        })
        setWishlist(data)
      } else {
        // If not authenticated, update local wishlist
        setWishlist(wishlist.filter(item => 
          (item._id !== productId && item.product?._id !== productId)
        ))
      }
      
      toast.success('Item removed from wishlist')
    } catch (error) {
      toast.error('Failed to remove item from wishlist')
    } finally {
      setLoading(false)
    }
  }

  // Check if an item is in the wishlist
  const isInWishlist = (productId) => {
    return wishlist.some(item => 
      item._id === productId || item.product?._id === productId
    )
  }

  return (
    <WishlistContext.Provider value={{
      wishlist,
      loading,
      addToWishlist,
      removeFromWishlist,
      isInWishlist
    }}>
      {children}
    </WishlistContext.Provider>
  )
}