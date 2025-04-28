import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiFilter, FiX, FiChevronDown } from 'react-icons/fi'
import ProductCard from '../components/ProductCard'

const ProductPage = () => {
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [priceRange, setPriceRange] = useState([0, 1000])
  const [sortBy, setSortBy] = useState('featured')
  const location = useLocation()

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // For development, we'll use placeholder data
        // In production, this would be a real API call
        const mockProducts = generateMockProducts(20)
        setProducts(mockProducts)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching products:', error)
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  // Parse URL search params
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search)
    const category = searchParams.get('category') || 'all'
    const search = searchParams.get('search') || ''
    const sort = searchParams.get('sort') || 'featured'
    
    setSelectedCategory(category)
    setSortBy(sort)
    
    // Apply filters
    filterProducts(category, search, sort, priceRange)
  }, [location.search, products, priceRange])

  // Filter products based on criteria
  const filterProducts = (category, search, sort, price) => {
    if (products.length === 0) return
    
    let result = [...products]
    
    // Filter by category
    if (category && category !== 'all') {
      result = result.filter(product => 
        product.category.toLowerCase() === category.toLowerCase()
      )
    }
    
    // Filter by search term
    if (search) {
      const searchLower = search.toLowerCase()
      result = result.filter(product => 
        product.name.toLowerCase().includes(searchLower) || 
        product.description.toLowerCase().includes(searchLower)
      )
    }
    
    // Filter by price range
    result = result.filter(product => 
      product.price >= price[0] && product.price <= price[1]
    )
    
    // Sort products
    switch (sort) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price)
        break
      case 'price-high':
        result.sort((a, b) => b.price - a.price)
        break
      case 'newest':
        // In a real app, would sort by date
        result.sort((a, b) => b._id.localeCompare(a._id))
        break
      case 'rating':
        result.sort((a, b) => b.rating - a.rating)
        break
      case 'trending':
        // For demo, we'll use rating * reviews as a proxy for trending
        result.sort((a, b) => (b.rating * b.numReviews) - (a.rating * a.numReviews))
        break
      default: // featured
        // No specific sorting for featured
        break
    }
    
    setFilteredProducts(result)
  }

  // Helper function to generate mock products for development
  const generateMockProducts = (count) => {
    const categories = ['Electronics', 'Clothing', 'Home & Kitchen', 'Books']
    const images = [
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTNPmD3YNOZ_-bO-19Z7tEliZheuMJkoQJ12g&s',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQdAwHc5DtKvZpDiMAeNBifOzfTh4hIA6OwbA&s',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQWuv6nnciQTOD8de-j0u0XSctid6I2ozE8UA&s',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT-8SrFOsOtv4aBArFUoZyh50Tq-n7F0dIW-w&s'
    ]

    return Array.from({ length: count }, (_, i) => ({
      _id: `product-${i + 1}`,
      name: `Product ${i + 1}`,
      description: 'This is a product description with details about the product features and benefits.',
      price: Math.floor(Math.random() * 900) + 100,
      predictedPrice: Math.floor(Math.random() * 900) + 100,
      image: images[i % images.length],
      category: categories[i % categories.length],
      rating: (Math.random() * 2 + 3).toFixed(1),
      numReviews: Math.floor(Math.random() * 100) + 10,
      countInStock: Math.floor(Math.random() * 20) + 5,
    }))
  }

  // Handle price range change
  const handlePriceChange = (e, index) => {
    const newPriceRange = [...priceRange]
    newPriceRange[index] = Number(e.target.value)
    setPriceRange(newPriceRange)
  }

  return (
    <div className="pt-20 pb-16">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Mobile Filter Toggle */}
          <div className="md:hidden flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">Products</h1>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-1 btn-outline"
            >
              {showFilters ? <FiX size={18} /> : <FiFilter size={18} />}
              <span>{showFilters ? 'Hide Filters' : 'Show Filters'}</span>
            </button>
          </div>
          
          {/* Sidebar Filters - Desktop */}
          <div className={`md:w-64 shrink-0 space-y-6 ${showFilters ? 'block' : 'hidden md:block'}`}>
            <div>
              <h2 className="text-lg font-semibold mb-3">Categories</h2>
              <div className="space-y-2">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="cat-all"
                    name="category"
                    checked={selectedCategory === 'all'}
                    onChange={() => setSelectedCategory('all')}
                    className="mr-2"
                  />
                  <label htmlFor="cat-all">All Categories</label>
                </div>
                {['Electronics', 'Clothing', 'Home & Kitchen', 'Books'].map(category => (
                  <div key={category} className="flex items-center">
                    <input
                      type="radio"
                      id={`cat-${category.toLowerCase()}`}
                      name="category"
                      checked={selectedCategory === category.toLowerCase()}
                      onChange={() => setSelectedCategory(category.toLowerCase())}
                      className="mr-2"
                    />
                    <label htmlFor={`cat-${category.toLowerCase()}`}>{category}</label>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h2 className="text-lg font-semibold mb-3">Price Range</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>${priceRange[0]}</span>
                  <span>${priceRange[1]}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1000"
                  value={priceRange[0]}
                  onChange={(e) => handlePriceChange(e, 0)}
                  className="w-full"
                />
                <input
                  type="range"
                  min="0"
                  max="1000"
                  value={priceRange[1]}
                  onChange={(e) => handlePriceChange(e, 1)}
                  className="w-full"
                />
              </div>
            </div>
          </div>
          
          {/* Product Grid */}
          <div className="flex-1">
            {/* Sort Options */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <h1 className="text-2xl font-bold hidden md:block">Products</h1>
              
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="input-field appearance-none pr-8"
                >
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="newest">Newest</option>
                  <option value="rating">Highest Rated</option>
                  <option value="trending">Trending</option>
                </select>
                <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
              </div>
            </div>
            
            {/* Product Count */}
            <p className="text-gray-600 mb-6">
              Showing {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
            </p>
            
            {/* Products */}
            {loading ? (
              <div className="product-grid">
                {[...Array(8)].map((_, index) => (
                  <div key={index} className="card p-4 animate-pulse">
                    <div className="bg-gray-300 h-48 rounded-md mb-4"></div>
                    <div className="bg-gray-300 h-6 rounded w-3/4 mb-2"></div>
                    <div className="bg-gray-300 h-4 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : filteredProducts.length > 0 ? (
              <motion.div 
                className="product-grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {filteredProducts.map((product) => (
                  <ProductCard key={product._id} product={product} showPrediction />
                ))}
              </motion.div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-xl font-semibold mb-2">No products found</h3>
                <p className="text-gray-600">Try adjusting your filters or search term.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductPage