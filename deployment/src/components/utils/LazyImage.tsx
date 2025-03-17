'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { generatePlaceholder } from '@/lib/image-optimization'

interface LazyImageProps {
  src: string
  alt: string
  width: number
  height: number
  className?: string
  priority?: boolean
  objectFit?: 'cover' | 'contain' | 'fill' | 'none'
}

export default function LazyImage({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  objectFit = 'cover'
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [placeholder, setPlaceholder] = useState<string>('')

  // Generate a simple placeholder
  useEffect(() => {
    setPlaceholder(generatePlaceholder(width, height))
  }, [width, height])

  // Set up intersection observer for lazy loading
  useEffect(() => {
    if (priority) {
      setIsVisible(true)
      return
    }

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setIsVisible(true)
        observer.disconnect()
      }
    }, {
      rootMargin: '100px' // Start loading when image is 100px from viewport
    })

    const currentRef = document.getElementById(`lazy-image-${src.replace(/[^a-zA-Z0-9]/g, '-')}`)
    if (currentRef) {
      observer.observe(currentRef)
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef)
      }
    }
  }, [src, priority])

  // Object fit mapping to className
  const objectFitClass = {
    cover: 'object-cover',
    contain: 'object-contain',
    fill: 'object-fill',
    none: 'object-none'
  }[objectFit]

  return (
    <div 
      id={`lazy-image-${src.replace(/[^a-zA-Z0-9]/g, '-')}`}
      className={`relative overflow-hidden ${className}`}
      style={{ width, height }}
    >
      {(!isVisible || !isLoaded) && (
        <div 
          className="absolute inset-0 bg-gray-800 animate-pulse"
          style={{ backgroundImage: `url(${placeholder})` }}
        />
      )}
      
      {isVisible && (
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          quality={80}
          className={`transition-opacity duration-300 ${objectFitClass} ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setIsLoaded(true)}
          priority={priority}
        />
      )}
    </div>
  )
} 