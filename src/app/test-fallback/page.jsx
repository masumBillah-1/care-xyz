'use client'

import { useState } from 'react'
import { FallbackStorage } from '@/lib/fallback-storage'
import { Heart } from 'lucide-react'

export default function TestFallbackPage() {
  const [email, setEmail] = useState('test@example.com')
  const [userData, setUserData] = useState(null)
  const [allUsers, setAllUsers] = useState([])

  const createTestUser = () => {
    const testUser = {
      email: email,
      name: 'Test User',
      image: 'https://ctechinfomedia.in/img/avtar%20team.jpg',
      contact: '+1234567890',
      nidNo: '123456789',
      provider: 'test',
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    const success = FallbackStorage.saveUser(testUser)
    if (success) {
      alert('Test user created successfully!')
      loadUser()
    } else {
      alert('Failed to create test user')
    }
  }

  const loadUser = () => {
    const user = FallbackStorage.getUser(email)
    setUserData(user)
  }

  const loadAllUsers = () => {
    const users = FallbackStorage.getAllUsers()
    setAllUsers(users)
  }

  const clearUser = () => {
    const success = FallbackStorage.clearUser(email)
    if (success) {
      alert('User cleared successfully!')
      setUserData(null)
      loadAllUsers()
    } else {
      alert('Failed to clear user')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Heart className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">Care.xyz</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Fallback Storage Test</h1>
          <p className="mt-2 text-gray-600">Test localStorage fallback system</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Controls */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Controls</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div className="space-y-2">
                <button
                  onClick={createTestUser}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
                >
                  Create Test User
                </button>
                
                <button
                  onClick={loadUser}
                  className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700"
                >
                  Load User
                </button>
                
                <button
                  onClick={loadAllUsers}
                  className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700"
                >
                  Load All Users
                </button>
                
                <button
                  onClick={clearUser}
                  className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700"
                >
                  Clear User
                </button>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Results</h2>
            
            {userData && (
              <div className="mb-6">
                <h3 className="font-semibold text-gray-800 mb-2">Current User:</h3>
                <div className="bg-gray-50 p-3 rounded-md">
                  <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                    {JSON.stringify(userData, null, 2)}
                  </pre>
                </div>
              </div>
            )}
            
            {allUsers.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">All Users ({allUsers.length}):</h3>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {allUsers.map((user, index) => (
                    <div key={index} className="bg-gray-50 p-3 rounded-md">
                      <div className="flex items-center space-x-3">
                        <img
                          src={user.image || 'https://ctechinfomedia.in/img/avtar%20team.jpg'}
                          alt="User"
                          className="w-8 h-8 rounded-full"
                        />
                        <div>
                          <p className="font-medium text-gray-800">{user.name}</p>
                          <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}