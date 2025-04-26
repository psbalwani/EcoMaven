import { useState } from 'react'
import { FiBell, FiSearch, FiUser } from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext'

const AdminHeader = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const { user } = useAuth()

  const handleSearch = (e) => {
    e.preventDefault()
    // Implement search functionality
    console.log('Searching for:', searchQuery)
  }

  return (
    <header className="bg-white shadow-sm">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <form onSubmit={handleSearch} className="flex-1 max-w-lg">
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            </div>
          </form>

          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <button className="relative p-2 text-gray-600 hover:text-primary-600 transition-colors">
              <FiBell size={20} />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* User Menu */}
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-500">Administrator</p>
              </div>
              <button className="p-2 text-gray-600 hover:text-primary-600 transition-colors">
                <FiUser size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default AdminHeader