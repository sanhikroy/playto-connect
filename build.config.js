/**
 * Build configuration for production deployment
 */

const config = {
  /**
   * Environment-specific configurations
   */
  environments: {
    // Development environment
    development: {
      database: {
        // Use SQLite for development
        provider: 'sqlite',
        url: 'file:./dev.db'
      }
    },
    
    // Production environment
    production: {
      database: {
        // Use PostgreSQL for production
        provider: 'postgresql',
        // Connection string should be provided as an environment variable
        url: process.env.DATABASE_URL,
        // Configure connection pooling for better performance
        pooling: {
          min: 2,
          max: 10
        }
      }
    },
    
    // Testing environment
    test: {
      database: {
        // Use SQLite in-memory for testing
        provider: 'sqlite',
        url: ':memory:'
      }
    }
  },
  
  /**
   * Build optimization settings
   */
  optimization: {
    // Compress static assets
    compressAssets: true,
    
    // Split chunks for better caching
    splitChunks: true,
    
    // Minimize output size
    minimize: true,
    
    // Generate source maps for production
    sourceMap: false
  },
  
  /**
   * Security settings
   */
  security: {
    // Headers to set for all responses
    headers: {
      // Content Security Policy
      'Content-Security-Policy': 
        "default-src 'self'; " +
        "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
        "style-src 'self' 'unsafe-inline'; " +
        "img-src 'self' data: https:; " +
        "connect-src 'self' https:; " +
        "font-src 'self'; " +
        "object-src 'none'; " +
        "media-src 'self'; " +
        "frame-src 'self';",
      
      // Prevent browsers from incorrectly detecting non-scripts as scripts
      'X-Content-Type-Options': 'nosniff',
      
      // Prevent clickjacking
      'X-Frame-Options': 'DENY',
      
      // Prevent XSS attacks
      'X-XSS-Protection': '1; mode=block'
    }
  },
  
  /**
   * Deployment settings
   */
  deployment: {
    // Choose your preferred hosting provider
    provider: 'vercel', // or 'aws', 'heroku', etc.
    
    // Configure automatic previews for PRs
    preview: true,
    
    // Configure regions for deployment
    regions: ['iad1'], // For Vercel: iad1 = US East
    
    // Configure domain
    domain: process.env.PRODUCTION_DOMAIN || 'connect-app.com'
  }
}

module.exports = config 