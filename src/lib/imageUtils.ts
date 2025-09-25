/**
 * Utility functions for handling images safely in Next.js
 */

/**
 * Validates if a URL is safe and properly formatted
 */
export function isValidImageUrl(url: string): boolean {
  try {
    const parsedUrl = new URL(url)
    // Allow only http and https protocols
    return parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:'
  } catch {
    return false
  }
}

/**
 * Checks if an image URL is from a local source
 */
export function isLocalImage(src: string): boolean {
  return src.startsWith('/') || src.startsWith('./') || src.startsWith('../')
}

/**
 * Gets a safe image source, falling back to a placeholder if invalid
 */
export function getSafeImageSrc(src: string, fallback: string = '/images/placeholder.svg'): string {
  if (!src) return fallback
  
  // If it's a local image, return as-is
  if (isLocalImage(src)) {
    return src
  }
  
  // If it's a valid external URL, return it
  if (isValidImageUrl(src)) {
    return src
  }
  
  // Otherwise, return fallback
  return fallback
}

/**
 * Common image domains that are typically safe
 */
export const SAFE_IMAGE_DOMAINS = [
  'images.unsplash.com',
  'via.placeholder.com',
  'picsum.photos',
  'raw.githubusercontent.com',
  'github.com',
  'cdn.jsdelivr.net',
  'unpkg.com'
] as const

/**
 * Checks if an image URL is from a commonly trusted domain
 */
export function isFromTrustedDomain(url: string): boolean {
  try {
    const parsedUrl = new URL(url)
    return SAFE_IMAGE_DOMAINS.some(domain => parsedUrl.hostname === domain)
  } catch {
    return false
  }
}