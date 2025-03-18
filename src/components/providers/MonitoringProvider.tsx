'use client'

import { ReactNode, useEffect } from 'react'
import { initMonitoring } from '@/lib/monitoring'

interface MonitoringProviderProps {
  children: ReactNode
}

export function MonitoringProvider({ children }: MonitoringProviderProps) {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Initialize monitoring
      initMonitoring()
      
      // Set up error boundary
      const originalOnError = window.onerror
      window.onerror = (message, source, lineno, colno, error) => {
        // Log to our monitoring system
        console.error('Global error captured:', { message, source, lineno, colno, error })
      
        // Allow original handler to run
        if (originalOnError) {
          return originalOnError(message, source, lineno, colno, error)
        }
  
        return false
      }
      
      // Set up unhandled promise rejection handler
      window.addEventListener('unhandledrejection', (event) => {
        // Log to our monitoring system
        console.error('Unhandled promise rejection:', event.reason)
      })
    }
    
    return () => {
      // Clean up any monitoring resources
    }
  }, [])

  return <>{children}</>
} 