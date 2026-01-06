'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { Heart, Menu, X } from 'lucide-react'
import { useState, useEffect } from 'react'
import useAuth from '@/hooks/useAuth'

export function Navbar() {
  const { data: session, status } = useSession()
  const { user: firebaseUser, mongoUser, logOut: firebaseLogOut, loading: firebaseLoading } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState('checking') // checking, connected, offline

  // Determine which user is logged in
  const isLoggedIn = session || firebaseUser
  const currentUser = session?.user || firebaseUser
  const userName = mongoUser?.name || session?.user?.name || session?.user?.email || firebaseUser?.displayName || firebaseUser?.email
  const userImage = mongoUser?.photoURL || mongoUser?.image || firebaseUser?.photoURL || session?.user?.image
  const isLoading = status === 'loading' || firebaseLoading

  // Check connection status when user is logged in
  useEffect(() => {
    if (isLoggedIn && (firebaseUser?.email || session?.user?.email)) {
      const email = firebaseUser?.email || session?.user?.email
      
      // Quick connection test with shorter timeout
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 3000) // 3 second timeout
      
      fetch(`/api/users/check?email=${encodeURIComponent(email)}`, {
        signal: controller.signal
      })
      .then(response => {
        clearTimeout(timeoutId)
        setConnectionStatus(response.ok ? 'connected' : 'offline')
      })
      .catch((error) => {
        clearTimeout(timeoutId)
        if (error.name === 'AbortError') {
          console.warn('Connection check timed out')
        }
        setConnectionStatus('offline')
      })
    }
  }, [isLoggedIn, firebaseUser, session])

  const handleLogout = async () => {
    if (session) {
      await signOut()
    }
    if (firebaseUser) {
      await firebaseLogOut()
    }
  }

  // Prevent hydration mismatch by showing loading state
  if (isLoading) {
    return (
      <nav className="bg-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-2">
                <Heart className="h-8 w-8 text-blue-600" />
                <span className="text-xl font-bold text-gray-900">Care.xyz</span>
              </Link>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-gray-700 hover:text-blue-600 transition-colors">
                Home
              </Link>
              <Link href="/#services" className="text-gray-700 hover:text-blue-600 transition-colors">
                Services
              </Link>
              <div className="flex items-center space-x-4">
                <div className="w-16 h-8 bg-gray-200 rounded animate-pulse"></div>
                <div className="w-20 h-8 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-700 hover:text-blue-600"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
      </nav>
    )
  }

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <Heart className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">Care.xyz</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-blue-600 transition-colors">
              Home
            </Link>
            <Link href="/#services" className="text-gray-700 hover:text-blue-600 transition-colors">
              Services
            </Link>
            {isLoggedIn ? (
              <>
                <Link href="/my-bookings" className="text-gray-700 hover:text-blue-600 transition-colors">
                  My Bookings
                </Link>
                <div className="flex items-center space-x-4">
                  {/* User Avatar Dropdown */}
                  <div className="relative group">
                    <div className="flex items-center space-x-2 cursor-pointer">
                      <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-300 hover:border-blue-500 transition-colors">
                        <img
                          src={userImage || "https://ctechinfomedia.in/img/avtar%20team.jpg"}
                          alt="profile"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="text-gray-700 font-medium">{userName}</span>
                    </div>
                    
                    {/* Dropdown Menu */}
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                      <div className="p-4 border-b border-gray-100">
                        <div className="flex flex-col space-y-1">
                          <span className="font-semibold text-base text-gray-800">
                            {mongoUser?.name || firebaseUser?.displayName || session?.user?.name || "User"}
                          </span>
                          <span className="text-sm text-gray-500">
                            {mongoUser?.email || firebaseUser?.email || session?.user?.email}
                          </span>
                          {/* Connection Status */}
                          <div className="flex items-center space-x-1 mt-1">
                            <div className={`w-2 h-2 rounded-full ${
                              connectionStatus === 'connected' ? 'bg-green-500' : 
                              connectionStatus === 'offline' ? 'bg-red-500' : 'bg-yellow-500'
                            }`}></div>
                            <span className="text-xs text-gray-400">
                              {connectionStatus === 'connected' ? 'Online' : 
                               connectionStatus === 'offline' ? 'Offline' : 'Connecting...'}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="p-2">
                        <Link
                          href="/my-bookings"
                          className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                        >
                          My Bookings
                        </Link>
                        <Link
                          href="/profile"
                          className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                        >
                          Profile Settings
                        </Link>
                        <hr className="my-2" />
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors"
                        >
                          Sign Out
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  href="/auth/login"
                  className="text-gray-700 hover:text-blue-600 transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/auth/register"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-blue-600"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
              <Link
                href="/"
                className="block px-3 py-2 text-gray-700 hover:text-blue-600"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/#services"
                className="block px-3 py-2 text-gray-700 hover:text-blue-600"
                onClick={() => setIsMenuOpen(false)}
              >
                Services
              </Link>
              {isLoggedIn ? (
                <>
                  {/* Mobile User Info */}
                  <div className="px-3 py-4 border-b border-gray-200">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-gray-300">
                        <img
                          src={userImage || "https://ctechinfomedia.in/img/avtar%20team.jpg"}
                          alt="profile"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-semibold text-gray-800">
                          {mongoUser?.name || firebaseUser?.displayName || session?.user?.name || "User"}
                        </span>
                        <span className="text-sm text-gray-500">
                          {mongoUser?.email || firebaseUser?.email || session?.user?.email}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <Link
                    href="/my-bookings"
                    className="block px-3 py-2 text-gray-700 hover:text-blue-600"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    My Bookings
                  </Link>
                  <Link
                    href="/profile"
                    className="block px-3 py-2 text-gray-700 hover:text-blue-600"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Profile Settings
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout()
                      setIsMenuOpen(false)
                    }}
                    className="block w-full text-left px-3 py-2 text-red-600 hover:text-red-700"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    className="block px-3 py-2 text-gray-700 hover:text-blue-600"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    href="/auth/register"
                    className="block px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 mx-3"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}