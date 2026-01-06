import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-12-18.acacia',
})

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { serviceId, serviceName, amount, bookingData, userId } = await request.json()

    // Validate required fields
    if (!serviceId || !serviceName || !amount || !bookingData || !userId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Convert amount to cents (Stripe expects amounts in smallest currency unit)
    const amountInCents = Math.round(amount * 100)

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: 'bdt', // Bangladeshi Taka
      metadata: {
        serviceId,
        serviceName,
        userId,
        bookingDate: bookingData.date,
        bookingTime: bookingData.time,
        duration: bookingData.duration.toString(),
        location: bookingData.location,
        contactNumber: bookingData.contactNumber,
        specialInstructions: bookingData.specialInstructions || '',
      },
      description: `Care.xyz - ${serviceName} booking`,
    })

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    })

  } catch (error) {
    console.error('Error creating payment intent:', error)
    return NextResponse.json(
      { error: 'Failed to create payment intent' },
      { status: 500 }
    )
  }
}