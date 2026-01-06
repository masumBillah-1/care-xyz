import { NextResponse } from 'next/server'
import { userCollection } from '@/lib/db.connect'

export async function PUT(request) {
  try {
    const userData = await request.json()
    const { email, ...updateData } = userData
    
    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email is required' },
        { status: 400 }
      )
    }
    
    // Update user in MongoDB
    const updateResult = await (await userCollection()).updateOne(
      { email: email },
      { 
        $set: {
          ...updateData,
          updatedAt: new Date()
        }
      }
    )
    
    if (updateResult.matchedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      modified: updateResult.modifiedCount > 0
    })
  } catch (error) {
    console.error('Profile update error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to update profile',
        details: error.message 
      },
      { status: 500 }
    )
  }
}