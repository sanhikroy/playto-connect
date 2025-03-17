import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

/**
 * Verifies if a password reset token is valid
 * 
 * GET /api/auth/verify-reset-token?token=xyz
 * 
 * Response:
 *   Success: { valid: true, email: string }
 *   Error: { valid: false, error: string }
 */
export async function GET(request: Request) {
  try {
    // Get token from URL parameters
    const url = new URL(request.url)
    const token = url.searchParams.get('token')
    
    if (!token) {
      return NextResponse.json({ valid: false, error: 'Token is required' }, { status: 400 })
    }
    
    // Find the token in the database
    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { token }
    })
    
    // Check if token exists
    if (!resetToken) {
      return NextResponse.json({ valid: false, error: 'Invalid token' }, { status: 400 })
    }
    
    // Check if token has expired
    if (new Date() > resetToken.expires) {
      return NextResponse.json({ valid: false, error: 'Token has expired' }, { status: 400 })
    }
    
    // Token is valid
    return NextResponse.json({ valid: true, email: resetToken.email })
    
  } catch (error) {
    console.error('Error verifying token:', error)
    return NextResponse.json({ valid: false, error: 'Failed to verify token' }, { status: 500 })
  }
} 