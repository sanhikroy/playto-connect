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
      
      // Verify user has EMPLOYER role
      if (session.user.role !== 'EMPLOYER') {
        return NextResponse.json(
          { message: 'Only employers can post jobs' },
          { status: 403 }
        )
      }
    }
    
    // Parse request body
    const jobData = await request.json()
    
    // Validate required fields
    if (!jobData.role || !jobData.company || !jobData.description) {
      return NextResponse.json(
        { message: 'Role, company, and description are required' },
        { status: 400 }
      )
    }
    
    // If this is just a save request, return success
    if (saveOnly) {
      return NextResponse.json({ 
        message: 'Job posting data saved',
        saveOnly: true
      })
    }
    
    // Get the authenticated user
    const session = await getServerSession(authOptions)
    const userId = session?.user.id
    
    // Process videos array - ensure it's an array of strings
    const videos = Array.isArray(jobData.videos) 
      ? jobData.videos.filter((url: string) => typeof url === 'string' && url.trim() !== '')
      : []
    
    // Format the job data for database storage
    const formattedJobData = {
      role: jobData.role,
      company: jobData.company,
      companyWebsite: jobData.website || null,
      socialMediaUrl: jobData.social || null,
      isRemote: jobData.isRemote || false,
      location: !jobData.isRemote && jobData.location ? {
        country: jobData.location.country,
        state: jobData.location.state || null,
        city: jobData.location.city || null
      } : null,
      jobType: jobData.jobType,
      salaryMin: parseFloat(jobData.salary?.min) || 0,
      salaryMax: parseFloat(jobData.salary?.max) || 0,
      salaryCurrency: jobData.salary?.currency || 'USD',
      description: jobData.description,
      referenceVideos: videos.length > 0 ? JSON.stringify(videos) : null,
      employerId: userId
    }
    
    // Create the job posting in the database
    // In a real app, you would have a Job model in your Prisma schema
    // For now, we'll just return a success response
    
    // const job = await prisma.job.create({
    //   data: formattedJobData
    // })
    
    // Return success response with the job ID
    return NextResponse.json({
      message: 'Job posted successfully',
      jobId: 'mock-job-id' // In a real app, this would be job.id
    })
    
  } catch (error) {
    console.error('Error posting job:', error)
    return NextResponse.json(
      { message: 'An error occurred while posting the job' },
      { status: 500 }
    )
  }
} 