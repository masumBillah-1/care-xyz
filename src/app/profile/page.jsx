'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { User, Mail, Phone, CreditCard, Camera, Heart } from 'lucide-react'
import toast from 'react-hot-toast'
import useAuth from '@/hooks/useAuth'

export default function ProfilePage() {
  const { data: session } = useSession()
  const { user: firebaseUser, mongoUser } = useAuth()
  const router = useRouter()
  
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contact: '',
    nidNo: '',
    photoURL: ''
  })

  // Check if user is logged in
  const isLoggedIn = session || firebaseUser
  
  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/auth/login')
      return
    }

    // Populate form with existing data
    setFormData({
      name: mongoUser?.name || firebaseUser?.displayName || session?.user?.name || '',
      email: mongoUser?.email || firebaseUser?.email || session?.user?.email || '',
      contact: mongoUser?.contact || '',
      nidNo: mongoUser?.nidNo || '',
      photoURL: mongoUser?.photoURL || mongoUser?.image || firebaseUser?.photoURL || session?.user?.image || ''
    })
  }, [isLoggedIn, mongoUser, firebaseUser, session, router])

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    const loadingToast = toast.loading('Updating profile...')

    try {
      const response = await fetch('/api/users/update-profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          ...formData
        }),
      })

      if (response.ok) {
        toast.success('Profile updated successfully!', { id: loadingToast })
      } else {
        const data = await response.json()
        toast.error(data.message || 'Failed to update profile', { id: loadingToast })
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.', { id: loadingToast })
    } finally {
      setIsLoading(false)
    }
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Heart className="h-12 w-12 text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Please login to view your profile</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Heart className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">Care.xyz</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
          <p className="mt-2 text-gray-600">Manage your account information</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Profile Picture Section */}
          <div className="text-center mb-8">
            <div className="relative inline-block">
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-gray-300 mx-auto">
                <img
                  src={formData.photoURL || "https://ctechinfomedia.in/img/avtar%20team.jpg"}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <button className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors">
                <Camera className="h-4 w-4" />
              </button>
            </div>
            <p className="mt-2 text-sm text-gray-500">Click to change profile picture</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your full name"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  disabled
                  value={formData.email}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md bg-gray-100 text-gray-500 cursor-not-allowed"
                  placeholder="Email cannot be changed"
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">Email address cannot be changed</p>
            </div>

            <div>
              <label htmlFor="contact" className="block text-sm font-medium text-gray-700 mb-2">
                Contact Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="contact"
                  name="contact"
                  type="tel"
                  value={formData.contact}
                  onChange={handleInputChange}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your contact number"
                />
              </div>
            </div>

            <div>
              <label htmlFor="nidNo" className="block text-sm font-medium text-gray-700 mb-2">
                NID Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <CreditCard className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="nidNo"
                  name="nidNo"
                  type="text"
                  value={formData.nidNo}
                  onChange={handleInputChange}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your NID number"
                />
              </div>
            </div>

            <div>
              <label htmlFor="photoURL" className="block text-sm font-medium text-gray-700 mb-2">
                Profile Picture URL
              </label>
              <input
                id="photoURL"
                name="photoURL"
                type="url"
                value={formData.photoURL}
                onChange={handleInputChange}
                className="block w-full px-3 py-3 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter image URL"
              />
            </div>

            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? 'Updating...' : 'Update Profile'}
              </button>
              <button
                type="button"
                onClick={() => router.push('/')}
                className="flex-1 bg-gray-600 text-white py-3 px-4 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}