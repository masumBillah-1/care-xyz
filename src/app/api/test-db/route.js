import { NextResponse } from 'next/server'
import { userCollection } from '@/lib/db.connect'

export async function GET() {
  try {
    console.log('🧪 Testing database connection...')
    
    // Test database connection with a simple query
    const testResult = await Promise.race([
      (await userCollection()).findOne({ email: 'test@example.com' }),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Database query timeout')), 5000)
      )
    ])
    
    console.log('🧪 Database test result:', testResult ? 'User found' : 'No user found')
    
    return NextResponse.json({
      success: true,
      message: 'Database connection test successful',
      userFound: !!testResult,
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('🧪 Database test error:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Database connection test failed',
      details: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}

export async function POST() {
  try {
    console.log('🧪 Testing user creation...')
    
    const testUser = {
      email: 'test-' + Date.now() + '@example.com',
      name: 'Test User',
      provider: 'test',
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    // Test user creation
    const insertResult = await Promise.race([
      (await userCollection()).insertOne(testUser),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Database insert timeout')), 5000)
      )
    ])
    
    console.log('🧪 User creation test result:', insertResult.insertedId)
    
    return NextResponse.json({
      success: true,
      message: 'User creation test successful',
      userId: insertResult.insertedId,
      testUser: testUser,
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('🧪 User creation test error:', error)
    
    return NextResponse.json({
      success: false,
      error: 'User creation test failed',
      details: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}