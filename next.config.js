/** @type {import('next').NextConfig} */

// Importing the Sentry Next.js plugin
const { withSentryConfig } = require('@sentry/nextjs');

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
  // Only enable Sentry in production
  sentry: {
    hideSourceMaps: true,
    // Disable Sentry in development
    disableServerWebpackPlugin: process.env.NODE_ENV !== 'production',
    disableClientWebpackPlugin: process.env.NODE_ENV !== 'production',
  },
};

// For production builds, wrap with Sentry
// For development, just export the Next.js config
module.exports = process.env.NODE_ENV === 'production' 
  ? withSentryConfig(nextConfig, {
      // Additional config options for the Sentry webpack plugin. Keep in mind that
      // the following options are set automatically, and overriding them is not
      // recommended:
      //   release, url, authToken, configFile, stripPrefix,
      //   urlPrefix, include, ignore
      silent: true, // Suppresses all logs
    })
  : nextConfig; 