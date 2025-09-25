import Image from 'next/image'
import { useState } from 'react'
import { getSafeImageSrc, isLocalImage, isValidImageUrl } from '@/lib/imageUtils'

interface SafeImageProps {
  src: string
  alt: string
  width: number
  height: number
  className?: string
  fallback?: React.ReactNode
}

export default function SafeImage({ 
  src, 
  alt, 
  width, 
  height, 
  className = '', 
  fallback 
}: SafeImageProps) {
  const [hasError, setHasError] = useState(false)
  
  // Default fallback if none provided
  const defaultFallback = (
    <div className={`${className} bg-gray-100 dark:bg-gray-800 flex items-center justify-center`}>
      <span className="text-gray-400 text-xl">📁</span>
    </div>
  )

  // Get safe image source
  const safeSrc = getSafeImageSrc(src)
  const isLocal = isLocalImage(safeSrc)

  if (hasError || !isValidImageUrl(safeSrc) && !isLocal) {
    return fallback || defaultFallback
  }

  return (
    <Image
      src={safeSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      onError={() => setHasError(true)}
      // Use unoptimized for external images to avoid potential issues
      unoptimized={!isLocal}
      // Add priority for above-the-fold images
      priority={false}
    />
  )
}