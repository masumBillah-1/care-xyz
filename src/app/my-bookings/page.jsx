'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Calendar, Clock, MapPin, Phone, Mail, Star, CheckCircle, XCircle, AlertCircle, Eye, MessageSquare } from 'lucide-react'
import toast from 'react-hot-toast'
import useAuth from '@/hooks/useAuth'

// Mock data - replace with actual API call
const mockBookings = [
  {
    id: '1',
    serviceName: 'Baby Care Service',
    serviceCategory: 'childcare',
    providerName: 'Sarah Johnson',
    providerPhone: '+880 1712-345678',
    providerEmail: 'sarah@example.com',
    date: '2024-01-15',
    time: '09:00',
    duration: 4,
    location: 'Dhanmondi, Dhaka',
    status: 'confirmed',
    totalAmount: 600,
    specialInstructions: 'Please bring age-appropriate toys for 2-year-old'
  },
  {
    id: '2',
    serviceName: 'Elderly Care Service',
    serviceCategory: 'elderly',
    providerName: 'Dr. Ahmed Rahman',
    providerPhone: '+880 1812-345678',
    providerEmail: 'ahmed@example.com',
    date: '2024-01-12',
    time: '14:00',
    duration: 6,
    location: 'Gulshan, Dhaka',
    status: 'completed',
    totalAmount: 1200,
    rating: 5,
    review: 'Excellent care provided. Very professional and caring.'
  },
  {
    id: '3',
    serviceName: 'Sick People Care Service',
    serviceCategory: 'medical',
    providerName: 'Nurse Maria',
    providerPhone: '+880 1912-345678',
    providerEmail: 'maria@example.com',
    date: '2024-01-20',
    time: '10:00',
    duration: 8,
    location: 'Uttara, Dhaka',
    status: 'pending',
    totalAmount: 2000,
    specialInstructions: 'Patient recovering from surgery, needs medication assistance'
  }
]

export default function MyBookingsPage() {
  const { data: session, status } = useSession()
  const { user: firebaseUser, loading: firebaseLoading } = useAuth()
  const router = useRouter()
  const [bookings, setBookings] = useState([])
  const [activeTab, setActiveTab] = useState('all')
  const [isLoading, setIsLoading] = useState(true)
  const [mounted, setMounted] = useState(false)

  // Check if user is authenticated (either NextAuth or Firebase)
  const isAuthenticated = session || firebaseUser
  const isAuthLoading = status === 'loading' || firebaseLoading
  const userEmail = session?.user?.email || firebaseUser?.email

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (isAuthLoading) return
    
    if (!isAuthenticated) {
      router.push('/auth/login?callbackUrl=/my-bookings')
      return
    }

    // Fetch real bookings from MongoDB
    const fetchBookings = async () => {
      try {
        const response = await fetch(`/api/bookings?email=${encodeURIComponent(userEmail)}`)
        if (response.ok) {
          const data = await response.json()
          setBookings(data.bookings || [])
        } else {
          // If API fails, show mock data for demo
          console.warn('Failed to load bookings from API, using mock data')
          setBookings(mockBookings)
          toast.error('Using demo data - database connection issue')
        }
      } catch (error) {
        console.error('Error loading bookings:', error)
        // Fallback to mock data
        setBookings(mockBookings)
        toast.error('Using demo data - connection error')
      } finally {
        setIsLoading(false)
      }
    }

    fetchBookings()
  }, [isAuthenticated, isAuthLoading, userEmail, router])

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'pending':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-blue-500" />
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-red-500" />
      case 'in-progress':
        return <Clock className="w-5 h-5 text-purple-500" />
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'completed':
        return 'bg-blue-100 text-blue-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      case 'in-progress':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (dateString) => {
    if (!mounted) return dateString // Prevent hydration mismatch
    
    try {
      return new Date(dateString).toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })
    } catch {
      return dateString
    }
  }

  const filteredBookings = bookings.filter(booking => {
    if (activeTab === 'all') return true
    if (activeTab === 'upcoming') return ['pending', 'confirmed', 'in-progress'].includes(booking.status)
    if (activeTab === 'completed') return booking.status === 'completed'
    if (activeTab === 'cancelled') return booking.status === 'cancelled'
    return true
  })

  const handleCancelBooking = async (bookingId) => {
    const loadingToast = toast.loading('Cancelling booking...')
    
    try {
      const response = await fetch('/api/bookings', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookingId,
          action: 'cancel',
          userEmail: userEmail // Pass user email for Firebase users
        }),
      })

      if (response.ok) {
        setBookings(prev => 
          prev.map(booking => 
            booking.id === bookingId 
              ? { ...booking, status: 'cancelled' }
              : booking
          )
        )
        toast.success('Booking cancelled successfully', { id: loadingToast })
      } else {
        const errorData = await response.json()
        toast.error(errorData.error || 'Failed to cancel booking', { id: loadingToast })
      }
    } catch (error) {
      console.error('Error cancelling booking:', error)
      toast.error('Error cancelling booking', { id: loadingToast })
    }
  }

  const handleRateService = async (bookingId, rating) => {
    try {
      const response = await fetch('/api/bookings', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookingId,
          action: 'rate',
          rating,
          userEmail: userEmail // Pass user email for Firebase users
        }),
      })

      if (response.ok) {
        setBookings(prev => 
          prev.map(booking => 
            booking.id === bookingId 
              ? { ...booking, rating }
              : booking
          )
        )
        toast.success('Rating submitted successfully')
      } else {
        const errorData = await response.json()
        toast.error(errorData.error || 'Failed to submit rating')
      }
    } catch (error) {
      console.error('Error submitting rating:', error)
      toast.error('Error submitting rating')
    }
  }

  if (!mounted || isAuthLoading || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your bookings...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
          <p className="mt-2 text-gray-600">Manage and track your care service bookings</p>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { key: 'all', label: 'All Bookings', count: bookings.length },
                { key: 'upcoming', label: 'Upcoming', count: bookings.filter(b => ['pending', 'confirmed', 'in-progress'].includes(b.status)).length },
                { key: 'completed', label: 'Completed', count: bookings.filter(b => b.status === 'completed').length },
                { key: 'cancelled', label: 'Cancelled', count: bookings.filter(b => b.status === 'cancelled').length }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.key
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label} ({tab.count})
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Bookings List */}
        {filteredBookings.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No bookings found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {activeTab === 'all' ? "You haven't made any bookings yet." : `No ${activeTab} bookings found.`}
            </p>
            <div className="mt-6">
              <button
                onClick={() => router.push('/#services')}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Browse Services
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredBookings.map((booking) => (
              <div key={booking.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <h3 className="text-lg font-semibold text-gray-900">{booking.serviceName}</h3>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                          {getStatusIcon(booking.status)}
                          <span className="ml-1 capitalize">{booking.status}</span>
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="space-y-2">
                          <div className="flex items-center text-sm text-gray-600">
                            <Calendar className="w-4 h-4 mr-2" />
                            {formatDate(booking.date)}
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <Clock className="w-4 h-4 mr-2" />
                            {booking.time} ({booking.duration} hours)
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <MapPin className="w-4 h-4 mr-2" />
                            {booking.location}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center text-sm text-gray-600">
                            <Phone className="w-4 h-4 mr-2" />
                            {booking.providerPhone}
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <Mail className="w-4 h-4 mr-2" />
                            {booking.providerEmail}
                          </div>
                          <div className="text-sm text-gray-600">
                            <span className="font-medium">Provider:</span> {booking.providerName}
                          </div>
                        </div>
                      </div>

                      {booking.specialInstructions && (
                        <div className="mb-4 p-3 bg-blue-50 rounded-md">
                          <p className="text-sm text-blue-800">
                            <span className="font-medium">Special Instructions:</span> {booking.specialInstructions}
                          </p>
                        </div>
                      )}

                      {booking.status === 'completed' && booking.rating && (
                        <div className="mb-4 p-3 bg-green-50 rounded-md">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="text-sm font-medium text-green-800">Your Rating:</span>
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < booking.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          {booking.review && (
                            <p className="text-sm text-green-700">{booking.review}</p>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900">৳{booking.totalAmount}</div>
                      <div className="text-sm text-gray-500">Total Amount</div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="flex space-x-3">
                      <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </button>
                      
                      {booking.status !== 'cancelled' && booking.status !== 'completed' && (
                        <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                          <MessageSquare className="w-4 h-4 mr-2" />
                          Contact Provider
                        </button>
                      )}
                    </div>

                    <div className="flex space-x-3">
                      {booking.status === 'completed' && !booking.rating && (
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-600">Rate:</span>
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              onClick={() => handleRateService(booking.id, star)}
                              className="text-gray-300 hover:text-yellow-400"
                            >
                              <Star className="w-5 h-5" />
                            </button>
                          ))}
                        </div>
                      )}

                      {booking.status === 'pending' && (
                        <button
                          onClick={() => handleCancelBooking(booking.id)}
                          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                        >
                          Cancel Booking
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}