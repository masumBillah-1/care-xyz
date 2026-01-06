import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { bookingCollection, paymentCollection, userCollection } from '@/lib/db.connect'

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET

export async function POST(request) {
  console.log('🎣 Stripe webhook received')
  
  try {
    const body = await request.text()
    const headersList = headers()
    const sig = headersList.get('stripe-signature')

    let event

    try {
      // Verify webhook signature (like the example)
      event = stripe.webhooks.constructEvent(body, sig, endpointSecret)
      console.log('✅ Webhook signature verified:', event.type)
    } catch (err) {
      console.error('❌ Webhook signature verification failed:', err.message)
      return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 })
    }

    // Handle the event (following the example pattern)
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object
        console.log('💰 Payment completed for session:', session.id)
        
        try {
          // Extract booking data from metadata
          const metadata = session.metadata || {}
          const bookingData = metadata.bookingData ? JSON.parse(metadata.bookingData) : {}
          
          // Check if payment already processed
          const existingPayment = await (await paymentCollection()).findOne({ 
            stripeSessionId: session.id 
          })
          
          if (existingPayment) {
            console.log('⚠️ Payment already processed via webhook')
            break
          }
          
          // Create payment record
          const paymentData = {
            userEmail: session.customer_email || metadata.userEmail,
            serviceId: metadata.serviceId,
            serviceName: metadata.serviceName,
            amount: session.amount_total / 100, // Convert from cents
            currency: session.currency?.toUpperCase() || 'USD',
            paymentStatus: 'paid',
            paymentMethod: 'stripe',
            stripeSessionId: session.id,
            stripePaymentIntentId: session.payment_intent,
            paidAt: new Date(session.created * 1000),
            createdAt: new Date(),
            updatedAt: new Date(),
            processedViaWebhook: true
          }
          
          // Save payment
          const paymentResult = await (await paymentCollection()).insertOne(paymentData)
          console.log('✅ Payment saved via webhook:', paymentResult.insertedId)
          
          // Create booking record
          const bookingRecord = {
            serviceId: metadata.serviceId,
            serviceName: metadata.serviceName,
            userEmail: session.customer_email || metadata.userEmail,
            paymentId: paymentResult.insertedId,
            stripeSessionId: session.id,
            totalAmount: session.amount_total / 100,
            status: 'confirmed',
            paymentStatus: 'paid',
            ...bookingData,
            createdAt: new Date(),
            updatedAt: new Date(),
            processedViaWebhook: true
          }
          
          // Save booking
          const bookingResult = await (await bookingCollection()).insertOne(bookingRecord)
          console.log('✅ Booking created via webhook:', bookingResult.insertedId)
          
          // Update user record
          const userEmail = session.customer_email || metadata.userEmail
          if (userEmail) {
            await (await userCollection()).updateOne(
              { email: userEmail },
              { 
                $set: { 
                  lastBooking: metadata.serviceName,
                  lastPayment: new Date(),
                  updatedAt: new Date()
                },
                $push: {
                  bookingHistory: {
                    serviceName: metadata.serviceName,
                    serviceId: metadata.serviceId,
                    amount: session.amount_total / 100,
                    date: new Date(),
                    sessionId: session.id,
                    bookingId: bookingResult.insertedId,
                    processedViaWebhook: true
                  }
                }
              }
            )
            console.log('✅ User record updated via webhook:', userEmail)
          }
          
        } catch (dbError) {
          console.error('❌ Database error in webhook:', dbError)
          // Don't return error - webhook should still be acknowledged
        }
        break

      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object
        console.log('💳 Payment intent succeeded:', paymentIntent.id)
        
        // Update payment status if exists
        try {
          await (await paymentCollection()).updateOne(
            { stripePaymentIntentId: paymentIntent.id },
            { 
              $set: { 
                paymentStatus: 'completed',
                updatedAt: new Date(),
                paymentIntentStatus: paymentIntent.status
              }
            }
          )
        } catch (dbError) {
          console.error('❌ Error updating payment intent status:', dbError)
        }
        break

      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object
        console.log('❌ Payment failed:', failedPayment.id)
        
        // Update payment status
        try {
          await (await paymentCollection()).updateOne(
            { stripePaymentIntentId: failedPayment.id },
            { 
              $set: { 
                paymentStatus: 'failed',
                updatedAt: new Date(),
                paymentIntentStatus: failedPayment.status,
                failureReason: failedPayment.last_payment_error?.message
              }
            }
          )
        } catch (dbError) {
          console.error('❌ Error updating failed payment status:', dbError)
        }
        break

      default:
        console.log(`🔔 Unhandled event type: ${event.type}`)
    }

    // Return success response (important for Stripe)
    return NextResponse.json({ received: true })

  } catch (error) {
    console.error('❌ Webhook processing error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}