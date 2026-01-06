'use client'

import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { CheckCircle, Clock, Shield, Users, ArrowRight, Star } from 'lucide-react'
import useAuth from '@/hooks/useAuth'

export function ServiceDetail({ service, serviceId }) {
  const { data: session, status } = useSession()
  const { user: firebaseUser, loading: firebaseLoading } = useAuth()
  
  // Check if user is authenticated (either NextAuth or Firebase)
  const isAuthenticated = session || firebaseUser
  const isAuthLoading = status === 'loading' || firebaseLoading
  
  const features = service.features ? (Array.isArray(service.features) ? service.features : JSON.parse(service.features)) : []

  const getServiceIcon = (category) => {
    switch (category) {
      case 'childcare':
        return <Users className="w-8 h-8 text-blue-600" />
      case 'eldercare':
        return <Shield className="w-8 h-8 text-green-600" />
      case 'healthcare':
        return <CheckCircle className="w-8 h-8 text-red-600" />
      default:
        return <Clock className="w-8 h-8 text-gray-600" />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-8">
            <div className="flex items-center mb-6">
              {getServiceIcon(service.category)}
              <div className="ml-4">
                <h1 className="text-3xl font-bold text-gray-900">{service.name}</h1>
                <p className="text-lg text-gray-600 capitalize">{service.category}</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Description</h2>
                <p className="text-gray-700 leading-relaxed mb-6">{service.description}</p>

                {features.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Features</h3>
                    <ul className="space-y-2">
                      {features.map((feature, index) => (
                        <li key={index} className="flex items-center">
                          <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="text-center mb-6">
                  <div className="text-3xl font-bold text-gray-900 mb-2">
                    ${service.price}
                    <span className="text-lg font-normal text-gray-600">/hour</span>
                  </div>
                  <div className="flex items-center justify-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                    <span className="ml-2 text-gray-600">4.9 (127 reviews)</span>
                  </div>
                </div>

                {isAuthLoading ? (
                  <div className="w-full bg-gray-200 py-3 px-6 rounded-lg animate-pulse"></div>
                ) : isAuthenticated ? (
                  <Link
                    href={`/book/${serviceId}`}
                    className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition duration-200 flex items-center justify-center"
                  >
                    Book Now
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                ) : (
                  <div className="space-y-3">
                    <Link
                      href="/auth/login"
                      className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition duration-200 flex items-center justify-center"
                    >
                      Login to Book
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Link>
                    <Link
                      href="/auth/register"
                      className="w-full border border-blue-600 text-blue-600 py-3 px-6 rounded-lg font-semibold hover:bg-blue-50 transition duration-200 text-center block"
                    >
                      Create Account
                    </Link>
                  </div>
                )}

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span className="flex items-center">
                      <Shield className="w-4 h-4 mr-1" />
                      Verified Provider
                    </span>
                    <span className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      24/7 Support
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}