import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Verify user is a talent
    const user = await prisma.user.findUnique({
      where: { id: session.user.id }
    })

    if (!user || user.role !== 'TALENT') {
      return NextResponse.json(
        { message: 'Unauthorized - Not a talent user' },
        { status: 403 }
      )
    }

    // Fetch applications with job and employer details
    const applications = await prisma.application.findMany({
      where: {
        talentId: user.id
      },
      include: {
        job: {
          include: {
            employer: {
              include: {
                employerProfile: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(applications)
  } catch (error) {
    console.error('Error fetching applications:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
} 