'use client'

import { ReactNode } from 'react'
import { useMobileDetection } from '@/components/hooks/useMediaQuery'

interface ResponsiveContainerProps {
  children: ReactNode
  className?: string
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'
  padding?: 'none' | 'sm' | 'md' | 'lg'
  centerContent?: boolean
}

export default function ResponsiveContainer({
  children,
  className = '',
  maxWidth = 'lg',
  padding = 'md',
  centerContent = false,
}: ResponsiveContainerProps) {
  const isMobile = useMobileDetection()
  
  // Maximum width classes
  const maxWidthClasses = {
    xs: 'max-w-xs',
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-5xl',
    xl: 'max-w-7xl',
    '2xl': 'max-w-[96rem]',
    full: 'max-w-full',
  }
  
  // Padding classes
  const paddingClasses = {
    none: '',
    sm: isMobile ? 'px-3' : 'px-4',
    md: isMobile ? 'px-4 py-4' : 'px-6 py-6',
    lg: isMobile ? 'px-5 py-6' : 'px-8 py-10',
  }
  
  // Combined classes
  const containerClasses = [
    'w-full',
    maxWidthClasses[maxWidth],
    paddingClasses[padding],
    centerContent ? 'mx-auto' : '',
    className,
  ].filter(Boolean).join(' ')
  
  return (
    <div className={containerClasses}>
      {children}
    </div>
  )
} 