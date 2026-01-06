import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { userCollection, ObjectId } from '@/lib/db.connect'

export async function POST(request) {
  try {
    const { name, email, contact, nidNo, password } = await request.json()

    // Validate required fields
    if (!name || !email || !password) {
      return NextResponse.json(
        { message: 'Name, email, and password are required' },
        { status: 400 }
      )
    }

    // Check if user already exists with timeout
    const existingUser = await Promise.race([
      (await userCollection()).findOne({ email }),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Database query timeout')), 10000)
      )
    ])

    if (existingUser) {
      return NextResponse.json(
        { message: 'User with this email already exists' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user
    const userData = {
      name,
      email,
      contact,
      nidNo,
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    const result = await Promise.race([
      (await userCollection()).insertOne(userData),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Database insert timeout')), 10000)
      )
    ])

    // Remove password from response
    const { password: _, ...userWithoutPassword } = userData

    return NextResponse.json(
      { 
        message: 'User created successfully', 
        user: { 
          ...userWithoutPassword, 
          id: result.insertedId 
        } 
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Registration error:', error)
    
    if (error.message.includes('timeout') || error.code === 'ETIMEOUT') {
      return NextResponse.json(
        { message: 'Database connection timeout. Please try again later.' },
        { status: 408 }
      )
    }
    
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}