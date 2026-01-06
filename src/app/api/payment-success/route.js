import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { bookingCollection, paymentCollection, userCollection, ObjectId } from '@/lib/db.connect'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-12-18.acacia',
})

export async function POST(request) {
  console.log('💰 Payment success API called')
  
  try {
    const session = await getServerSession(authOptions)
    const requestBody = await request.json()
    
    console.log('📦 Received payment data:', requestBody)
    
    const { sessionId, userEmail, serviceId, serviceName, amount } = requestBody

    // Validate required fields following demo pattern
    if (!sessionId || !userEmail) {
      console.error('❌ Missing fields:', { sessionId, userEmail })
      return NextResponse.json({ 
        success: false, 
        error: 'Missing required fields' 
      }, { status: 400 })
    }

    try {
      // Check if payment already recorded (following demo pattern) with longer timeout
      const existingPayment = await Promise.race([
        (await paymentCollection()).findOne({ stripeSessionId: sessionId }),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Database query timeout')), 15000)
        )
      ]).catch(err => {
        console.warn('⚠️ Could not check existing payment:', err.message)
        return null // Continue if check fails
      })

      if (existingPayment) {
        console.log('⚠️ Payment already recorded')
        return NextResponse.json({ 
          success: true, 
          message: 'Payment already recorded',
          paymentId: existingPayment._id 
        })
      }

      // Get session details from Stripe (like the example)
      let stripeSession = null
      try {
        if (process.env.STRIPE_SECRET_KEY && !sessionId.startsWith('mock_')) {
          const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
          stripeSession = await stripe.checkout.sessions.retrieve(sessionId)
          console.log('✅ Stripe session retrieved:', stripeSession.id)
        }
      } catch (stripeError) {
        console.warn('⚠️ Could not retrieve Stripe session:', stripeError.message)
      }

      // Extract booking data from session metadata or request
      let bookingData = {}
      if (stripeSession?.metadata?.bookingData) {
        try {
          bookingData = JSON.parse(stripeSession.metadata.bookingData)
        } catch (e) {
          console.warn('Could not parse booking data from metadata')
        }
      }

      // Create payment data following demo pattern
      const paymentData = {
        userEmail: userEmail || stripeSession?.customer_email,
        serviceId: serviceId || stripeSession?.metadata?.serviceId,
        serviceName: serviceName || stripeSession?.metadata?.serviceName,
        amount: stripeSession ? (stripeSession.amount_total / 100) : (parseFloat(amount) / 100),
        currency: stripeSession?.currency?.toUpperCase() || 'USD',
        paymentStatus: 'paid',
        paymentMethod: 'stripe',
        stripeSessionId: sessionId,
        paidAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      }

      // Save payment to MongoDB with longer timeout
      console.log('💾 Attempting to save payment data:', paymentData)
      const paymentResult = await Promise.race([
        (await paymentCollection()).insertOne(paymentData),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Database insert timeout after 20 seconds')), 20000)
        )
      ])

      console.log('✅ Payment saved to MongoDB:', paymentResult.insertedId)

      // Create booking record
      const bookingRecord = {
        serviceId: paymentData.serviceId,
        serviceName: paymentData.serviceName,
        userEmail: paymentData.userEmail,
        paymentId: paymentResult.insertedId,
        stripeSessionId: sessionId,
        totalAmount: paymentData.amount,
        status: 'confirmed',
        paymentStatus: 'paid',
        ...bookingData,
        createdAt: new Date(),
        updatedAt: new Date()
      }

      // Save booking to MongoDB with longer timeout
      console.log('💾 Attempting to save booking data:', bookingRecord)
      const bookingResult = await Promise.race([
        (await bookingCollection()).insertOne(bookingRecord),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Database insert timeout after 20 seconds')), 20000)
        )
      ])

      console.log('✅ Booking saved to MongoDB:', bookingResult.insertedId)

      // Update user record following demo pattern
      const userUpdateData = {
        lastBooking: paymentData.serviceName,
        lastPayment: new Date(),
        updatedAt: new Date()
      }

      const historyEntry = {
        serviceName: paymentData.serviceName,
        serviceId: paymentData.serviceId,
        amount: paymentData.amount,
        date: new Date(),
        sessionId: sessionId,
        bookingId: bookingResult.insertedId
      }

      console.log('💾 Attempting to update user record for:', paymentData.userEmail)
      const updateResult = await Promise.race([
        (await userCollection()).updateOne(
          { email: paymentData.userEmail },
          { 
            $set: userUpdateData,
            $push: {
              bookingHistory: historyEntry
            }
          }
        ),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Database update timeout after 20 seconds')), 20000)
        )
      ])

      if (updateResult.matchedCount === 0) {
        console.error('❌ User not found:', paymentData.userEmail)
        // Don't fail the payment, just log the warning
        console.warn('⚠️ User record not updated, but payment and booking saved')
      } else {
        console.log('✅ User record updated for:', paymentData.userEmail)
      }

      // Return success response following demo pattern
      return NextResponse.json({ 
        success: true, 
        paymentId: paymentResult.insertedId,
        bookingId: bookingResult.insertedId,
        message: 'Payment recorded and booking confirmed successfully',
        bookingDetails: {
          serviceName: paymentData.serviceName,
          amount: paymentData.amount,
          bookingId: bookingResult.insertedId,
          status: 'confirmed'
        }
      })

    } catch (dbError) {
      console.error('❌ Database error:', dbError)
      
      // Handle timeout specifically
      if (dbError.message.includes('timeout')) {
        return NextResponse.json({ 
          success: false, 
          error: 'Database connection timeout. Payment may not be recorded.',
          details: dbError.message 
        }, { status: 408 })
      }
      
      // For demo purposes, return success even if database fails
      return NextResponse.json({ 
        success: true, 
        message: 'Payment processed successfully (demo mode)',
        warning: 'Database connection issue - payment data may not be persisted',
        paymentId: 'demo_' + Date.now()
      })
    }

  } catch (error) {
    console.error('❌ Payment save error:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to save payment',
      details: error.message 
    }, { status: 500 })
  }
}