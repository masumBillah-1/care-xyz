import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    console.log('🧪 Testing Firebase sync...')
    
    const testUserData = {
      uid: 'test-uid-' + Date.now(),
      email: 'test@example.com',
      name: 'Test User',
      provider: 'google',
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    // Call the firebase-sync API
    const response = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/users/firebase-sync`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testUserData),
    })
    
    const result = await response.json()
    
    console.log('🧪 Firebase sync test result:', result)
    
    return NextResponse.json({
      success: true,
      message: 'Firebase sync test completed',
      syncResult: result,
      status: response.status
    })
    
  } catch (error) {
    console.error('🧪 Firebase sync test error:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Firebase sync test failed',
      details: error.message
    }, { status: 500 })
  }
}