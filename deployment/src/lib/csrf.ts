// Import the CSRF library
import Tokens from 'csrf';

// Initialize the CSRF tokens handler
const tokens = new Tokens();

// Secret used to generate tokens - in production, this should be stored securely
// and potentially rotated periodically
let secret: string | null = null;

/**
 * Initialize or retrieve the CSRF secret
 * In a production environment, you might want to store this in Redis or another cache
 */
export async function getSecret(): Promise<string> {
  if (!secret) {
    // Generate a new secret
    secret = await tokens.secret();
  }
  return secret;
}

/**
 * Generate a CSRF token
 */
export async function generateToken(): Promise<string> {
  const secret = await getSecret();
  return tokens.create(secret);
}

/**
 * Verify a CSRF token against the secret
 */
export async function verifyToken(token: string): Promise<boolean> {
  try {
    const secret = await getSecret();
    return tokens.verify(secret, token);
  } catch (error) {
    console.error('CSRF token verification error:', error);
    return false;
  }
}

/**
 * CSRF middleware for API routes
 * This will check for a valid CSRF token in the request headers or body
 */
export function csrfMiddleware() {
  return async (req: Request): Promise<{ success: boolean; message?: string }> => {
    // Skip for GET, HEAD, OPTIONS requests as they should be idempotent
    if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
      return { success: true };
    }

    try {
      // Get the CSRF token from headers
      const csrfToken = req.headers.get('x-csrf-token');
      
      if (!csrfToken) {
        return {
          success: false,
          message: 'CSRF token is missing'
        };
      }

      // Verify the token
      const isValid = await verifyToken(csrfToken);
      
      if (!isValid) {
        return {
          success: false,
          message: 'Invalid CSRF token'
        };
      }

      return { success: true };
    } catch (error) {
      console.error('CSRF middleware error:', error);
      return {
        success: false,
        message: 'CSRF protection error'
      };
    }
  };
} 