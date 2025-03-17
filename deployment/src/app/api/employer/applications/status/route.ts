import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

// Valid application statuses
const ApplicationStatus = {
  PENDING: 'PENDING',
  REVIEWING: 'REVIEWING',
  ACCEPTED: 'ACCEPTED',
  REJECTED: 'REJECTED'
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Verify user is an employer
    const user = await prisma.user.findUnique({
      where: { id: session.user.id }
    })

    if (!user || user.role !== 'EMPLOYER') {
      return NextResponse.json(
        { message: 'Unauthorized - Not an employer user' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { applicationId, status } = body

    // Validate required fields
    if (!applicationId || !status) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate status is a valid ApplicationStatus
    const validStatuses = Object.values(ApplicationStatus)
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { message: 'Invalid status' },
        { status: 400 }
      )
    }

    // Verify employer owns the job the application is for
    const application = await prisma.application.findUnique({
      where: { id: applicationId },
      include: { job: true }
    })

    if (!application) {
      return NextResponse.json(
        { message: 'Application not found' },
        { status: 404 }
      )
    }

    if (application.job.employerId !== user.id) {
      return NextResponse.json(
        { message: 'Unauthorized - Not the owner of this job' },
        { status: 403 }
      )
    }

    // Update application status
    const updatedApplication = await prisma.application.update({
      where: { id: applicationId },
      data: { status }
    })

    return NextResponse.json(updatedApplication)
  } catch (error) {
    console.error('Error updating application status:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
} 