import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { bookingCollection, paymentCollection, ObjectId } from '@/lib/db.connect'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const bookingId = searchParams.get('bookingId')
    const sessionId = searchParams.get('sessionId')
    const email = searchParams.get('email')
    
    // Check authentication
    const session = await getServerSession(authOptions)
    const userEmail = session?.user?.email || email
    
    if (!userEmail) {
      return NextResponse.json({ error: 'Unauthorized - no user email found' }, { status: 401 })
    }

    console.log('📋 Checking booking status for:', { bookingId, sessionId, userEmail })

    let booking = null
    let payment = null

    try {
      // Find booking by ID or session ID
      if (bookingId && ObjectId.isValid(bookingId)) {
        booking = await Promise.race([
          (await bookingCollection()).findOne({
            _id: new ObjectId(bookingId),
            userEmail: userEmail
          }),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Database query timeout')), 5000)
          )
        ])
      } else if (sessionId) {
        booking = await Promise.race([
          (await bookingCollection()).findOne({
            stripeSessionId: sessionId,
            userEmail: userEmail
          }),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Database query timeout')), 5000)
          )
        ])
      }

      // Find associated payment
      if (booking?.paymentId) {
        payment = await Promise.race([
          (await paymentCollection()).findOne({
            _id: new ObjectId(booking.paymentId)
          }),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Database query timeout')), 5000)
          )
        ])
      } else if (sessionId) {
        payment = await Promise.race([
          (await paymentCollection()).findOne({
            stripeSessionId: sessionId
          }),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Database query timeout')), 5000)
          )
        ])
      }

      if (!booking && !payment) {
        return NextResponse.json({
          found: false,
          message: 'Booking not found'
        })
      }

      // Return booking and payment status
      return NextResponse.json({
        found: true,
        booking: booking ? {
          id: booking._id.toString(),
          serviceName: booking.serviceName,
          serviceId: booking.serviceId,
          userEmail: booking.userEmail,
          status: booking.status,
          paymentStatus: booking.paymentStatus,
          totalAmount: booking.totalAmount,
          date: booking.date,
          time: booking.time,
          location: booking.location,
          createdAt: booking.createdAt,
          updatedAt: booking.updatedAt
        } : null,
        payment: payment ? {
          id: payment._id.toString(),
          amount: payment.amount,
          currency: payment.currency,
          paymentStatus: payment.paymentStatus,
          paymentMethod: payment.paymentMethod,
          stripeSessionId: payment.stripeSessionId,
          paidAt: payment.paidAt
        } : null,
        status: booking?.status || 'processing',
        paymentStatus: payment?.paymentStatus || 'pending'
      })

    } catch (dbError) {
      console.warn('📋 Database error, checking fallback:', dbError.message)
      
      // Return processing status for demo
      return NextResponse.json({
        found: true,
        booking: null,
        payment: null,
        status: 'processing',
        paymentStatus: 'processing',
        message: 'Booking is being processed'
      })
    }

  } catch (error) {
    console.error('Error checking booking status:', error)
    
    return NextResponse.json(
      { error: 'Failed to check booking status' },
      { status: 500 }
    )
  }
}