import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import axios from 'axios'
import { FiTrendingUp, FiShoppingBag, FiStar, FiClock } from 'react-icons/fi'
import ProductCard from '../components/ProductCard'
import HeroSlider from '../components/HeroSlider'
import CategorySection from '../components/CategorySection'

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [trendingProducts, setTrendingProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // For development, we'll use placeholder data
        // In production, this would be a real API call
        const mockProducts = generateMockProducts(8)
        setFeaturedProducts(mockProducts.slice(0, 4))
        setTrendingProducts(mockProducts.slice(4, 8))
        setLoading(false)
      } catch (error) {
        console.error('Error fetching products:', error)
        setLoading(false)
      }
    }

    fetchProducts()

    //chatbot
    const script1 = document.createElement('script')
    script1.src = 'https://cdn.botpress.cloud/webchat/v2.2/inject.js'
    script1.async = true
    document.body.appendChild(script1)

    const script2 = document.createElement('script')
    script2.src = 'https://files.bpcontent.cloud/2025/03/01/16/20250301163502-JIDPRAI6.js'
    script2.async = true
    document.body.appendChild(script2)

    return () => {
      document.body.removeChild(script1)
      document.body.removeChild(script2)
    }
  }, [])

  // Helper function to generate mock products for development
  const generateMockProducts = (count) => {
    const categories = ['Electronics', 'Clothing', 'Home & Kitchen', 'Books']
    const images = [
      'https://images.pexels.com/photos/404280/pexels-photo-404280.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'https://images.pexels.com/photos/4226733/pexels-photo-4226733.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'https://images.pexels.com/photos/1194775/pexels-photo-1194775.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    ]

    return Array.from({ length: count }, (_, i) => ({
      _id: `product-${i + 1}`,
      name: `Product ${i + 1}`,
      description: 'This is a product description with details about the product features and benefits.',
      price: Math.floor(Math.random() * 900) + 100,
      predictedPrice: Math.floor(Math.random() * 800) + 100,
      image: images[i % images.length],
      category: categories[i % categories.length],
      rating: (Math.random() * 2 + 3).toFixed(1),
      numReviews: Math.floor(Math.random() * 100) + 10,
      countInStock: Math.floor(Math.random() * 20) + 5,
    }))
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  }

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <HeroSlider />
      
      {/* Featured Categories */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-2">Shop By Category</h2>
            <p className="text-gray-600">Browse our top categories and find what you need</p>
          </motion.div>
          
          <CategorySection />
        </div>
      </section>
      
      {/* Featured Products */}
      <section className="py-16">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold">Featured Products</h2>
              <p className="text-gray-600 mt-2">Top picks from our collection</p>
            </div>
            <Link to="/products" className="btn-primary">
              View All
            </Link>
          </div>
          
          {loading ? (
            <div className="product-grid">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="card p-4 animate-pulse">
                  <div className="bg-gray-300 h-48 rounded-md mb-4"></div>
                  <div className="bg-gray-300 h-6 rounded w-3/4 mb-2"></div>
                  <div className="bg-gray-300 h-4 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : (
            <motion.div 
              className="product-grid"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {featuredProducts.map((product) => (
                <motion.div key={product._id} variants={itemVariants}>
                  <ProductCard product={product} showPrediction />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>
      
      {/* Benefits Section */}
      <section className="py-16 bg-primary-900 text-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-2">Why Shop With Us</h2>
            <p className="text-primary-200">Experience shopping like never before</p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <motion.div 
              className="text-center p-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <div className="flex justify-center mb-4">
                <FiShoppingBag size={40} className="text-secondary-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Premium Selection</h3>
              <p className="text-primary-200">Curated products from top brands and artisans</p>
            </motion.div>
            
            <motion.div 
              className="text-center p-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="flex justify-center mb-4">
                <FiTrendingUp size={40} className="text-secondary-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Price Prediction</h3>
              <p className="text-primary-200">AI-driven price insights to help you save</p>
            </motion.div>
            
            <motion.div 
              className="text-center p-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <div className="flex justify-center mb-4">
                <FiClock size={40} className="text-secondary-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
              <p className="text-primary-200">Quick and reliable shipping to your doorstep</p>
            </motion.div>
            
            <motion.div 
              className="text-center p-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <div className="flex justify-center mb-4">
                <FiStar size={40} className="text-secondary-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Trusted Reviews</h3>
              <p className="text-primary-200">Authentic feedback from verified customers</p>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Trending Products */}
      <section className="py-16">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold">Trending Now</h2>
              <p className="text-gray-600 mt-2">See what's popular in the community</p>
            </div>
            <Link to="/products?sort=trending" className="btn-primary">
              View All
            </Link>
          </div>
          
          {loading ? (
            <div className="product-grid">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="card p-4 animate-pulse">
                  <div className="bg-gray-300 h-48 rounded-md mb-4"></div>
                  <div className="bg-gray-300 h-6 rounded w-3/4 mb-2"></div>
                  <div className="bg-gray-300 h-4 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : (
            <motion.div 
              className="product-grid"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {trendingProducts.map((product) => (
                <motion.div key={product._id} variants={itemVariants}>
                  <ProductCard product={product} showPrediction />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>
      
      {/* Newsletter Section */}
      <section className="py-16 bg-gray-100">
        <div className="container-custom">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
            <p className="text-gray-600 mb-8">
              Subscribe to our newsletter for exclusive deals, new arrivals, and price predictions
            </p>
            
            <form className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="input-field flex-grow"
                required
              />
              <button type="submit" className="btn-primary whitespace-nowrap">
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage