import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

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
      where: { id: session.user.id },
      include: { employerProfile: true }
    })

    if (!user || user.role !== 'EMPLOYER') {
      return NextResponse.json(
        { message: 'Unauthorized - Not an employer user' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { companyName, companyDescription, industry, website, location, size } = body

    // Validate required fields
    if (!companyName || !companyDescription || !industry || !website || !location || !size) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Update or create employer profile
    const employerProfile = await prisma.employerProfile.upsert({
      where: {
        userId: user.id
      },
      update: {
        companyName,
        companyDescription,
        industry,
        website,
        location,
        size,
        isComplete: true
      },
      create: {
        userId: user.id,
        companyName,
        companyDescription,
        industry,
        website,
        location,
        size,
        isComplete: true
      }
    })

    // Update user's profile completion status
    await prisma.user.update({
      where: { id: user.id },
      data: { hasCompletedProfile: true }
    })

    return NextResponse.json(employerProfile)
  } catch (error) {
    console.error('Error updating employer profile:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET() {
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
      where: { id: session.user.id },
      include: { employerProfile: true }
    })

    if (!user || user.role !== 'EMPLOYER') {
      return NextResponse.json(
        { message: 'Unauthorized - Not an employer user' },
        { status: 403 }
      )
    }

    if (!user.employerProfile) {
      return NextResponse.json(
        { message: 'Profile not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(user.employerProfile)
  } catch (error) {
    console.error('Error fetching employer profile:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
} 