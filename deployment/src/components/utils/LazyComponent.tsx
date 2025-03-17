'use client'

import { ReactNode, useEffect, useState } from 'react'

interface LazyComponentProps {
  children: ReactNode
  placeholder?: ReactNode
  threshold?: number // Between 0 and 1
  rootMargin?: string // CSS-style margin
  className?: string
}

export default function LazyComponent({
  children,
  placeholder,
  threshold = 0.1,
  rootMargin = '100px',
  className = ''
}: LazyComponentProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [ref, setRef] = useState<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!ref) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      {
        threshold,
        rootMargin
      }
    )

    observer.observe(ref)

    return () => {
      if (ref) {
        observer.unobserve(ref)
      }
    }
  }, [ref, threshold, rootMargin])

  return (
    <div ref={setRef} className={className}>
      {isVisible ? children : placeholder || <div className="animate-pulse bg-white/5 rounded-md h-40"></div>}
    </div>
  )
} 