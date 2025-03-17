import { useState, useEffect } from 'react';

interface UseCsrfResult {
  csrfToken: string | null;
  loading: boolean;
  error: string | null;
  getHeaders: () => Record<string, string>;
}

/**
 * Custom hook to fetch and provide CSRF token for forms
 */
export function useCsrf(): UseCsrfResult {
  const [csrfToken, setCsrfToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('/api/csrf');
        
        if (!response.ok) {
          throw new Error('Failed to fetch CSRF token');
        }
        
        const data = await response.json();
        setCsrfToken(data.csrfToken);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Error fetching CSRF token:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCsrfToken();
  }, []);

  /**
   * Returns headers with CSRF token to be included in fetch requests
   */
  const getHeaders = (): Record<string, string> => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    if (csrfToken) {
      headers['x-csrf-token'] = csrfToken;
    }
    
    return headers;
  };

  return {
    csrfToken,
    loading,
    error,
    getHeaders,
  };
}

/**
 * Higher-order function to create a fetch wrapper with CSRF protection
 */
export function createProtectedFetch(csrfToken: string | null) {
  return async (url: string, options: RequestInit = {}): Promise<Response> => {
    const headers = new Headers(options.headers);
    
    if (csrfToken) {
      headers.set('x-csrf-token', csrfToken);
    }
    
    return fetch(url, {
      ...options,
      headers,
    });
  };
} 