import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { v4 as uuidv4 } from 'uuid';
import { processVideoUrl } from '@/lib/utils/talentProfile';

// Add a new video to the portfolio
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Verify user is a talent
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { talentProfile: true }
    });

    if (!user || user.role !== 'TALENT') {
      return NextResponse.json(
        { message: 'Unauthorized - Not a talent user' },
        { status: 403 }
      );
    }

    if (!user.talentProfile) {
      return NextResponse.json(
        { message: 'Talent profile not found' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { videoUrl } = body;

    if (!videoUrl) {
      return NextResponse.json(
        { message: 'Video URL is required' },
        { status: 400 }
      );
    }

    // Process the video URL to ensure it's valid
    const videoInfo = processVideoUrl(videoUrl);
    if (!videoInfo) {
      return NextResponse.json(
        { message: 'Invalid video URL. Only YouTube and Instagram are supported.' },
        { status: 400 }
      );
    }

    // Get existing videos
    let portfolioVideos = [];
    try {
      if (user.talentProfile.portfolioVideos) {
        portfolioVideos = JSON.parse(user.talentProfile.portfolioVideos);
      }
    } catch (error) {
      // If parsing fails, start with an empty array
      portfolioVideos = [];
    }

    // Check if we've reached the maximum number of videos
    if (portfolioVideos.length >= 10) {
      return NextResponse.json(
        { message: 'Maximum of 10 videos allowed in portfolio' },
        { status: 400 }
      );
    }

    // Create a new video object
    const newVideo = {
      id: uuidv4(),
      url: videoUrl,
      type: videoInfo.type,
      title: body.title || ''
    };

    // Add to the portfolio
    portfolioVideos.push(newVideo);

    // Update the talent profile
    await prisma.talentProfile.update({
      where: { id: user.talentProfile.id },
      data: {
        portfolioVideos: JSON.stringify(portfolioVideos),
        updatedAt: new Date()
      }
    });

    return NextResponse.json({
      message: 'Video added to portfolio',
      video: newVideo,
      count: portfolioVideos.length
    });
  } catch (error) {
    console.error('Error adding video to portfolio:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Remove a video from the portfolio
export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Verify user is a talent
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { talentProfile: true }
    });

    if (!user || user.role !== 'TALENT') {
      return NextResponse.json(
        { message: 'Unauthorized - Not a talent user' },
        { status: 403 }
      );
    }

    if (!user.talentProfile) {
      return NextResponse.json(
        { message: 'Talent profile not found' },
        { status: 404 }
      );
    }

    // Get the video ID from the URL
    const { searchParams } = new URL(request.url);
    const videoId = searchParams.get('id');

    if (!videoId) {
      return NextResponse.json(
        { message: 'Video ID is required' },
        { status: 400 }
      );
    }

    // Get existing videos
    let portfolioVideos = [];
    try {
      if (user.talentProfile.portfolioVideos) {
        portfolioVideos = JSON.parse(user.talentProfile.portfolioVideos);
      }
    } catch (error) {
      // If parsing fails, start with an empty array
      portfolioVideos = [];
    }

    // Filter out the video to remove
    const updatedVideos = portfolioVideos.filter((video: any) => video.id !== videoId);

    // If the length is the same, the video wasn't found
    if (updatedVideos.length === portfolioVideos.length) {
      return NextResponse.json(
        { message: 'Video not found in portfolio' },
        { status: 404 }
      );
    }

    // Update the talent profile
    await prisma.talentProfile.update({
      where: { id: user.talentProfile.id },
      data: {
        portfolioVideos: JSON.stringify(updatedVideos),
        updatedAt: new Date()
      }
    });

    return NextResponse.json({
      message: 'Video removed from portfolio',
      count: updatedVideos.length
    });
  } catch (error) {
    console.error('Error removing video from portfolio:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 