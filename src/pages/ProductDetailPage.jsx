import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiShoppingCart, FiHeart, FiStar, FiTrendingUp } from 'react-icons/fi'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'

const ProductDetailPage = () => {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const { addToCart } = useCart()
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        // For development, we'll use mock data
        // In production, this would be a real API call
        const mockProduct = {
          _id: id,
          name: 'Sample Product',
          description: 'This is a detailed description of the product with all its features and benefits.',
          price: 299.99,
          predictedPrice: 329.99,
          image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTNPmD3YNOZ_-bO-19Z7tEliZheuMJkoQJ12g&s',
          category: 'Electronics',
          brand: 'Sample Brand',
          rating: 4.5,
          numReviews: 12,
          countInStock: 5,
          features: [
            'High quality materials',
            'Durable construction',
            'Modern design',
            'Easy to use'
          ],
          specifications: {
            'Dimensions': '10 x 5 x 2 inches',
            'Weight': '1.5 lbs',
            'Material': 'Premium grade aluminum',
            'Warranty': '1 year limited'
          }
        }
        setProduct(mockProduct)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching product:', error)
        setLoading(false)
      }
    }

    fetchProduct()
  }, [id])

  const handleAddToCart = () => {
    addToCart(product, quantity)
  }

  const handleWishlistToggle = () => {
    if (isInWishlist(product._id)) {
      removeFromWishlist(product._id)
    } else {
      addToWishlist(product._id)
    }
  }

  if (loading) {
    return (
      <div className="pt-20 pb-16">
        <div className="container-custom">
          <div className="animate-pulse">
            <div className="h-96 bg-gray-300 rounded-lg mb-8"></div>
            <div className="h-8 bg-gray-300 w-1/3 rounded mb-4"></div>
            <div className="h-4 bg-gray-300 w-1/4 rounded mb-8"></div>
            <div className="h-24 bg-gray-300 rounded mb-8"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="pt-20 pb-16">
        <div className="container-custom text-center">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <p className="text-gray-600 mb-8">The product you're looking for doesn't exist.</p>
          <Link to="/products" className="btn-primary">
            Browse Products
          </Link>
        </div>
      </div>
    )
  }

  const priceDifference = product.predictedPrice - product.price
  const percentDifference = ((priceDifference / product.price) * 100).toFixed(1)

  return (
    <div className="pt-20 pb-16">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <img 
              src={product.image} 
              alt={product.name}
              className="w-full rounded-lg shadow-lg"
            />
            {product.predictedPrice && (
              <div className={`absolute top-4 left-4 px-3 py-2 rounded-full text-sm font-medium ${
                priceDifference > 0 
                  ? 'bg-green-500 text-white' 
                  : 'bg-red-500 text-white'
              }`}>
                <div className="flex items-center space-x-1">
                  <FiTrendingUp />
                  <span>
                    {priceDifference > 0 
                      ? `Predicted to rise ${percentDifference}%` 
                      : `Predicted to fall ${Math.abs(percentDifference)}%`
                    }
                  </span>
                </div>
              </div>
            )}
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-6">
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center">
                  <FiStar className="text-yellow-400 fill-yellow-400" />
                  <span className="ml-1">{product.rating}</span>
                  <span className="text-gray-500 ml-1">({product.numReviews} reviews)</span>
                </div>
                <span className="text-gray-500">|</span>
                <span className="text-gray-500">{product.brand}</span>
              </div>
              <div className="flex items-baseline space-x-4">
                <span className="text-3xl font-bold">${product.price.toFixed(2)}</span>
                {product.predictedPrice && (
                  <span className={`text-lg ${
                    priceDifference > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    Predicted: ${product.predictedPrice.toFixed(2)}
                  </span>
                )}
              </div>
            </div>

            <div className="mb-8">
              <p className="text-gray-600">{product.description}</p>
            </div>

            <div className="mb-8">
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                    Quantity
                  </label>
                  <select
                    id="quantity"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="input-field"
                  >
                    {[...Array(product.countInStock)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  onClick={handleWishlistToggle}
                  className="btn-outline flex items-center space-x-2"
                >
                  <FiHeart className={isInWishlist(product._id) ? "fill-red-500 text-red-500" : ""} />
                  <span>Wishlist</span>
                </button>
                <button
                  onClick={handleAddToCart}
                  className="btn-primary flex items-center space-x-2"
                >
                  <FiShoppingCart />
                  <span>Add to Cart</span>
                </button>
              </div>
            </div>

            {/* Features */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Features</h2>
              <ul className="space-y-2">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <span className="w-2 h-2 bg-primary-500 rounded-full mr-3"></span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            {/* Specifications */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Specifications</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="flex justify-between border-b pb-2">
                    <span className="text-gray-600">{key}</span>
                    <span className="font-medium">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetailPage