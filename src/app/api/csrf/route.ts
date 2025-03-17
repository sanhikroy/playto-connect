import { NextResponse } from 'next/server';
import { generateToken } from '@/lib/csrf';

// Endpoint to generate and provide a CSRF token
export async function GET() {
  try {
    // Generate a new CSRF token
    const csrfToken = await generateToken();
    
    // Return the token
    return NextResponse.json({ csrfToken });
  } catch (error) {
    console.error('Error generating CSRF token:', error);
    return NextResponse.json(
      { message: 'Failed to generate CSRF token' },
      { status: 500 }
    );
  }
} 