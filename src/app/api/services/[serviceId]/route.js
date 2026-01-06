import { NextResponse } from 'next/server'
import { serviceCollection } from '@/lib/db.connect'

// Map service IDs to database service names
const serviceIdMap = {
  'baby-care': 'Baby Care Service',
  'elderly-care': 'Elderly Care Service',
  'sick-care': 'Sick People Care Service'
}

// Fallback mock data
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

export async function GET(request, { params }) {
  try {
    const { serviceId } = params
    const serviceName = serviceIdMap[serviceId]
    
    if (!serviceName) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 })
    }

    console.log(`🔍 Fetching service: ${serviceId}`)

    try {
      // Try to fetch from MongoDB with short timeout
      const service = await Promise.race([
        (await serviceCollection()).findOne({ name: serviceName }),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Database query timeout')), 2000) // Shorter timeout
        )
      ])

      if (service) {
        console.log(`✅ Found service in MongoDB: ${serviceId}`)
        return NextResponse.json({
          service: {
            id: service._id.toString(),
            name: service.name,
            description: service.description,
            price: service.price,
            category: service.category,
            features: service.features,
            createdAt: service.createdAt,
            updatedAt: service.updatedAt
          }
        })
      }
    } catch (dbError) {
      console.warn(`⚠️ Database error for ${serviceId}:`, dbError.message)
    }

    // Return mock data as fallback
    const mockService = mockServices[serviceId]
    if (mockService) {
      console.log(`📦 Using mock data for: ${serviceId}`)
      return NextResponse.json({ service: mockService })
    }

    return NextResponse.json({ error: 'Service not found' }, { status: 404 })

  } catch (error) {
    console.error('Error in services API:', error)
    
    // Return mock data even on error
    const mockService = mockServices[params.serviceId]
    if (mockService) {
      return NextResponse.json({ 
        service: mockService,
        warning: 'Using fallback data due to server error'
      })
    }

    return NextResponse.json(
      { error: 'Failed to fetch service' },
      { status: 500 }
    )
  }
}