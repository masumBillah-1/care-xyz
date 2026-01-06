'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { CheckCircle, Calendar, Clock, MapPin, Phone, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'

function BookingConfirmedContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { data: session } = useSession()
  const [mounted, setMounted] = useState(false)
  const [bookingDetails, setBookingDetails] = useState(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    const bookingId = searchParams.get('booking_id')
    
    if (bookingId) {
      // For demo purposes, show confirmation with mock data
      setBookingDetails({
        id: bookingId,
        serviceName: 'Care Service',
        date: new Date().toISOString().split('T')[0],
        time: '10:00',
        duration: 4,
        location: 'Your Location',
        totalAmount: 600,
        status: 'confirmed'
      })
      toast.success('Booking confirmed successfully!')
    }
  }, [mounted, searchParams])

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  const bookingId = searchParams.get('booking_id')

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          {/* Success Icon */}
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>

          {/* Success Message */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Booking Confirmed!
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Your care service booking has been confirmed successfully.
          </p>

          {/* Booking Details */}
          {bookingId && (
            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Booking Details</h2>
              <div className="text-sm text-gray-600 space-y-2">
                <div className="flex justify-between">
                  <span>Booking ID:</span>
                  <span className="font-mono text-xs">{bookingId.toString().substring(0, 20)}...</span>
                </div>
                <div className="flex justify-between">
                  <span>Status:</span>
                  <span className="text-green-600 font-medium">Confirmed</span>
                </div>
                <div className="flex justify-between">
                  <span>Payment:</span>
                  <span className="text-blue-600 font-medium">Not Required</span>
                </div>
              </div>
            </div>
          )}

          {/* Service Booking Details */}
          {bookingDetails && (
            <div className="bg-blue-50 rounded-lg p-6 mb-8">
              <h2 className="text-lg font-semibold text-blue-900 mb-4">Service Details</h2>
              <div className="text-sm text-blue-800 space-y-2">
                <div className="flex justify-between">
                  <span>Service:</span>
                  <span className="font-medium">{bookingDetails.serviceName}</span>
                </div>
                <div className="flex justify-between">
                  <span>Date:</span>
                  <span>{bookingDetails.date}</span>
                </div>
                <div className="flex justify-between">
                  <span>Time:</span>
                  <span>{bookingDetails.time}</span>
                </div>
                <div className="flex justify-between">
                  <span>Duration:</span>
                  <span>{bookingDetails.duration} hour{bookingDetails.duration > 1 ? 's' : ''}</span>
                </div>
                <div className="flex justify-between">
                  <span>Location:</span>
                  <span>{bookingDetails.location}</span>
                </div>
                <div className="flex justify-between font-medium pt-2 border-t border-blue-200">
                  <span>Service Fee:</span>
                  <span>৳{bookingDetails.totalAmount}</span>
                </div>
              </div>
            </div>
          )}

          {/* Next Steps */}
          <div className="bg-green-50 rounded-lg p-6 mb-8">
            <h2 className="text-lg font-semibold text-green-900 mb-4">What's Next?</h2>
            <div className="text-sm text-green-800 space-y-3 text-left">
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span>You will receive a confirmation email with booking details</span>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Our care provider will contact you 24 hours before the service</span>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span>You can track your booking status in "My Bookings"</span>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Payment will be collected by the care provider upon service completion</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/my-bookings"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Calendar className="w-5 h-5 mr-2" />
              View My Bookings
            </Link>
            <Link
              href="/"
              className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Back to Home
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>

          {/* Support Info */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Need help? Contact our support team at{' '}
              <a href="mailto:support@care.xyz" className="text-blue-600 hover:text-blue-500">
                support@care.xyz
              </a>{' '}
              or call{' '}
              <a href="tel:+8801234567890" className="text-blue-600 hover:text-blue-500">
                +880 123-456-7890
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function BookingConfirmedPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <BookingConfirmedContent />
    </Suspense>
  )
}
