import React from 'react'
import { cn } from '@/lib/utils'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

interface LoadingDotsProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

interface LoadingPulseProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

interface LoadingOverlayProps {
  children?: React.ReactNode
  loading: boolean
  spinnerSize?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  overlayClassName?: string
}

const sizeClasses = {
  spinner: {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  },
  dots: {
    sm: 'w-1 h-1',
    md: 'w-1.5 h-1.5',
    lg: 'w-2 h-2'
  },
  pulse: {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  }
}

// Spinner circular
export const LoadingSpinner = React.forwardRef<HTMLDivElement, LoadingSpinnerProps>(
  ({ size = 'md', className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'inline-block animate-spin rounded-full border-2 border-gray-600 border-t-indigo-500',
          sizeClasses.spinner[size],
          className
        )}
        {...props}
      />
    )
  }
)
LoadingSpinner.displayName = "LoadingSpinner"

// Dots animados
export const LoadingDots = React.forwardRef<HTMLDivElement, LoadingDotsProps>(
  ({ size = 'md', className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('inline-flex items-center space-x-1', className)}
        {...props}
      >
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={cn(
              'bg-indigo-500 rounded-full animate-pulse',
              sizeClasses.dots[size]
            )}
            style={{
              animationDelay: `${i * 0.15}s`,
              animationDuration: '0.8s'
            }}
          />
        ))}
      </div>
    )
  }
)
LoadingDots.displayName = "LoadingDots"

// Pulse circular
export const LoadingPulse = React.forwardRef<HTMLDivElement, LoadingPulseProps>(
  ({ size = 'md', className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center',
          sizeClasses.pulse[size],
          className
        )}
        {...props}
      >
        <div className="relative w-full h-full">
          <div className="absolute inset-0 rounded-full bg-indigo-500/20 animate-ping" />
          <div className="absolute inset-0 rounded-full bg-indigo-500/40 animate-pulse" />
          <div className="absolute inset-2 rounded-full bg-indigo-500" />
        </div>
      </div>
    )
  }
)
LoadingPulse.displayName = "LoadingPulse"

// Overlay con loading
export const LoadingOverlay = React.forwardRef<HTMLDivElement, LoadingOverlayProps>(
  ({ children, loading, spinnerSize = 'lg', className, overlayClassName, ...props }, ref) => {
    return (
      <div ref={ref} className={cn('relative', className)} {...props}>
        {children}
        {loading && (
          <div
            className={cn(
              'absolute inset-0 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm rounded-lg z-50',
              overlayClassName
            )}
          >
            <div className="flex flex-col items-center space-y-3">
              <LoadingSpinner size={spinnerSize} />
              <p className="text-sm text-gray-300">Loading...</p>
            </div>
          </div>
        )}
      </div>
    )
  }
)
LoadingOverlay.displayName = "LoadingOverlay"