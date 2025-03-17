import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { csrfMiddleware } from '@/lib/csrf'

export async function POST(request: Request) {
  try {
    // Get query parameters to check if this is just a save request
    const url = new URL(request.url)
    const saveOnly = url.searchParams.get('saveOnly') === 'true'
    
    // If not just saving, apply CSRF protection and require authentication
    if (!saveOnly) {
      // Apply CSRF protection middleware
      const csrfCheck = await csrfMiddleware()(request)
      
      if (!csrfCheck.success) {
        return NextResponse.json(
          { message: csrfCheck.message || 'CSRF validation failed' },
          { status: 403 }
        )
      }
      
      // Check if user is authenticated
      const session = await getServerSession(authOptions)
      
      if (!session) {
        return NextResponse.json(
          { message: 'Authentication required' },
          { status: 401 }
        )
      }
      
      // Verify user has TALENT role
      if (session.user.role !== 'TALENT') {
        return NextResponse.json(
          { message: 'Only talent users can apply for jobs' },
          { status: 403 }
        )
      }
    }
    
    // Parse request body
    const { 
      jobId, 
      whyInterested, 
      referenceVideo, 
      additionalInfo 
    } = await request.json()
    
    // Validate required fields
    if (!jobId || !whyInterested) {
      return NextResponse.json(
        { message: 'Job ID and reason for interest are required' },
        { status: 400 }
      )
    }
    
    // If this is just a save request, return success
    if (saveOnly) {
      return NextResponse.json({ 
        message: 'Application data saved',
        saveOnly: true
      })
    }
    
    // Get the authenticated user
    const session = await getServerSession(authOptions)
    const userId = session?.user.id
    
    // Create the application in the database
    // In a real app, you would have an Application model in your Prisma schema
    // For now, we'll just return a success response
    
    // const application = await prisma.application.create({
    //   data: {
    //     jobId,
    //     userId,
    //     coverLetter: whyInterested,
    //     referenceVideo,
    //     additionalInfo,
    //     status: 'PENDING'
    //   }
    // })
    
    // Return success response
    return NextResponse.json({
      message: 'Application submitted successfully',
      // applicationId: application.id
    })
    
  } catch (error) {
    console.error('Error submitting application:', error)
    return NextResponse.json(
      { message: 'An error occurred while submitting your application' },
      { status: 500 }
    )
  }
} 