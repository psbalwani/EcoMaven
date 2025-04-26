import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiTrash2, FiShoppingBag } from 'react-icons/fi'
import { useCart } from '../context/CartContext'

const CartPage = () => {
  const { cart, updateQuantity, removeFromCart, cartTotal } = useCart()

  if (cart.length === 0) {
    return (
      <div className="pt-20 pb-16">
        <div className="container-custom">
          <div className="text-center py-16">
            <FiShoppingBag size={48} className="mx-auto text-gray-400 mb-4" />
            <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-8">Add some items to your cart to get started</p>
            <Link to="/products" className="btn-primary">
              Browse Products
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-20 pb-16">
      <div className="container-custom">
        <h1 className="text-2xl font-bold mb-8">Shopping Cart</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {cart.map((item) => (
                <motion.div
                  key={item.product._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="card p-4 flex items-center"
                >
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                  
                  <div className="ml-4 flex-1">
                    <Link 
                      to={`/products/${item.product._id}`}
                      className="text-lg font-medium hover:text-primary-600 transition-colors"
                    >
                      {item.product.name}
                    </Link>
                    <p className="text-gray-600">${item.product.price.toFixed(2)}</p>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <select
                      value={item.quantity}
                      onChange={(e) => updateQuantity(item.product._id, Number(e.target.value))}
                      className="input-field w-20"
                    >
                      {[...Array(item.product.countInStock)].map((_, i) => (
                        <option key={i + 1} value={i + 1}>
                          {i + 1}
                        </option>
                      ))}
                    </select>
                    
                    <button
                      onClick={() => removeFromCart(item.product._id)}
                      className="text-gray-500 hover:text-red-500 transition-colors"
                    >
                      <FiTrash2 size={20} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="card p-6">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span>${(cartTotal * 0.1).toFixed(2)}</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>${(cartTotal * 1.1).toFixed(2)}</span>
                  </div>
                </div>
              </div>
              
              <Link to="/checkout" className="btn-primary w-full">
                Proceed to Checkout
              </Link>
              
              <Link 
                to="/products" 
                className="block text-center mt-4 text-primary-600 hover:text-primary-700"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CartPage