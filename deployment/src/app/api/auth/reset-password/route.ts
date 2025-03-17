import { NextResponse } from 'next/server'
import { hash } from 'bcrypt'
import { rateLimiters, applyRateLimitHeaders } from '@/lib/rate-limit'
import { csrfMiddleware } from '@/lib/csrf'
import extendedPrisma from '@/lib/prisma-helpers'

export async function POST(request: Request) {
  try {
    // Apply rate limiting (strict limits for password reset)
    const rateLimit = await rateLimiters.passwordReset(request);
    
    if (!rateLimit.success) {
      const response = NextResponse.json(
        { message: rateLimit.message || 'Too many requests. Please try again later.' },
        { status: 429 }
      );
      
      // Add rate limiting headers to the response
      return applyRateLimitHeaders(response, rateLimit.headers);
    }
    
    // Apply CSRF protection middleware
    const csrfCheck = await csrfMiddleware()(request);
    
    if (!csrfCheck.success) {
      return NextResponse.json(
        { message: csrfCheck.message || 'CSRF validation failed' },
        { status: 403 }
      );
    }

    const { token, password } = await request.json()

    if (!token || !password) {
      return NextResponse.json(
        { message: 'Token and password are required' },
        { status: 400 }
      )
    }

    // Validate password
    if (password.length < 8) {
      return NextResponse.json(
        { message: 'Password must be at least 8 characters long' },
        { status: 400 }
      )
    }

    // Find the token in the database
    const resetToken = await extendedPrisma.passwordResetToken.findUnique({
      where: { token }
    })

    // Check if token exists and is not expired
    if (!resetToken || resetToken.expires < new Date()) {
      return NextResponse.json(
        { message: 'Invalid or expired token' },
        { status: 400 }
      )
    }

    // Find the user with the email associated with the token
    const user = await extendedPrisma.user.findUnique({
      where: { email: resetToken.email }
    })

    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      )
    }

    // Hash the new password
    const hashedPassword = await hash(password, 10)

    // Update the user's password
    await extendedPrisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword }
    })

    // Delete all reset tokens for this user
    await extendedPrisma.passwordResetToken.deleteMany({
      where: { email: user.email }
    })

    // Return success response with rate limiting headers
    const response = NextResponse.json({
      message: 'Password has been reset successfully'
    });
    
    return applyRateLimitHeaders(response, rateLimit.headers);
  } catch (error) {
    console.error('Error resetting password:', error)
    return NextResponse.json(
      { message: 'An error occurred while resetting the password' },
      { status: 500 }
    )
  }
} 