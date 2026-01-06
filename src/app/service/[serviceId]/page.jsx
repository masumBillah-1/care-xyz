'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { ServiceDetail } from '@/components/service-detail'

// Mock services data for fast loading
const mockServices = {
  'baby-care': {
    id: 'baby-care',
    name: 'Baby Care Service',
    description: 'Professional babysitting and childcare services for your little ones. Our trained caregivers provide safe, nurturing care.',
    price: 150,
    category: 'childcare',
    features: [
      'Experienced childcare professionals',
      'Background verified caregivers',
      'Age-appropriate activities',
      'Meal preparation and feeding',
      'Emergency care protocols',
      '24/7 support available'
    ]
  },
  'elderly-care': {
    id: 'elderly-care',
    name: 'Elderly Care Service',
    description: 'Compassionate care for elderly family members. Our caregivers provide assistance with daily activities and companionship.',
    price: 200,
    category: 'elderly',
    features: [
      'Trained elderly care specialists',
      'Medication management',
      'Mobility assistance',
      'Companionship and social interaction',
      'Personal hygiene assistance',
      'Health monitoring'
    ]
  },
  'sick-care': {
    id: 'sick-care',
    name: 'Sick People Care Service',
    description: 'Specialized care for individuals recovering from illness or managing chronic conditions. Professional medical support at home.',
    price: 250,
    category: 'medical',
    features: [
      'Medically trained caregivers',
      'Post-operative care',
      'Chronic condition management',
      'Medication administration',
      'Physical therapy assistance',
      'Doctor coordination'
    ]
  }
}

export default function ServicePage() {
  const params = useParams()
  const serviceId = params.serviceId
  const [service, setService] = useState(null)
  const [loading, setLoading] = useState(false) // Start with false for instant loading

  useEffect(() => {
    // Immediately load mock data for instant rendering
    const mockService = mockServices[serviceId]
    if (mockService) {
      setService(mockService)
    }

    // Skip API call for now to ensure fastest loading
    // Optional: Uncomment below to enable background API fetching
    /*
    const fetchServiceData = async () => {
      try {
        const response = await fetch(`/api/services/${serviceId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })

        if (response.ok) {
          const data = await response.json()
          if (data.service) {
            setService(data.service)
          }
        }
      } catch (error) {
        console.log('Using mock data due to API error:', error)
      }
    }

    if (mockService) {
      setTimeout(fetchServiceData, 1000)
    }
    */
  }, [serviceId])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading service...</p>
        </div>
      </div>
    )
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Service Not Found</h1>
          <p className="text-gray-600 mb-6">The requested service could not be found.</p>
          <a
            href="/"
            className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors"
          >
            Back to Home
          </a>
        </div>
      </div>
    )
  }

  return <ServiceDetail service={service} serviceId={serviceId} />
}