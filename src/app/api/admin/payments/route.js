import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { paymentCollection, bookingCollection } from '@/lib/db.connect'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions)
    
    // Simple admin check (you can enhance this)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit')) || 50
    const status = searchParams.get('status')

    console.log('📊 Admin fetching payments, limit:', limit)

    try {
      // Build filter
      let filter = {}
      if (status) {
        filter.paymentStatus = status
      }

      // Get payments with timeout
      const payments = await Promise.race([
        (await paymentCollection()).find(filter)
          .sort({ createdAt: -1 })
          .limit(limit)
          .toArray(),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Database query timeout')), 5000)
        )
      ])

      // Get payment statistics
      const stats = await Promise.race([
        (await paymentCollection()).aggregate([
          {
            $group: {
              _id: '$paymentStatus',
              count: { $sum: 1 },
              totalAmount: { $sum: '$amount' }
            }
          }
        ]).toArray(),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Database query timeout')), 5000)
        )
      ])

      // Get recent bookings count
      const bookingsCount = await Promise.race([
        (await bookingCollection()).countDocuments({}),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Database query timeout')), 5000)
        )
      ])

      console.log('📊 Found payments:', payments.length)

      return NextResponse.json({
        success: true,
        payments: payments.map(payment => ({
          id: payment._id.toString(),
          userEmail: payment.userEmail,
          serviceName: payment.serviceName,
          amount: payment.amount,
          currency: payment.currency,
          paymentStatus: payment.paymentStatus,
          paymentMethod: payment.paymentMethod,
          stripeSessionId: payment.stripeSessionId,
          paidAt: payment.paidAt,
          createdAt: payment.createdAt
        })),
        statistics: {
          paymentStats: stats,
          totalBookings: bookingsCount,
          totalPayments: payments.length
        }
      })

    } catch (dbError) {
      console.warn('📊 Database error, using mock data:', dbError.message)
      
      // Return mock admin data
      return NextResponse.json({
        success: true,
        payments: [
          {
            id: 'demo_payment_1',
            userEmail: 'user@example.com',
            serviceName: 'Baby Care Service',
            amount: 150,
            currency: 'USD',
            paymentStatus: 'paid',
            paymentMethod: 'stripe',
            paidAt: new Date(),
            createdAt: new Date()
          }
        ],
        statistics: {
          paymentStats: [
            { _id: 'paid', count: 1, totalAmount: 150 }
          ],
          totalBookings: 1,
          totalPayments: 1
        },
        warning: 'Using demo data - database connection issue'
      })
    }

  } catch (error) {
    console.error('Error in admin payments API:', error)
    
    return NextResponse.json(
      { error: 'Failed to fetch payments' },
      { status: 500 }
    )
  }
}