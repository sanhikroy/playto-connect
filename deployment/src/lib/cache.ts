/**
 * Cache utilities for both client and server-side caching
 */

// Time in milliseconds
interface CacheOptions {
  ttl: number; // Time to live in milliseconds
  staleWhileRevalidate?: boolean; // Whether to return stale data while revalidating
}

// Default cache options
const DEFAULT_CACHE_OPTIONS: CacheOptions = {
  ttl: 5 * 60 * 1000, // 5 minutes
  staleWhileRevalidate: true,
};

// In-memory cache for server components
// Note: This will reset on server restart, use Redis or similar for persistent cache
const serverCache = new Map<string, { data: any; timestamp: number }>();

/**
 * Get data from cache
 * @param key Cache key
 * @param options Cache options
 * @returns Cached data or null if not found/expired
 */
export function getCachedData(key: string, options = DEFAULT_CACHE_OPTIONS) {
  const cached = serverCache.get(key);
  const now = Date.now();

  if (!cached) {
    return null;
  }

  const isExpired = now - cached.timestamp > options.ttl;

  if (isExpired && !options.staleWhileRevalidate) {
    return null;
  }

  return {
    data: cached.data,
    isStale: isExpired,
  };
}

/**
 * Set data in cache
 * @param key Cache key
 * @param data Data to cache
 * @param options Cache options
 */
export function setCachedData(key: string, data: any, options = DEFAULT_CACHE_OPTIONS) {
  serverCache.set(key, {
    data,
    timestamp: Date.now(),
  });

  // If in a browser environment, also set in localStorage with expiry
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(
        `cache:${key}`,
        JSON.stringify({
          data,
          timestamp: Date.now(),
          expiry: Date.now() + options.ttl,
        })
      );
    } catch (error) {
      console.error('Error setting cache in localStorage', error);
    }
  }
}

/**
 * Client-side cache utility
 */
export const clientCache = {
  get: (key: string, options = DEFAULT_CACHE_OPTIONS) => {
    if (typeof window === 'undefined') {
      return null;
    }

    try {
      const item = localStorage.getItem(`cache:${key}`);
      if (!item) return null;

      const parsed = JSON.parse(item);
      const now = Date.now();
      const isExpired = now > parsed.expiry;

      if (isExpired && !options.staleWhileRevalidate) {
        localStorage.removeItem(`cache:${key}`);
        return null;
      }

      return {
        data: parsed.data,
        isStale: isExpired,
      };
    } catch (error) {
      console.error('Error getting cache from localStorage', error);
      return null;
    }
  },

  set: (key: string, data: any, options = DEFAULT_CACHE_OPTIONS) => {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      localStorage.setItem(
        `cache:${key}`,
        JSON.stringify({
          data,
          timestamp: Date.now(),
          expiry: Date.now() + options.ttl,
        })
      );
    } catch (error) {
      console.error('Error setting cache in localStorage', error);
    }
  },

  remove: (key: string) => {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      localStorage.removeItem(`cache:${key}`);
    } catch (error) {
      console.error('Error removing cache from localStorage', error);
    }
  },

  clear: () => {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith('cache:')) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.error('Error clearing cache from localStorage', error);
    }
  },
};

/**
 * Wrap an async function with caching
 * @param fn Function to wrap
 * @param keyFn Function to generate cache key from args
 * @param options Cache options
 * @returns Wrapped function
 */
export function withCache<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  keyFn: (...args: Parameters<T>) => string,
  options = DEFAULT_CACHE_OPTIONS
) {
  return async (...args: Parameters<T>): Promise<ReturnType<T>> => {
    const key = keyFn(...args);
    
    // Try to get from cache
    const cached = getCachedData(key, options);
    
    if (cached && !cached.isStale) {
      return cached.data as ReturnType<T>;
    }
    
    // If stale but valid, fetch new data in background but return stale immediately
    if (cached && cached.isStale && options.staleWhileRevalidate) {
      // Schedule background revalidation
      fn(...args).then(data => {
        setCachedData(key, data, options);
      }).catch(console.error);
      
      return cached.data as ReturnType<T>;
    }
    
    // Nothing cached or expired, fetch fresh data
    const data = await fn(...args);
    setCachedData(key, data, options);
    return data;
  };
} 