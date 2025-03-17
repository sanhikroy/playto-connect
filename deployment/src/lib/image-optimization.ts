/**
 * Utility functions for image optimization and handling
 */

/**
 * Default image dimensions
 */
export const DEFAULT_IMAGE_DIMENSIONS = {
  profile: {
    width: 200,
    height: 200
  },
  thumbnail: {
    width: 400,
    height: 225
  },
  banner: {
    width: 1200,
    height: 400
  }
}

/**
 * Valid image types for upload
 */
export const VALID_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif'
]

/**
 * Maximum image size in bytes (5MB)
 */
export const MAX_IMAGE_SIZE = 5 * 1024 * 1024

/**
 * Check if an image file is valid (type and size)
 */
export function isValidImage(file: File): { valid: boolean; message?: string } {
  if (!VALID_IMAGE_TYPES.includes(file.type)) {
    return {
      valid: false,
      message: `Invalid file type. Allowed types: ${VALID_IMAGE_TYPES.map(type => type.split('/')[1]).join(', ')}`
    }
  }

  if (file.size > MAX_IMAGE_SIZE) {
    return {
      valid: false,
      message: `File size exceeds the maximum allowed size of ${MAX_IMAGE_SIZE / (1024 * 1024)}MB`
    }
  }

  return { valid: true }
}

/**
 * Generate a blurhash placeholder or similar for images
 * Note: For a real implementation, consider using a library like plaiceholder or blurhash
 */
export function generatePlaceholder(width: number, height: number): string {
  return `data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${width} ${height}'%3E%3Crect width='100%25' height='100%25' fill='%23333333'/%3E%3C/svg%3E`
}

/**
 * Get secure URL parameters for an image
 * This helps prevent image hotlinking and adds security
 */
export function getSecureImageUrl(url: string): string {
  // Here you would implement your logic for signed URLs or other security measures
  // This is a simplified example
  if (!url) return ''
  
  // If it's an external URL, return as is
  if (url.startsWith('http')) {
    return url
  }
  
  // For local assets, make sure they're served from the correct path
  if (!url.startsWith('/')) {
    url = `/${url}`
  }
  
  return url
} 