import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { hash } from 'bcrypt'

export async function POST(request: Request) {
  try {
    const { name, email, password, role } = await request.json()
    
    // Validate inputs
    if (!email || !password || !role) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      )
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: 'Invalid email format' },
        { status: 400 }
      )
    }
    
    // Validate password length
    if (password.length < 8) {
      return NextResponse.json(
        { message: 'Password must be at least 8 characters long' },
        { status: 400 }
      )
    }
    
    // Validate role
    if (role !== 'TALENT' && role !== 'EMPLOYER') {
      return NextResponse.json(
        { message: 'Invalid role. Must be either TALENT or EMPLOYER' },
        { status: 400 }
      )
    }
    
    // Check if user with email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })
    
    if (existingUser) {
      return NextResponse.json(
        { message: 'Email already in use' },
        { status: 409 }
      )
    }
    
    // Hash the password
    const hashedPassword = await hash(password, 10)
    
    // Create the new user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role,
      }
    })
    
    // Return the user without the password
    const { password: _omitted, ...userWithoutPassword } = user
    
    return NextResponse.json(
      { user: userWithoutPassword, message: 'User created successfully' },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error during registration:', error)
    return NextResponse.json(
      { message: 'An error occurred during registration' },
      { status: 500 }
    )
  }
} 