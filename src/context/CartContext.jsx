import { createContext, useContext, useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import axios from 'axios'
import { useAuth } from './AuthContext'

const CartContext = createContext()

export const useCart = () => useContext(CartContext)

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([])
  const [loading, setLoading] = useState(false)
  const { isAuthenticated } = useAuth()

  // Fetch cart from API if authenticated, otherwise from localStorage
  useEffect(() => {
    const fetchCart = async () => {
      if (isAuthenticated) {
        try {
          setLoading(true)
          const { data } = await axios.get('/api/cart', {
            withCredentials: true
          })
          setCart(data.items || [])
        } catch (error) {
          console.error('Error fetching cart:', error)
        } finally {
          setLoading(false)
        }
      } else {
        // Get cart from localStorage
        const localCart = localStorage.getItem('cart')
        if (localCart) {
          setCart(JSON.parse(localCart))
        }
      }
    }

    fetchCart()
  }, [isAuthenticated])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.setItem('cart', JSON.stringify(cart))
    }
  }, [cart, isAuthenticated])

  // Add item to cart
  const addToCart = async (product, quantity = 1) => {
    try {
      setLoading(true)
      
      // Check if product already in cart
      const existingItem = cart.find(item => item.product?._id === product._id)
      
      if (isAuthenticated) {
        // If authenticated, use API
        const { data } = await axios.post('/api/cart', {
          productId: product._id,
          quantity: existingItem ? existingItem.quantity + quantity : quantity
        }, {
          withCredentials: true
        })
        setCart(data.items)
      } else {
        // If not authenticated, update local cart
        if (existingItem) {
          setCart(cart.map(item => 
            item.product._id === product._id 
              ? { ...item, quantity: item.quantity + quantity } 
              : item
          ))
        } else {
          setCart([...cart, { product, quantity }])
        }
      }
      
      toast.success(`${product.name} added to cart`)
    } catch (error) {
      toast.error('Failed to add item to cart')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  // Remove item from cart
  const removeFromCart = async (productId) => {
    try {
      setLoading(true)
      
      if (isAuthenticated) {
        // If authenticated, use API
        await axios.delete(`/api/cart/${productId}`, {
          withCredentials: true
        })
        const { data } = await axios.get('/api/cart', {
          withCredentials: true
        })
        setCart(data.items)
      } else {
        // If not authenticated, update local cart
        setCart(cart.filter(item => item.product._id !== productId))
      }
      
      toast.success('Item removed from cart')
    } catch (error) {
      toast.error('Failed to remove item from cart')
    } finally {
      setLoading(false)
    }
  }

  // Update item quantity in cart
  const updateQuantity = async (productId, quantity) => {
    try {
      setLoading(true)
      
      if (quantity <= 0) {
        return removeFromCart(productId)
      }
      
      if (isAuthenticated) {
        // If authenticated, use API
        const { data } = await axios.put(`/api/cart/${productId}`, {
          quantity
        }, {
          withCredentials: true
        })
        setCart(data.items)
      } else {
        // If not authenticated, update local cart
        setCart(cart.map(item => 
          item.product._id === productId 
            ? { ...item, quantity } 
            : item
        ))
      }
    } catch (error) {
      toast.error('Failed to update quantity')
    } finally {
      setLoading(false)
    }
  }

  // Clear cart
  const clearCart = async () => {
    try {
      setLoading(true)
      
      if (isAuthenticated) {
        // If authenticated, use API
        await axios.delete('/api/cart', {
          withCredentials: true
        })
      }
      
      // Clear cart state
      setCart([])
      
      if (!isAuthenticated) {
        // Clear localStorage if not authenticated
        localStorage.removeItem('cart')
      }
    } catch (error) {
      toast.error('Failed to clear cart')
    } finally {
      setLoading(false)
    }
  }

  // Calculate cart totals
  const cartTotal = cart.reduce((acc, item) => {
    return acc + (item.product?.price * item.quantity)
  }, 0)

  const itemCount = cart.reduce((acc, item) => acc + item.quantity, 0)

  return (
    <CartContext.Provider value={{
      cart,
      loading,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      cartTotal,
      itemCount
    }}>
      {children}
    </CartContext.Provider>
  )
}