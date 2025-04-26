import { Link, useLocation } from 'react-router-dom'
import { FiGrid, FiBox, FiUsers, FiShoppingBag, FiSettings } from 'react-icons/fi'

const AdminSidebar = () => {
  const location = useLocation()

  const isActive = (path) => {
    return location.pathname === path
  }

  const menuItems = [
    {
      path: '/admin',
      icon: <FiGrid size={20} />,
      label: 'Dashboard'
    },
    {
      path: '/admin/products',
      icon: <FiBox size={20} />,
      label: 'Products'
    },
    {
      path: '/admin/orders',
      icon: <FiShoppingBag size={20} />,
      label: 'Orders'
    },
    {
      path: '/admin/users',
      icon: <FiUsers size={20} />,
      label: 'Users'
    },
    {
      path: '/admin/settings',
      icon: <FiSettings size={20} />,
      label: 'Settings'
    }
  ]

  return (
    <div className="w-64 bg-white h-screen shadow-lg flex-shrink-0">
      <div className="p-6">
        <Link to="/" className="text-2xl font-bold text-primary-600">
          EcoMaven
        </Link>
        <p className="text-sm text-gray-500 mt-1">Admin Dashboard</p>
      </div>
      
      <nav className="mt-6">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center px-6 py-3 text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors ${
              isActive(item.path) ? 'bg-primary-50 text-primary-600 border-r-4 border-primary-600' : ''
            }`}
          >
            <span className="mr-3">{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  )
}

export default AdminSidebar