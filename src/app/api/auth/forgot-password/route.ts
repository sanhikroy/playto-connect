import { NextResponse } from 'next/server'
import { randomBytes } from 'crypto'
import { csrfMiddleware } from '@/lib/csrf'
import { rateLimiters, applyRateLimitHeaders } from '@/lib/rate-limit'
import extendedPrisma from '@/lib/prisma-helpers'

// In a production app, you would use an email service like SendGrid, Mailgun, etc.
// For this example, we'll just log the reset link to the console
async function sendPasswordResetEmail(email: string, token: string) {
  const resetLink = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/auth/reset-password?token=${token}`
  
  console.log(`
    =============================
    Password Reset Link for ${email}:
    ${resetLink}
    =============================
  `)
  
  // Simulating successful email sending
  return true
}

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

    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { message: 'Email is required' },
        { status: 400 }
      )
    }

    // Check if user exists
    const user = await extendedPrisma.user.findUnique({
      where: { email }
    })

    // For security reasons, we don't want to reveal if a user exists or not
    // So we always return success, even if the email doesn't exist
    if (!user) {
      // Still add rate limiting headers even for non-existent users
      const response = NextResponse.json({
        message: 'If an account with that email exists, we have sent a password reset link'
      });
      
      return applyRateLimitHeaders(response, rateLimit.headers);
    }

    // Generate a token
    const token = randomBytes(32).toString('hex')
    
    // Set expiration time to 1 hour from now
    const expires = new Date(Date.now() + 3600000)

    // Delete any existing reset tokens for this user
    await extendedPrisma.passwordResetToken.deleteMany({
      where: { email }
    })

    // Create a new reset token
    await extendedPrisma.passwordResetToken.create({
      data: {
        token,
        email,
        expires
      }
    })

    // Send the reset email
    await sendPasswordResetEmail(email, token)

    // Return success response with rate limiting headers
    const response = NextResponse.json({
      message: 'If an account with that email exists, we have sent a password reset link'
    });
    
    return applyRateLimitHeaders(response, rateLimit.headers);
  } catch (error) {
    console.error('Error in forgot password:', error)
    return NextResponse.json(
      { message: 'An error occurred while processing your request' },
      { status: 500 }
    )
  }
} 