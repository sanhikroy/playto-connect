/**
 * Application monitoring utilities
 * 
 * This can be connected to services like Sentry, LogRocket, or custom analytics
 */

// For client-side monitoring
let isInitialized = false;

interface ErrorDetails {
  message: string;
  stack?: string;
  component?: string;
  context?: Record<string, any>;
}

interface PerformanceMetric {
  name: string;
  duration: number;
  context?: Record<string, any>;
}

interface UserActionEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
  context?: Record<string, any>;
}

/**
 * Initialize monitoring
 */
export function initMonitoring() {
  if (isInitialized) return;
  
  // In production, we would initialize services like Sentry here
  if (process.env.NODE_ENV === 'production') {
    if (typeof window !== 'undefined') {
      // Client-side initialization
      console.log('Monitoring initialized in production (client-side)');
      
      // Example Sentry initialization
      // import * as Sentry from '@sentry/nextjs';
      // Sentry.init({
      //   dsn: process.env.SENTRY_DSN,
      //   tracesSampleRate: 0.1,
      // });
    } else {
      // Server-side initialization
      console.log('Monitoring initialized in production (server-side)');
    }
  } else {
    console.log('Monitoring initialized in development mode (logs only)');
  }
  
  isInitialized = true;
}

/**
 * Log an error
 */
export function logError(details: ErrorDetails) {
  if (!isInitialized) initMonitoring();
  
  console.error('Error logged:', details.message, details);
  
  if (process.env.NODE_ENV === 'production') {
    // In production, send to error monitoring service
    // Example Sentry capture
    // Sentry.captureException(new Error(details.message), {
    //   extra: details.context,
    //   tags: { component: details.component }
    // });
  }
}

/**
 * Log a performance metric
 */
export function logPerformance(metric: PerformanceMetric) {
  if (!isInitialized) initMonitoring();
  
  console.log('Performance metric:', metric.name, metric.duration + 'ms', metric.context);
  
  if (process.env.NODE_ENV === 'production') {
    // In production, send to monitoring service
    // Example custom analytics call
    // analytics.logPerformance({
    //   name: metric.name,
    //   value: metric.duration,
    //   ...metric.context
    // });
  }
}

/**
 * Track user actions
 */
export function trackUserAction(event: UserActionEvent) {
  if (!isInitialized) initMonitoring();
  
  console.log('User action:', event.category, event.action, event.label, event.value);
  
  if (process.env.NODE_ENV === 'production' && typeof window !== 'undefined') {
    // In production, send to analytics
    // Example Google Analytics call
    // if (window.gtag) {
    //   window.gtag('event', event.action, {
    //     event_category: event.category,
    //     event_label: event.label,
    //     value: event.value,
    //     ...event.context
    //   });
    // }
  }
}

/**
 * Create a performance measurement with automatic end timing
 */
export function measurePerformance(name: string, context?: Record<string, any>) {
  const startTime = performance.now();
  
  return {
    end: () => {
      const duration = performance.now() - startTime;
      logPerformance({ name, duration, context });
      return duration;
    }
  };
}

/**
 * Log API request performance
 * Can be used as middleware or directly in API routes
 */
export function logApiPerformance(name: string) {
  return async (req: Request, next: () => Promise<Response>) => {
    const measurement = measurePerformance(`api_${name}`, {
      path: new URL(req.url).pathname,
      method: req.method
    });
    
    try {
      const response = await next();
      measurement.end();
      return response;
    } catch (error) {
      // Log both the error and the performance
      measurement.end();
      throw error;
    }
  };
} 