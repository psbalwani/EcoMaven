import React from 'react'

function Dashboard() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="font-semibold">Total Orders</h2>
          <p className="text-2xl mt-2">0</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="font-semibold">Total Products</h2>
          <p className="text-2xl mt-2">0</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="font-semibold">Total Users</h2>
          <p className="text-2xl mt-2">0</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="font-semibold">Total Revenue</h2>
          <p className="text-2xl mt-2">$0</p>
        </div>
      </div>
    </div>
  )
}

export default Dashboard