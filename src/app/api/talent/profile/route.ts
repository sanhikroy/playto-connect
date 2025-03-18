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

    // Verify user is a talent
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { talentProfile: true }
    })

    if (!user || user.role !== 'TALENT') {
      return NextResponse.json(
        { message: 'Unauthorized - Not a talent user' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { title, bio, skills, experience, portfolioVideos, socialMediaUrl, profilePicture } = body

    // Validate required fields
    if (!title || !bio || !skills || !experience) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Convert skills to JSON string if it's an array
    const skillsData = Array.isArray(skills) ? JSON.stringify(skills) : skills;
    
    // Convert portfolioVideos to JSON string if it's an array
    const portfolioVideosData = Array.isArray(portfolioVideos) ? JSON.stringify(portfolioVideos) : portfolioVideos;

    // Update or create talent profile
    const talentProfile = await prisma.talentProfile.upsert({
      where: {
        userId: user.id
      },
      update: {
        title,
        bio,
        skills: skillsData,
        experience,
        socialMediaUrl: socialMediaUrl || null,
        isComplete: true,
        updatedAt: new Date(),
        ...(profilePicture && { profilePicture }),
        ...(portfolioVideosData && { portfolioVideos: portfolioVideosData })
      },
      create: {
        userId: user.id,
        title,
        bio,
        skills: skillsData,
        experience,
        socialMediaUrl: socialMediaUrl || null,
        isComplete: true,
        ...(profilePicture && { profilePicture }),
        ...(portfolioVideosData && { portfolioVideos: portfolioVideosData })
      }
    })

    // Update user's profile completion status
    await prisma.user.update({
      where: { id: user.id },
      data: { hasCompletedProfile: true }
    })

    return NextResponse.json(talentProfile)
  } catch (error) {
    console.error('Error updating talent profile:', error)
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

    // Verify user is a talent
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { talentProfile: true }
    })

    if (!user || user.role !== 'TALENT') {
      return NextResponse.json(
        { message: 'Unauthorized - Not a talent user' },
        { status: 403 }
      )
    }

    if (!user.talentProfile) {
      return NextResponse.json(
        { message: 'Talent profile not found' },
        { status: 404 }
      )
    }

    // Parse JSON fields for client
    const profile = {
      ...user.talentProfile,
      skills: user.talentProfile.skills ? JSON.parse(user.talentProfile.skills) : [],
      portfolioVideos: user.talentProfile.portfolioVideos ? JSON.parse(user.talentProfile.portfolioVideos) : []
    }

    return NextResponse.json(profile)
  } catch (error) {
    console.error('Error fetching talent profile:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
} 