'use client'

import { ReactNode, useEffect } from 'react'
import { initMonitoring } from '@/lib/monitoring'

interface MonitoringProviderProps {
  children: ReactNode
}

export function MonitoringProvider({ children }: MonitoringProviderProps) {
  useEffect(() => {
    // Initialize monitoring on mount
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
    const originalOnUnhandledRejection = window.onunhandledrejection
    window.addEventListener('unhandledrejection', (event) => {
      // Log to our monitoring system
      console.error('Unhandled promise rejection:', event.reason)
    })
    
    // Set up performance monitoring
    if ('PerformanceObserver' in window) {
      // Monitor largest contentful paint
      const lcpObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries()
        const lastEntry = entries[entries.length - 1]
        console.log('LCP:', lastEntry.startTime)
      })
      
      try {
        lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true })
      } catch (e) {
        console.warn('LCP observation not supported', e)
      }
      
      // Monitor first input delay
      const fidObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries()
        entries.forEach((entry) => {
          // First Input Delay entry has processingStart property
          const firstInputEntry = entry as any
          if (firstInputEntry.processingStart) {
            console.log('FID:', firstInputEntry.processingStart - firstInputEntry.startTime)
          }
        })
      })
      
      try {
        fidObserver.observe({ type: 'first-input', buffered: true })
      } catch (e) {
        console.warn('FID observation not supported', e)
      }
      
      // Monitor cumulative layout shift
      const clsObserver = new PerformanceObserver((entryList) => {
        let cls = 0
        entryList.getEntries().forEach((entry) => {
          // Layout Shift entry has hadRecentInput and value properties
          const layoutShiftEntry = entry as any
          if (layoutShiftEntry.value && !layoutShiftEntry.hadRecentInput) {
            cls += layoutShiftEntry.value
          }
        })
        console.log('CLS:', cls)
      })
      
      try {
        clsObserver.observe({ type: 'layout-shift', buffered: true })
      } catch (e) {
        console.warn('CLS observation not supported', e)
      }
      
      // Clean up performance observers
      return () => {
        lcpObserver.disconnect()
        fidObserver.disconnect()
        clsObserver.disconnect()
        
        // Restore original handler and remove event listener
        window.onerror = originalOnError
        window.removeEventListener('unhandledrejection', (event) => {
          console.error('Unhandled promise rejection:', event.reason)
        })
      }
    }
    
    return () => {
      // Restore original handlers
      window.onerror = originalOnError
    }
  }, [])
  
  return <>{children}</>
} 