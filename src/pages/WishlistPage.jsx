import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiHeart, FiShoppingCart } from 'react-icons/fi'
import { useWishlist } from '../context/WishlistContext'
import { useCart } from '../context/CartContext'

const WishlistPage = () => {
  const { wishlist, removeFromWishlist } = useWishlist()
  const { addToCart } = useCart()

  const handleAddToCart = (product) => {
    addToCart(product, 1)
    removeFromWishlist(product._id)
  }

  if (wishlist.length === 0) {
    return (
      <div className="pt-20 pb-16">
        <div className="container-custom">
          <div className="text-center py-16">
            <FiHeart size={48} className="mx-auto text-gray-400 mb-4" />
            <h2 className="text-2xl font-bold mb-2">Your wishlist is empty</h2>
            <p className="text-gray-600 mb-8">Save items you'd like to purchase later</p>
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
        <h1 className="text-2xl font-bold mb-8">My Wishlist</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlist.map((product) => (
            <motion.div
              key={product._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="card overflow-hidden"
            >
              <Link to={`/products/${product._id}`} className="block">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
              </Link>
              
              <div className="p-4">
                <Link 
                  to={`/products/${product._id}`}
                  className="text-lg font-medium hover:text-primary-600 transition-colors"
                >
                  {product.name}
                </Link>
                
                <div className="flex items-center justify-between mt-2">
                  <span className="text-lg font-bold">${product.price.toFixed(2)}</span>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => removeFromWishlist(product._id)}
                      className="p-2 text-gray-500 hover:text-red-500 transition-colors"
                      aria-label="Remove from wishlist"
                    >
                      <FiHeart size={20} className="fill-current" />
                    </button>
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="p-2 text-gray-500 hover:text-primary-600 transition-colors"
                      aria-label="Add to cart"
                    >
                      <FiShoppingCart size={20} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default WishlistPage