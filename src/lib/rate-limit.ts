import { NextResponse } from 'next/server';

/**
 * In-memory store for rate limiting
 * Note: In a production environment with multiple instances, use Redis or another
 * distributed store to share rate limit data across instances
 */
const ipRequestCounts = new Map<string, { count: number; resetTime: number }>();

// Clean up the in-memory store periodically to prevent memory leaks
const CLEANUP_INTERVAL = 60 * 60 * 1000; // 1 hour
setInterval(() => {
  const now = Date.now();
  for (const [ip, data] of ipRequestCounts.entries()) {
    if (data.resetTime <= now) {
      ipRequestCounts.delete(ip);
    }
  }
}, CLEANUP_INTERVAL);

interface RateLimitOptions {
  /**
   * Maximum number of requests allowed within the window
   */
  limit: number;
  
  /**
   * Time window in milliseconds
   */
  windowMs: number;
  
  /**
   * Optional function to generate a custom identifier instead of using IP
   */
  keyGenerator?: (req: Request) => string;
  
  /**
   * Optional message to return when rate limit is exceeded
   */
  message?: string;
}

interface RateLimitResult {
  success: boolean;
  message?: string;
  headers?: Record<string, string>;
}

/**
 * Rate limiting middleware for Next.js API routes
 */
export function createRateLimiter(options: RateLimitOptions) {
  const {
    limit = 60,
    windowMs = 60 * 1000, // 1 minute
    keyGenerator = (req: Request) => {
      // Get client IP from various headers or connection
      const forwardedFor = req.headers.get('x-forwarded-for');
      if (forwardedFor) {
        // Get the first IP if there are multiple in the header
        return forwardedFor.split(',')[0].trim();
      }
      
      const realIp = req.headers.get('x-real-ip');
      if (realIp) {
        return realIp;
      }
      
      // Fallback to a default value if we can't determine the IP
      return 'unknown';
    },
    message = 'Too many requests, please try again later.'
  } = options;
  
  return async (req: Request): Promise<RateLimitResult> => {
    try {
      // Get identifier for this request (typically IP address)
      const key = keyGenerator(req);
      
      const now = Date.now();
      const resetTime = now + windowMs;
      
      // Get current count for this identifier
      const current = ipRequestCounts.get(key) || { count: 0, resetTime };
      
      // Reset count if the time window has passed
      if (current.resetTime <= now) {
        current.count = 0;
        current.resetTime = resetTime;
      }
      
      // Increment count
      current.count += 1;
      
      // Update in store
      ipRequestCounts.set(key, current);
      
      // Check if over limit
      if (current.count > limit) {
        const retryAfter = Math.ceil((current.resetTime - now) / 1000);
        
        return {
          success: false,
          message,
          headers: {
            'Retry-After': String(retryAfter),
            'X-RateLimit-Limit': String(limit),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': String(Math.ceil(current.resetTime / 1000)),
          }
        };
      }
      
      // Not over limit
      return {
        success: true,
        headers: {
          'X-RateLimit-Limit': String(limit),
          'X-RateLimit-Remaining': String(limit - current.count),
          'X-RateLimit-Reset': String(Math.ceil(current.resetTime / 1000)),
        }
      };
    } catch (error) {
      console.error('Rate limit error:', error);
      // Don't block the request if there's an error in the rate limiter
      return { success: true };
    }
  };
}

/**
 * Apply rate limit headers to a NextResponse object
 */
export function applyRateLimitHeaders(response: NextResponse, headers?: Record<string, string>): NextResponse {
  if (headers) {
    Object.entries(headers).forEach(([key, value]) => {
      response.headers.set(key, value);
    });
  }
  return response;
}

/**
 * Pre-configured rate limiters for different API routes
 */
export const rateLimiters = {
  // Default API rate limit: 60 requests per minute
  default: createRateLimiter({
    limit: 60,
    windowMs: 60 * 1000,
  }),
  
  // Auth-related endpoints: 10 requests per minute (stricter to prevent brute force)
  auth: createRateLimiter({
    limit: 10,
    windowMs: 60 * 1000,
    message: 'Too many authentication attempts. Please try again later.',
  }),
  
  // Password reset: 3 requests per 15 minutes (very strict)
  passwordReset: createRateLimiter({
    limit: 3,
    windowMs: 15 * 60 * 1000,
    message: 'Too many password reset attempts. Please try again later.',
  }),
}; 