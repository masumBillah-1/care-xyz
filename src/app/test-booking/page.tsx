'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import toast from 'react-hot-toast'

export default function TestBookingPage() {
  const { data: session } = useSession()
  const [isLoading, setIsLoading] = useState(false)

  const testBooking = async () => {
    if (!session) {
      toast.error('Please login first')
      return
    }

    setIsLoading(true)
    const loadingToast = toast.loading('Testing booking system...')

    try {
      const testData = {
        serviceId: 'baby-care',
        serviceName: 'Baby Care Service',
        price: 150,
        bookingData: {
          date: '2024-01-20',
          time: '10:00',
          duration: 4,
          location: 'Test Location, Dhaka',
          contactNumber: '+880 1234567890',
          specialInstructions: 'Test booking'
        }
      }

      console.log('Testing with data:', testData)

      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testData),
      })

      const result = await response.json()
      console.log('Response:', result)

      if (response.ok) {
        toast.success('Test successful! Check console for details.', { id: loadingToast })
      } else {
        toast.error(`Test failed: ${result.error}`, { id: loadingToast })
      }
    } catch (error) {
      console.error('Test error:', error)
      toast.error('Test failed with network error', { id: loadingToast })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Test Booking System</h1>
          
          {session ? (
            <div className="space-y-4">
              <p className="text-green-600">✅ Logged in as: {session.user?.email}</p>
              
              <div className="bg-blue-50 p-4 rounded-md">
                <h3 className="font-medium text-blue-900 mb-2">Test Configuration:</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Service: Baby Care Service</li>
                  <li>• Price: ৳150 × 4 hours = ৳600</li>
                  <li>• Date: 2024-01-20</li>
                  <li>• Time: 10:00</li>
                  <li>• Location: Test Location, Dhaka</li>
                </ul>
              </div>

              <button
                onClick={testBooking}
                disabled={isLoading}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
              >
                {isLoading ? 'Testing...' : 'Test Booking System'}
              </button>

              <div className="bg-yellow-50 p-4 rounded-md">
                <p className="text-sm text-yellow-800">
                  <strong>Note:</strong> This will test the booking system without actually processing payment. 
                  Check the browser console for detailed logs.
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <p className="text-red-600 mb-4">❌ Please login to test the booking system</p>
              <a 
                href="/auth/login" 
                className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
              >
                Login
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}