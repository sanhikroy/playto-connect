import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disable ESLint on build for production deployment
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ['localhost', 'via.placeholder.com'],
    // For a production app, we'd add actual hosting domains like AWS S3
  },
  // API configuration should be under server options
  serverRuntimeConfig: {
    // Will only be available on the server side
  },
  publicRuntimeConfig: {
    // Will be available on both server and client
  },
  // Configure file uploads with custom server middleware
  experimental: {
    // Add any experimental features if needed
  },
  // External packages for server components
  serverExternalPackages: [],
};

// Note about large file uploads:
// For larger file uploads (>4MB), you should:
// 1. Use a separate API route with appropriate middleware
// 2. Configure your hosting platform (e.g., Vercel) to allow larger payloads
// 3. Consider using direct-to-storage uploads for production environments

export default nextConfig;
