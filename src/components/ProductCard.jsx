import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiHeart, FiShoppingCart, FiStar } from 'react-icons/fi'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'

const ProductCard = ({ product, showPrediction = false }) => {
  const { addToCart } = useCart()
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()
  
  const inWishlist = isInWishlist(product._id)
  
  const handleAddToCart = (e) => {
    e.preventDefault()
    addToCart(product, 1)
  }
  
  const handleWishlistToggle = (e) => {
    e.preventDefault()
    if (inWishlist) {
      removeFromWishlist(product._id)
    } else {
      addToWishlist(product._id)
    }
  }
  
  // Calculate price difference for prediction
  const priceDifference = product.predictedPrice - product.price
  const percentDifference = ((priceDifference / product.price) * 100).toFixed(1)
  
  return (
    <motion.div 
      className="card group"
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <Link to={`/products/${product._id}`} className="block">
        <div className="relative overflow-hidden">
          {/* Product Image */}
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105"
          />
          
          {/* Quick Action Buttons */}
          <div className="absolute top-2 right-2 flex flex-col space-y-2">
            {/* Wishlist Button */}
            <button
              onClick={handleWishlistToggle}
              className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
              aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
            >
              <FiHeart 
                size={18} 
                className={inWishlist ? "fill-red-500 text-red-500" : "text-gray-600"}
              />
            </button>
            
            {/* Quick Add to Cart */}
            <button
              onClick={handleAddToCart}
              className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
              aria-label="Add to cart"
            >
              <FiShoppingCart size={18} className="text-gray-600" />
            </button>
          </div>
          
          {/* Price prediction tag */}
          {showPrediction && product.predictedPrice && (
            <div className={`absolute top-2 left-2 px-2 py-1 rounded text-xs font-medium ${
              priceDifference > 0 
                ? 'bg-green-500 text-white' 
                : 'bg-red-500 text-white'
            }`}>
              {priceDifference > 0 
                ? `↑ Predicted to rise ${percentDifference}%` 
                : `↓ Predicted to fall ${Math.abs(percentDifference)}%`
              }
            </div>
          )}
        </div>
        
        <div className="p-4">
          {/* Category */}
          <div className="text-xs text-gray-500 mb-1">{product.category}</div>
          
          {/* Product Name */}
          <h3 className="font-medium text-lg mb-1 line-clamp-1">{product.name}</h3>
          
          {/* Rating */}
          <div className="flex items-center mb-2">
            <div className="flex items-center">
              <FiStar className="fill-yellow-400 text-yellow-400" size={14} />
              <span className="ml-1 text-sm">{product.rating}</span>
            </div>
            <span className="text-gray-400 text-xs ml-1">({product.numReviews} reviews)</span>
          </div>
          
          {/* Price */}
          <div className="flex items-baseline">
            <span className="text-lg font-bold">${product.price.toFixed(2)}</span>
            {showPrediction && product.predictedPrice && (
              <span className={`ml-2 text-sm ${
                priceDifference > 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {priceDifference > 0 
                  ? `Predicted: $${product.predictedPrice.toFixed(2)}` 
                  : `Predicted: $${product.predictedPrice.toFixed(2)}`
                }
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

export default ProductCard