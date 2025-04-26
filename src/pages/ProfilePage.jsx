import React from 'react'
import { useAuth } from '../context/AuthContext'

function ProfilePage() {
  const { user } = useAuth()

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Profile</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-2">Email</label>
            <p className="text-gray-900">{user?.email}</p>
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">Name</label>
            <p className="text-gray-900">{user?.name || 'Not set'}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage