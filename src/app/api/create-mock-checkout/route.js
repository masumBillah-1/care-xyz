import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function POST(request) {
  console.log('🚀 Mock checkout session API called')
  
  try {
    const session = await getServerSession(authOptions)
    let requestBody
    
    try {
      requestBody = await request.json()
      console.log('📦 Request body:', requestBody)
    } catch (parseError) {
      console.error('❌ Failed to parse request body:', parseError)
      return NextResponse.json({ error: 'Invalid request format' }, { status: 400 })
    }

    const { serviceId, serviceName, price, bookingData } = requestBody

    // Check authentication - either NextAuth session or userEmail from Firebase
    const userEmail = session?.user?.email || bookingData?.userEmail
    console.log('👤 Authentication check:', {
      hasSession: !!session,
      userEmail: userEmail,
      bookingDataUserEmail: bookingData?.userEmail,
      sessionUserEmail: session?.user?.email,
      authMethod: session ? 'NextAuth' : bookingData?.userEmail ? 'Firebase' : 'None'
    })
    
    if (!userEmail) {
      console.log('❌ No authentication found')
      return NextResponse.json({ error: 'Please login to continue' }, { status: 401 })
    }

    // Validate required fields
    if (!serviceId || !serviceName || !price || !bookingData) {
      console.error('❌ Missing required fields:', { serviceId, serviceName, price, bookingData })
      return NextResponse.json({ error: 'Missing required booking information' }, { status: 400 })
    }

    // Validate booking data
    if (!bookingData.date || !bookingData.time || !bookingData.location || !bookingData.contactNumber) {
      console.error('❌ Missing booking data fields:', bookingData)
      return NextResponse.json({ error: 'Missing required booking details' }, { status: 400 })
    }

    console.log('✅ All validations passed, creating mock checkout session...')
    console.log('Mock session for:', { serviceId, serviceName, price, userEmail })

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Return mock success response
    const mockSessionId = `mock_session_${Date.now()}`
    const mockUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/payment-success?session_id=${mockSessionId}&mock=true`

    console.log('✅ Mock checkout session created successfully:', mockSessionId)
    console.log('🔗 Mock checkout URL:', mockUrl)

    return NextResponse.json({ 
      url: mockUrl,
      sessionId: mockSessionId,
      mock: true,
      message: 'This is a mock payment for testing purposes'
    })

  } catch (error) {
    console.error('❌ Error in mock checkout session creation:', error)
    
    if (error instanceof Error) {
      console.error('❌ Error message:', error.message)
      return NextResponse.json(
        { error: `Server error: ${error.message}` },
        { status: 500 }
      )
    }
    
    console.error('❌ Unknown error type:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}