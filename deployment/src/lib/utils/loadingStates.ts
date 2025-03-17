import { useState, useCallback } from 'react'

/**
 * Custom hook for managing loading states with optional section specificity
 * This allows for more fine-grained loading indicators in complex forms
 */
export function useLoadingStates(initialSections: string[] = []) {
  // Create a map of section names to loading states
  const [loadingSections, setLoadingSections] = useState<Record<string, boolean>>(
    initialSections.reduce((acc, section) => ({ ...acc, [section]: false }), {})
  )
  
  // Global loading state (true if any section is loading)
  const [isLoading, setIsLoading] = useState(false)
  
  /**
   * Start loading for the entire component or a specific section
   */
  const startLoading = useCallback((section?: string) => {
    if (section) {
      setLoadingSections(prev => ({ ...prev, [section]: true }))
    }
    setIsLoading(true)
  }, [])
  
  /**
   * Stop loading for the entire component or a specific section
   */
  const stopLoading = useCallback((section?: string) => {
    if (section) {
      setLoadingSections(prev => ({ ...prev, [section]: false }))
      
      // Check if any other sections are still loading
      const stillLoading = Object.values({ ...loadingSections, [section]: false }).some(Boolean)
      if (!stillLoading) {
        setIsLoading(false)
      }
    } else {
      // Reset all loading states
      setLoadingSections(initialSections.reduce((acc, s) => ({ ...acc, [s]: false }), {}))
      setIsLoading(false)
    }
  }, [loadingSections, initialSections])
  
  /**
   * Check if a specific section is loading
   */
  const isSectionLoading = useCallback((section: string) => {
    return loadingSections[section] || false
  }, [loadingSections])
  
  return {
    isLoading,
    startLoading,
    stopLoading,
    isSectionLoading,
    loadingSections
  }
}

/**
 * Component for displaying a loading spinner with optional text
 */
export function LoadingSpinner({ size = 'md', text = '' }: { size?: 'sm' | 'md' | 'lg', text?: string }) {
  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  }
  
  return (
    <div className="flex items-center justify-center">
      <svg 
        className={`animate-spin ${sizes[size]} text-white`} 
        xmlns="http://www.w3.org/2000/svg" 
        fill="none" 
        viewBox="0 0 24 24"
      >
        <circle 
          className="opacity-25" 
          cx="12" 
          cy="12" 
          r="10" 
          stroke="currentColor" 
          strokeWidth="4"
        />
        <path 
          className="opacity-75" 
          fill="currentColor" 
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
      {text && <span className="ml-2">{text}</span>}
    </div>
  )
}

/**
 * Higher-order component to add loading state to a button
 */
export function LoadingButton({ 
  isLoading,
  onClick,
  children, 
  disabled = false,
  className = '',
  spinnerSize = 'sm'
}: { 
  isLoading: boolean,
  onClick: () => void,
  children: React.ReactNode,
  disabled?: boolean,
  className?: string,
  spinnerSize?: 'sm' | 'md' | 'lg'
}) {
  return (
    <button
      onClick={onClick}
      disabled={isLoading || disabled}
      className={`flex items-center justify-center ${className}`}
    >
      {isLoading ? (
        <>
          <LoadingSpinner size={spinnerSize} />
          <span className="ml-2">Loading...</span>
        </>
      ) : children}
    </button>
  )
} 