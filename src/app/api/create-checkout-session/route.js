import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-12-18.acacia',
})

export async function POST(request) {
  console.log('🚀 Checkout session API called')
  
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

    console.log('✅ All validations passed')

    // Check if Stripe secret key is configured
    if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY === 'your_stripe_secret_key_here') {
      console.log('⚠️ Stripe secret key not configured, using mock payment')
      
      // Redirect to mock checkout
      const mockResponse = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/create-mock-checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      })
      
      if (mockResponse.ok) {
        const mockData = await mockResponse.json()
        return NextResponse.json(mockData)
      } else {
        throw new Error('Mock checkout failed')
      }
    }

    console.log('💳 Creating Stripe checkout session...')
    console.log('Session for:', { serviceId, serviceName, price, userEmail })

    try {
      // Create checkout session following the demo API structure
      const checkoutSession = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'usd', // Using USD as in demo
              product_data: {
                name: serviceName,
                description: `Care service booking for ${serviceName}`,
                images: ['https://care.xyz/logo.png'], // Add your logo URL
              },
              unit_amount: Math.round(price * 100), // Convert to cents
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        customer_email: userEmail,
        success_url: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/book/${serviceId}?cancelled=true`,
        metadata: {
          serviceId,
          serviceName,
          userEmail,
          bookingDate: bookingData.date,
          bookingTime: bookingData.time,
          duration: bookingData.duration.toString(),
          location: bookingData.location,
          contactNumber: bookingData.contactNumber,
          specialInstructions: bookingData.specialInstructions || '',
          type: 'service_booking'
        }
      })

      console.log('✅ Stripe checkout session created:', checkoutSession.id)
      console.log('🔗 Checkout URL:', checkoutSession.url)

      return NextResponse.json({
        url: checkoutSession.url,
        sessionId: checkoutSession.id,
        message: 'Checkout session created successfully'
      })

    } catch (stripeError) {
      console.error('❌ Stripe error:', stripeError)
      
      if (stripeError instanceof Error) {
        // If Stripe fails, fall back to mock payment
        console.log('🔄 Falling back to mock payment due to Stripe error')
        
        const mockResponse = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/create-mock-checkout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        })
        
        if (mockResponse.ok) {
          const mockData = await mockResponse.json()
          return NextResponse.json({
            ...mockData,
            fallback: true,
            originalError: stripeError.message
          })
        }
      }
      
      throw stripeError
    }

  } catch (error) {
    console.error('❌ Error in checkout session creation:', error)
    
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