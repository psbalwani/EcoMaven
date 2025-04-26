import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FiPackage, FiClock, FiCheck, FiX } from 'react-icons/fi'
import axios from 'axios'

const OrdersPage = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await axios.get('/api/orders/myorders', {
          withCredentials: true
        })
        setOrders(data)
        setLoading(false)
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch orders')
        setLoading(false)
      }
    }

    fetchOrders()
  }, [])

  const getStatusIcon = (isPaid, isDelivered) => {
    if (isDelivered) return <FiCheck className="text-green-500" size={20} />
    if (isPaid) return <FiClock className="text-orange-500" size={20} />
    return <FiX className="text-red-500" size={20} />
  }

  if (loading) {
    return (
      <div className="container-custom py-8">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white p-6 rounded-lg shadow-md">
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container-custom py-8">
        <div className="bg-red-50 p-4 rounded-md">
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container-custom py-8">
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center py-12">
          <FiPackage size={48} className="mx-auto text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold mb-2">No orders yet</h2>
          <p className="text-gray-600 mb-4">Looks like you haven't placed any orders</p>
          <Link to="/products" className="btn-primary">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                <div>
                  <p className="text-sm text-gray-600">Order #{order._id}</p>
                  <p className="text-sm text-gray-600">
                    Placed on {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="mt-2 md:mt-0">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100">
                    {getStatusIcon(order.isPaid, order.isDelivered)}
                    <span className="ml-2">
                      {order.isDelivered
                        ? 'Delivered'
                        : order.isPaid
                        ? 'In Transit'
                        : 'Processing'}
                    </span>
                  </span>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <div className="flow-root">
                  <ul className="-my-6 divide-y divide-gray-200">
                    {order.orderItems.map((item) => (
                      <li key={item._id} className="py-6 flex">
                        <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-full w-full object-cover object-center"
                          />
                        </div>
                        <div className="ml-4 flex flex-1 flex-col">
                          <div>
                            <div className="flex justify-between text-base font-medium text-gray-900">
                              <h3>{item.name}</h3>
                              <p className="ml-4">${item.price}</p>
                            </div>
                          </div>
                          <div className="flex flex-1 items-end justify-between text-sm">
                            <p className="text-gray-500">Qty {item.qty}</p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4 mt-4">
                <div className="flex justify-between text-base font-medium text-gray-900">
                  <p>Total</p>
                  <p>${order.totalPrice}</p>
                </div>
                <div className="mt-4">
                  <Link
                    to={`/orders/${order._id}`}
                    className="btn-primary w-full text-center"
                  >
                    View Order Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default OrdersPage