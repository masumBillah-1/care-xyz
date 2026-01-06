import { NextResponse } from 'next/server'
import { userCollection } from '@/lib/db.connect'

export async function POST(request) {
  try {
    const userData = await request.json()
    
    console.log('🔄 Firebase sync request for:', userData.email)
    
    // Check if user already exists with shorter timeout
    const existingUser = await Promise.race([
      (await userCollection()).findOne({
        $or: [
          { email: userData.email },
          { uid: userData.uid }
        ]
      }),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Database query timeout')), 5000) // Reduced timeout
      )
    ])
    
    if (existingUser) {
      console.log('👤 User exists, updating:', userData.email)
      // Update existing user with shorter timeout
      const updateResult = await Promise.race([
        (await userCollection()).updateOne(
          { email: userData.email },
          { 
            $set: {
              ...userData,
              updatedAt: new Date()
            }
          }
        ),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Database update timeout')), 5000) // Reduced timeout
        )
      ])
      
      console.log('✅ User updated successfully:', userData.email)
      return NextResponse.json({
        success: true,
        message: 'User updated successfully',
        userId: existingUser._id,
        updated: updateResult.modifiedCount > 0
      })
    } else {
      console.log('👤 New user, creating:', userData.email)
      // Create new user with shorter timeout
      const insertResult = await Promise.race([
        (await userCollection()).insertOne({
          ...userData,
          createdAt: new Date(),
          updatedAt: new Date()
        }),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Database insert timeout')), 5000) // Reduced timeout
        )
      ])
      
      console.log('✅ User created successfully:', userData.email, 'ID:', insertResult.insertedId)
      return NextResponse.json({
        success: true,
        message: 'User created successfully',
        userId: insertResult.insertedId
      })
    }
  } catch (error) {
    console.error('❌ Firebase sync error for', request.url, ':', error.message)
    
    // Handle timeout specifically
    if (error.message.includes('timeout')) {
      console.warn('⏰ Database timeout - user data not synced to MongoDB')
      return NextResponse.json(
        { 
          success: false, 
          error: 'Database connection timeout - user data may not be synced',
          details: error.message,
          fallback: true // Indicate that fallback storage should be used
        },
        { status: 408 }
      )
    }
    
    console.error('💥 Database error - user data not synced to MongoDB')
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to sync user data',
        details: error.message,
        fallback: true // Indicate that fallback storage should be used
      },
      { status: 500 }
    )
  }
}