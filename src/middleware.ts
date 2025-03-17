import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  // Public routes accessible to all users
  const publicRoutes = [
    "/",
    "/auth/signin",
    "/auth/signup",
    "/auth/error",
    "/jobs", 
  ];

  // Check if the route is public
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Allow access to job details pages
  if (pathname.match(/^\/jobs\/\d+$/)) {
    return NextResponse.next();
  }

  // Allow access to post-job page for initial form filling
  if (pathname === "/post-job") {
    return NextResponse.next();
  }

  // API routes that don't need protection
  if (pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  // Special handling for job application submission
  if (pathname === "/api/applications/submit") {
    // Check if this is just a form save request (indicated by query param)
    const url = new URL(req.url);
    if (url.searchParams.get('saveOnly') === 'true') {
      return NextResponse.next();
    }
    
    // For actual submission, require authentication
    if (!token) {
      // Store the original URL to redirect back after login
      const redirectUrl = new URL("/auth/signin", req.url);
      redirectUrl.searchParams.set("callbackUrl", req.url);
      return NextResponse.redirect(redirectUrl);
    }
  }

  // Special handling for job posting submission
  if (pathname === "/api/jobs/submit") {
    // Check if this is just a form save request
    const url = new URL(req.url);
    if (url.searchParams.get('saveOnly') === 'true') {
      return NextResponse.next();
    }
    
    // For actual submission, require authentication
    if (!token) {
      // Store the original URL to redirect back after login
      const redirectUrl = new URL("/auth/signin", req.url);
      redirectUrl.searchParams.set("callbackUrl", req.url);
      return NextResponse.redirect(redirectUrl);
    }
  }

  // Protected routes - user must be authenticated
  if (!token) {
    // Store the original URL to redirect back after login
    const redirectUrl = new URL("/auth/signin", req.url);
    redirectUrl.searchParams.set("callbackUrl", req.url);
    return NextResponse.redirect(redirectUrl);
  }

  // Role-based route protection
  const role = token.role as string;

  // Talent-only routes
  if (pathname.startsWith("/talent") && role !== "TALENT") {
    return NextResponse.redirect(new URL("/auth/error?error=AccessDenied", req.url));
  }

  // Employer-only routes
  if (pathname.startsWith("/employer") && role !== "EMPLOYER") {
    return NextResponse.redirect(new URL("/auth/error?error=AccessDenied", req.url));
  }

  return NextResponse.next();
}

// Configure which routes use this middleware
export const config = {
  matcher: [
    // Match all routes except public assets
    "/((?!_next/static|_next/image|favicon.ico|uploads).*)",
  ],
}; 