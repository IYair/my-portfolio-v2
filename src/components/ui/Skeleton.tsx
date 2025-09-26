import React from 'react'
import { cn } from '@/lib/utils'

interface SkeletonProps {
  className?: string
  width?: string | number
  height?: string | number
  rounded?: boolean | 'sm' | 'md' | 'lg' | 'full'
}

interface SkeletonTextProps {
  lines?: number
  className?: string
}

interface SkeletonCardProps {
  className?: string
  showImage?: boolean
  imageHeight?: string
  showAvatar?: boolean
  lines?: number
}

interface SkeletonTableProps {
  rows?: number
  columns?: number
  className?: string
}

interface SkeletonListProps {
  items?: number
  showAvatar?: boolean
  className?: string
}

const roundedClasses = {
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  full: 'rounded-full'
}

// Skeleton base
export const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, width, height, rounded = 'md', ...props }, ref) => {
    const style: React.CSSProperties = {}
    if (width) style.width = typeof width === 'number' ? `${width}px` : width
    if (height) style.height = typeof height === 'number' ? `${height}px` : height

    return (
      <div
        ref={ref}
        className={cn(
          'bg-gray-700/50 animate-pulse',
          rounded === true ? 'rounded-md' : rounded ? roundedClasses[rounded] : '',
          className
        )}
        style={style}
        {...props}
      />
    )
  }
)
Skeleton.displayName = "Skeleton"

// Skeleton para texto (múltiples líneas)
export const SkeletonText = React.forwardRef<HTMLDivElement, SkeletonTextProps>(
  ({ lines = 3, className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn('space-y-2', className)} {...props}>
        {Array.from({ length: lines }).map((_, i) => (
          <Skeleton
            key={i}
            height={16}
            width={i === lines - 1 ? '75%' : '100%'} // Última línea más corta
            className="h-4"
          />
        ))}
      </div>
    )
  }
)
SkeletonText.displayName = "SkeletonText"

// Skeleton para tarjetas
export const SkeletonCard = React.forwardRef<HTMLDivElement, SkeletonCardProps>(
  ({ className, showImage = true, imageHeight = '200px', showAvatar = false, lines = 3, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'bg-gray-800/50 rounded-lg p-4 outline outline-1 -outline-offset-1 outline-white/10',
          className
        )}
        {...props}
      >
        {/* Image skeleton */}
        {showImage && (
          <Skeleton height={imageHeight} className="mb-4" />
        )}

        <div className="space-y-3">
          {/* Avatar + title */}
          {showAvatar && (
            <div className="flex items-center space-x-3">
              <Skeleton width={40} height={40} rounded="full" />
              <div className="space-y-2">
                <Skeleton height={16} width={120} />
                <Skeleton height={14} width={80} />
              </div>
            </div>
          )}

          {/* Title */}
          {!showAvatar && (
            <Skeleton height={24} width="60%" />
          )}

          {/* Text lines */}
          <SkeletonText lines={lines} />

          {/* Action buttons */}
          <div className="flex space-x-2 pt-2">
            <Skeleton height={32} width={80} />
            <Skeleton height={32} width={60} />
          </div>
        </div>
      </div>
    )
  }
)
SkeletonCard.displayName = "SkeletonCard"

// Skeleton para tablas
export const SkeletonTable = React.forwardRef<HTMLDivElement, SkeletonTableProps>(
  ({ rows = 5, columns = 4, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('bg-gray-800/50 rounded-lg overflow-hidden outline outline-1 -outline-offset-1 outline-white/10', className)}
        {...props}
      >
        {/* Header */}
        <div className="p-4 border-b border-white/10">
          <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
            {Array.from({ length: columns }).map((_, i) => (
              <Skeleton key={i} height={16} width="80%" />
            ))}
          </div>
        </div>

        {/* Rows */}
        <div className="divide-y divide-white/10">
          {Array.from({ length: rows }).map((_, i) => (
            <div key={i} className="p-4">
              <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
                {Array.from({ length: columns }).map((_, j) => (
                  <Skeleton key={j} height={14} width={j === 0 ? '90%' : '70%'} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }
)
SkeletonTable.displayName = "SkeletonTable"

// Skeleton para listas
export const SkeletonList = React.forwardRef<HTMLDivElement, SkeletonListProps>(
  ({ items = 5, showAvatar = true, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('space-y-3', className)}
        {...props}
      >
        {Array.from({ length: items }).map((_, i) => (
          <div
            key={i}
            className="flex items-center space-x-3 p-3 bg-gray-800/50 rounded-lg outline outline-1 -outline-offset-1 outline-white/10"
          >
            {showAvatar && (
              <Skeleton width={40} height={40} rounded="full" />
            )}
            <div className="flex-1 space-y-2">
              <Skeleton height={16} width="40%" />
              <Skeleton height={14} width="70%" />
            </div>
            <Skeleton width={60} height={24} />
          </div>
        ))}
      </div>
    )
  }
)
SkeletonList.displayName = "SkeletonList"