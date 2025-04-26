import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FiShoppingCart, FiHeart, FiUser, FiMenu, FiX, FiSearch } from 'react-icons/fi'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [scrolled, setScrolled] = useState(false)
  const { user, isAuthenticated, logout } = useAuth()
  const { itemCount } = useCart()
  const navigate = useNavigate()
  const location = useLocation()

  // Close mobile menu when changing routes
  useEffect(() => {
    setIsOpen(false)
  }, [location])

  // Add scroll event listener
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/products?search=${searchQuery}`)
      setSearchQuery('')
    }
  }

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'
      }`}
    >
      <div className="container-custom flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-primary-700 font-bold text-2xl">
          EcoMaven
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-8">
          <Link to="/" className="font-medium hover:text-primary-600 transition-colors">
            Home
          </Link>
          <Link to="/products" className="font-medium hover:text-primary-600 transition-colors">
            Products
          </Link>
        </nav>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="hidden md:flex relative flex-1 max-w-sm mx-6">
          <input
            type="text"
            placeholder="Search products..."
            className="input-field pr-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button 
            type="submit" 
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-primary-600"
          >
            <FiSearch size={18} />
          </button>
        </form>

        {/* Right Icons */}
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/wishlist" className="relative">
            <FiHeart size={20} className="hover:text-primary-600 transition-colors" />
          </Link>
          <Link to="/cart" className="relative">
            <FiShoppingCart size={20} className="hover:text-primary-600 transition-colors" />
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                {itemCount}
              </span>
            )}
          </Link>
          
          {isAuthenticated ? (
            <div className="relative group">
              <button className="flex items-center space-x-1">
                <FiUser size={20} className="hover:text-primary-600 transition-colors" />
              </button>
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-10">
                <div className="py-1">
                  <Link 
                    to="/profile" 
                    className="block px-4 py-2 text-gray-800 hover:bg-primary-50"
                  >
                    Profile
                  </Link>
                  <Link 
                    to="/orders" 
                    className="block px-4 py-2 text-gray-800 hover:bg-primary-50"
                  >
                    Orders
                  </Link>
                  {user?.isAdmin && (
                    <Link 
                      to="/admin" 
                      className="block px-4 py-2 text-gray-800 hover:bg-primary-50"
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  <button 
                    onClick={logout} 
                    className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-primary-50"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <Link 
              to="/login" 
              className="font-medium hover:text-primary-600 transition-colors"
            >
              Login
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-gray-700"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white shadow-lg overflow-hidden"
          >
            <div className="container-custom py-4 space-y-4">
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  className="input-field pr-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button 
                  type="submit" 
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
                >
                  <FiSearch size={18} />
                </button>
              </form>

              <nav className="flex flex-col space-y-3">
                <Link to="/" className="font-medium py-2">
                  Home
                </Link>
                <Link to="/products" className="font-medium py-2">
                  Products
                </Link>
                <Link to="/wishlist" className="font-medium py-2 flex items-center">
                  <FiHeart size={18} className="mr-2" /> Wishlist
                </Link>
                <Link to="/cart" className="font-medium py-2 flex items-center">
                  <FiShoppingCart size={18} className="mr-2" /> Cart 
                  {itemCount > 0 && (
                    <span className="ml-2 bg-primary-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                      {itemCount}
                    </span>
                  )}
                </Link>
                
                {isAuthenticated ? (
                  <>
                    <Link to="/profile" className="font-medium py-2">
                      Profile
                    </Link>
                    <Link to="/orders" className="font-medium py-2">
                      Orders
                    </Link>
                    {user?.isAdmin && (
                      <Link to="/admin" className="font-medium py-2">
                        Admin Dashboard
                      </Link>
                    )}
                    <button 
                      onClick={logout} 
                      className="font-medium py-2 text-left"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <Link to="/login" className="font-medium py-2">
                    Login
                  </Link>
                )}
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

export default Navbar