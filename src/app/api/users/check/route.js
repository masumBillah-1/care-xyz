import { NextResponse } from 'next/server'
import { userCollection } from '@/lib/db.connect'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')
    
    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email is required' },
        { status: 400 }
      )
    }
    
    // Add timeout to prevent hanging
    const user = await Promise.race([
      (await userCollection()).findOne({ email }),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Database query timeout')), 10000)
      )
    ])
    
    return NextResponse.json({
      success: true,
      found: !!user,
      user: user || null
    })
  } catch (error) {
    console.error('User check error:', error)
    
    // Handle timeout specifically
    if (error.message === 'Database query timeout') {
      return NextResponse.json(
        { 
          success: false, 
          found: false,
          error: 'Database connection timeout',
          user: null
        },
        { status: 408 }
      )
    }
    
    return NextResponse.json(
      { 
        success: false, 
        found: false,
        error: 'Failed to check user',
        user: null,
        details: error.message 
      },
      { status: 500 }
    )
  }
}