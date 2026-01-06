'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter, useParams } from 'next/navigation'
import { Calendar, Clock, MapPin, Phone, MessageSquare, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import useAuth from '@/hooks/useAuth'

// Mock service data - replace with actual API call
const mockServices = {
  'baby-care': {
    id: 'baby-care',
    name: 'Baby Care Service',
    description: 'Professional babysitting and childcare services for your little ones.',
    price: 150,
    category: 'childcare',
    features: JSON.stringify([
      'Experienced childcare professionals',
      'Background verified caregivers',
      'Age-appropriate activities',
      'Meal preparation and feeding'
    ])
  },
  'elderly-care': {
    id: 'elderly-care',
    name: 'Elderly Care Service',
    description: 'Compassionate care for elderly family members.',
    price: 200,
    category: 'elderly',
    features: JSON.stringify([
      'Trained elderly care specialists',
      'Medication management',
      'Mobility assistance',
      'Companionship and social interaction'
    ])
  },
  'sick-care': {
    id: 'sick-care',
    name: 'Sick People Care Service',
    description: 'Specialized care for individuals recovering from illness.',
    price: 250,
    category: 'medical',
    features: JSON.stringify([
      'Medically trained caregivers',
      'Post-operative care',
      'Chronic condition management',
      'Medication administration'
    ])
  }
}

export default function BookServicePage() {
  const { data: session, status } = useSession()
  const { user: firebaseUser, loading: firebaseLoading } = useAuth()
  const router = useRouter()
  const params = useParams()
  const serviceId = params.serviceId

  // Check if user is authenticated (either NextAuth or Firebase)
  const isAuthenticated = session || firebaseUser
  const isAuthLoading = status === 'loading' || firebaseLoading
  const userEmail = session?.user?.email || firebaseUser?.email

  const [service, setService] = useState(null)
  const [bookingData, setBookingData] = useState({
    date: '',
    time: '',
    duration: 4,
    location: '',
    specialInstructions: '',
    contactNumber: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (isAuthLoading) return
    
    if (!isAuthenticated) {
      router.push(`/auth/login?callbackUrl=/book/${serviceId}`)
      return
    }

    // Get service data
    const serviceData = mockServices[serviceId]
    if (serviceData) {
      setService(serviceData)
    } else {
      toast.error('Service not found')
      router.push('/')
    }
  }, [isAuthenticated, isAuthLoading, router, serviceId])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setBookingData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const calculateTotal = () => {
    if (!service) return 0
    return service.price * bookingData.duration
  }

  const handleBookingSubmit = async (e) => {
    e.preventDefault()
    
    if (!service || !isAuthenticated) {
      toast.error('Please login to continue')
      return
    }

    // Validation
    if (!bookingData.date || !bookingData.time || !bookingData.location || !bookingData.contactNumber) {
      toast.error('Please fill in all required fields')
      return
    }

    setIsLoading(true)
    const loadingToast = toast.loading('Creating payment session...')

    try {
      console.log('🚀 Starting booking submission...')
      console.log('Service:', service)
      console.log('Booking data:', bookingData)
      console.log('User email:', userEmail)
      console.log('Total amount:', calculateTotal())

      // Save booking info for payment success page (like the example)
      localStorage.setItem('selectedServiceId', service.id)
      localStorage.setItem('selectedServiceName', service.name)
      localStorage.setItem('selectedAmount', calculateTotal() * 100) // Store in cents
      localStorage.setItem('userEmail', userEmail || '')

      // Use real Stripe checkout to collect payments
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          serviceId: service.id,
          serviceName: service.name,
          price: calculateTotal(),
          bookingData: {
            ...bookingData,
            userEmail: userEmail
          }
        }),
      })

      console.log('📡 Response status:', response.status)
      console.log('📡 Response headers:', Object.fromEntries(response.headers.entries()))

      let data
      try {
        const responseText = await response.text()
        console.log('📡 Raw response:', responseText)
        
        if (responseText) {
          data = JSON.parse(responseText)
        } else {
          data = { error: 'Empty response from server' }
        }
      } catch (parseError) {
        console.error('❌ Failed to parse response:', parseError)
        data = { error: 'Invalid response format from server' }
      }

      console.log('📡 Parsed response data:', data)

      if (response.ok && data.url) {
        toast.success('Redirecting to payment...', { id: loadingToast })
        console.log('✅ Redirecting to Stripe checkout:', data.url)
        console.log('💾 Booking info saved to localStorage for payment processing')
        // Redirect to Stripe Checkout
        window.location.assign(data.url) // Use assign instead of href for better handling
      } else {
        console.error('❌ Checkout session error:', data)
        console.error('❌ Full error details:', JSON.stringify(data, null, 2))
        const errorMessage = data.error || `Server error (${response.status})`
        toast.error(errorMessage, { id: loadingToast })
        
        // Clear stored data on error
        localStorage.removeItem('selectedServiceId')
        localStorage.removeItem('selectedServiceName')
        localStorage.removeItem('selectedAmount')
        localStorage.removeItem('userEmail')
      }
    } catch (error) {
      console.error('❌ Network error:', error)
      toast.error('Network error. Please check your connection and try again.', { id: loadingToast })
      
      // Clear stored data on error
      localStorage.removeItem('selectedServiceId')
      localStorage.removeItem('selectedServiceName')
      localStorage.removeItem('selectedAmount')
      localStorage.removeItem('userEmail')
    } finally {
      setIsLoading(false)
    }
  }

  if (!mounted || isAuthLoading || !service) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  const features = service.features ? JSON.parse(service.features) : []

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Service Info Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{service.name}</h1>
          <p className="text-gray-600 mb-4">{service.description}</p>
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold text-blue-600">৳{service.price}/hour</div>
            <div className="text-sm text-gray-500 capitalize">{service.category}</div>
          </div>
        </div>

        {/* Booking Form */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Book Your Service</h2>
          
          <form onSubmit={handleBookingSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Date */}
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                  Service Date *
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="date"
                    id="date"
                    name="date"
                    required
                    value={bookingData.date}
                    onChange={handleInputChange}
                    min={new Date().toISOString().split('T')[0]}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Time */}
              <div>
                <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-2">
                  Start Time *
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="time"
                    id="time"
                    name="time"
                    required
                    value={bookingData.time}
                    onChange={handleInputChange}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Duration */}
              <div>
                <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-2">
                  Duration (hours) *
                </label>
                <select
                  id="duration"
                  name="duration"
                  required
                  value={bookingData.duration}
                  onChange={handleInputChange}
                  className="block w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(hour => (
                    <option key={hour} value={hour}>{hour} hour{hour > 1 ? 's' : ''}</option>
                  ))}
                </select>
              </div>

              {/* Contact Number */}
              <div>
                <label htmlFor="contactNumber" className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Number *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="tel"
                    id="contactNumber"
                    name="contactNumber"
                    required
                    value={bookingData.contactNumber}
                    onChange={handleInputChange}
                    placeholder="Enter your contact number"
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Location */}
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                Service Location *
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  id="location"
                  name="location"
                  required
                  value={bookingData.location}
                  onChange={handleInputChange}
                  placeholder="Enter full address where service is needed"
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Special Instructions */}
            <div>
              <label htmlFor="specialInstructions" className="block text-sm font-medium text-gray-700 mb-2">
                Special Instructions (Optional)
              </label>
              <div className="relative">
                <MessageSquare className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <textarea
                  id="specialInstructions"
                  name="specialInstructions"
                  rows={3}
                  value={bookingData.specialInstructions}
                  onChange={handleInputChange}
                  placeholder="Any special requirements or instructions for the caregiver"
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Service Features */}
            {features.length > 0 && (
              <div className="bg-blue-50 p-4 rounded-md">
                <h3 className="text-sm font-medium text-blue-900 mb-2">Service Includes:</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  {features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-2"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Total Cost */}
            <div className="bg-gray-50 p-4 rounded-md">
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-sm text-gray-600">
                    {service.name} × {bookingData.duration} hour{bookingData.duration > 1 ? 's' : ''}
                  </div>
                  <div className="text-sm text-gray-500">
                    ৳{service.price} per hour
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">৳{calculateTotal()}</div>
                  <div className="text-sm text-gray-500">Total Amount</div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <CheckCircle className="w-5 h-5 mr-2" />
              {isLoading ? 'Redirecting to Payment...' : `Pay with Stripe - ৳${calculateTotal()}`}
            </button>

            {/* Payment Info */}
            <div className="text-center text-sm text-gray-500">
              <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mb-4">
                <p className="text-blue-800 font-medium">💳 Secure Payment</p>
                <p className="text-blue-700">You will be redirected to Stripe's secure payment page</p>
                <p className="text-blue-700">We accept all major credit and debit cards</p>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}