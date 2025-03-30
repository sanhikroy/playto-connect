import { NextResponse } from 'next/server'
import { pb } from '@/lib/pocketbase'
import prisma from '@/lib/prisma'

export async function GET() {
  // Check if user is authenticated
  if (!pb.authStore.isValid || !pb.authStore.model) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const user = pb.authStore.model

  try {
    const applications = await prisma.application.findMany({
      where: {
        talentId: user.id
      },
      include: {
        job: true
      }
    })

    return NextResponse.json(applications)
  } catch (error) {
    console.error('Failed to fetch applications:', error)
    return NextResponse.json(
      { error: 'Failed to fetch applications' },
      { status: 500 }
    )
  }
} 