/** @type {import('next').NextConfig} */

const nextConfig = {
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

module.exports = nextConfig; 