import { NextResponse } from 'next/server'
import { rateLimiters, applyRateLimitHeaders } from '@/lib/rate-limit'
import extendedPrisma from '@/lib/prisma-helpers'

export async function POST(request: Request) {
  try {
    // Apply rate limiting (auth limits for token verification)
    const rateLimit = await rateLimiters.auth(request);
    
    if (!rateLimit.success) {
      const response = NextResponse.json(
        { message: rateLimit.message || 'Too many requests. Please try again later.' },
        { status: 429 }
      );
      
      // Add rate limiting headers to the response
      return applyRateLimitHeaders(response, rateLimit.headers);
    }

    const { token } = await request.json()

    if (!token) {
      return NextResponse.json(
        { message: 'Token is required' },
        { status: 400 }
      )
    }

    // Find the token in the database
    const resetToken = await extendedPrisma.passwordResetToken.findUnique({
      where: { token }
    })

    // Check if token exists and is not expired
    if (!resetToken || resetToken.expires < new Date()) {
      // If token doesn't exist or is expired, return an error
      const response = NextResponse.json(
        { message: 'Invalid or expired token' },
        { status: 400 }
      );
      
      return applyRateLimitHeaders(response, rateLimit.headers);
    }

    // Token is valid
    const response = NextResponse.json({
      message: 'Token is valid',
      email: resetToken.email
    });
    
    return applyRateLimitHeaders(response, rateLimit.headers);
  } catch (error) {
    console.error('Error verifying reset token:', error)
    return NextResponse.json(
      { message: 'An error occurred while verifying the token' },
      { status: 500 }
    )
  }
} 