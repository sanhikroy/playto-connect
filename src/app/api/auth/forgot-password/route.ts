import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcrypt'
import { v4 as uuidv4 } from 'uuid'
import prisma from '@/lib/prisma'
import { sendPasswordResetEmail } from '@/lib/email'
import Tokens from 'csrf'

// Create a new CSRF tokens generator
const csrf = new Tokens()

// Generate a new secret
const secret = process.env.CSRF_SECRET || 'default-secret-do-not-use-in-production'

/**
 * POST /api/auth/forgot-password
 * 
 * Request body: { email: string, csrfToken: string }
 * Response: 
 *   Success: { success: true, message: string }
 *   Error: { success: false, error: string }
 */
export async function POST(request: NextRequest) {
  try {
    // 1. Parse the request body
    const body = await request.json()
    const { email, csrfToken } = body

    // 2. Validate inputs
    if (!email) {
      return NextResponse.json({ success: false, error: 'Email is required' }, { status: 400 })
    }

    // 3. If CSRF protection is enabled (should be in production)
    if (process.env.NODE_ENV === 'production') {
      // Check CSRF token from request
      if (!csrfToken) {
        return NextResponse.json({ success: false, error: 'CSRF token is required' }, { status: 400 })
      }

      // Verify CSRF token
      const validToken = csrf.verify(secret, csrfToken)
      if (!validToken) {
        return NextResponse.json({ success: false, error: 'Invalid CSRF token' }, { status: 403 })
      }
    }

    // 4. Check if user exists
    const user = await prisma.user.findUnique({
      where: { email },
    })

    // 5. Return success even if user doesn't exist for security reasons
    if (!user) {
      // We don't want to reveal that the email doesn't exist in our database
      // So we still return success=true but don't send any email
      return NextResponse.json({
        success: true,
        message: 'If your email exists in our system, you will receive a password reset link shortly'
      })
    }

    // 6. Generate a unique token
    const token = uuidv4()

    // 7. Set expiration time (1 hour from now)
    const expiresIn = 60 * 60 * 1000 // 1 hour in milliseconds
    const expires = new Date(Date.now() + expiresIn)

    // 8. Delete any existing reset tokens for this user
    await prisma.passwordResetToken.deleteMany({
      where: { email },
    })

    // 9. Create a new password reset token in the database
    await prisma.passwordResetToken.create({
      data: {
        email,
        token,
        expires,
      },
    })

    // 10. Send email with reset link
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password?token=${token}`
    await sendPasswordResetEmail(email, resetUrl)

    // 11. Return success response
    return NextResponse.json({
      success: true,
      message: 'If your email exists in our system, you will receive a password reset link shortly'
    })
  } catch (error) {
    console.error('Password reset request failed:', error)
    return NextResponse.json({ success: false, error: 'Failed to process password reset request' }, { status: 500 })
  }
} 