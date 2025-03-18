import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { ensureDirectoryExists, getUploadsDirectory } from '@/lib/utils/fileStorage';

// Define the update data type
interface TalentProfileUpdate {
  profilePicture: string;
  updatedAt: Date;
}

// For production, you would use a cloud storage solution like AWS S3
// This implementation uses local storage for simplicity
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get form data from request
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { message: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { message: 'Invalid file type. Only JPEG, PNG, GIF, and WebP are supported.' },
        { status: 400 }
      );
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { message: 'File too large. Maximum size is 5MB.' },
        { status: 400 }
      );
    }

    // Generate a unique filename
    const fileExtension = file.name.split('.').pop() || 'jpg';
    const fileName = `${uuidv4()}.${fileExtension.toLowerCase()}`;
    
    // Get uploads directory and ensure it exists
    const uploadsDir = getUploadsDirectory();
    await ensureDirectoryExists(uploadsDir);
    
    try {
      // Convert file to buffer
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      // Write file to disk
      const filePath = join(uploadsDir, fileName);
      await writeFile(filePath, buffer);
      
      // Generate URL for the uploaded file
      const fileUrl = `/uploads/${fileName}`;
      
      // Find the user and their talent profile
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        include: { talentProfile: true }
      });
      
      if (!user) {
        return NextResponse.json(
          { message: 'User not found. Please log in again.' },
          { status: 404 }
        );
      }
      
      if (!user.talentProfile) {
        return NextResponse.json(
          { message: 'Talent profile not found. Please complete your profile first.' },
          { status: 404 }
        );
      }
      
      // Update the talent profile with the new profile picture URL
      const updateData: TalentProfileUpdate = {
        profilePicture: fileUrl,
        updatedAt: new Date()
      };
      
      await prisma.talentProfile.update({
        where: { id: user.talentProfile.id },
        data: updateData
      });
      
      return NextResponse.json({
        message: 'File uploaded successfully',
        url: fileUrl
      });
    } catch (error) {
      console.error('Error saving file:', error);
      return NextResponse.json(
        { message: 'Error saving file' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error uploading profile picture:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 