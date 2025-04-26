import React from 'react'
import { useParams } from 'react-router-dom'

function OrderDetailPage() {
  const { id } = useParams()

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Order Details</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600">Order ID: {id}</p>
        {/* Order details will be implemented later */}
      </div>
    </div>
  )
}

export default OrderDetailPage