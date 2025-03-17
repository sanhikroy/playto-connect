'use client'

import { useState, useEffect } from 'react'

// Breakpoint sizes in pixels
export const breakpoints = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
}

type Breakpoint = keyof typeof breakpoints

/**
 * Custom hook that returns true if the viewport matches the breakpoint
 * @param query Media query string or breakpoint name
 * @returns Boolean indicating if the media query matches
 */
export default function useMediaQuery(query: string | Breakpoint): boolean {
  // Default to true for server-side rendering
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    // Handle breakpoint names
    let mediaQuery = query
    if (typeof query === 'string' && Object.keys(breakpoints).includes(query)) {
      const breakpointValue = breakpoints[query as Breakpoint]
      mediaQuery = `(min-width: ${breakpointValue}px)`
    }

    // Create media query list
    const media = window.matchMedia(mediaQuery as string)
    
    // Set initial state
    setMatches(media.matches)
    
    // Define callback
    const listener = (event: MediaQueryListEvent) => {
      setMatches(event.matches)
    }
    
    // Add listener
    media.addEventListener('change', listener)
    
    // Cleanup
    return () => {
      media.removeEventListener('change', listener)
    }
  }, [query])
  
  return matches
}

/**
 * Custom hook that returns true if the viewport is mobile-sized
 * @returns Boolean indicating if the viewport is mobile-sized
 */
export function useMobileDetection(): boolean {
  const isMobile = !useMediaQuery('md')
  return isMobile
}

/**
 * Custom hook for responsive values based on breakpoints
 * @param responsiveValues Object with breakpoint keys and values
 * @returns The appropriate value for the current viewport
 */
export function useResponsiveValue<T>(responsiveValues: Partial<Record<Breakpoint, T>>) {
  const sm = useMediaQuery('sm')
  const md = useMediaQuery('md')
  const lg = useMediaQuery('lg')
  const xl = useMediaQuery('xl')
  const xxl = useMediaQuery('2xl')
  
  // Find the largest breakpoint that matches
  if (xxl && responsiveValues['2xl'] !== undefined) return responsiveValues['2xl']!
  if (xl && responsiveValues.xl !== undefined) return responsiveValues.xl!
  if (lg && responsiveValues.lg !== undefined) return responsiveValues.lg!
  if (md && responsiveValues.md !== undefined) return responsiveValues.md!
  if (sm && responsiveValues.sm !== undefined) return responsiveValues.sm!
  
  // Default to xs
  return responsiveValues.xs!
} 