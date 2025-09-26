import React, { useState, useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'

export type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right'

interface TooltipProps {
  children: React.ReactNode
  content: React.ReactNode
  placement?: TooltipPlacement
  disabled?: boolean
  delay?: number
  className?: string
  contentClassName?: string
}

const placementClasses = {
  top: {
    tooltip: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    arrow: 'top-full left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-b-transparent border-t-gray-800'
  },
  bottom: {
    tooltip: 'top-full left-1/2 -translate-x-1/2 mt-2',
    arrow: 'bottom-full left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-t-transparent border-b-gray-800'
  },
  left: {
    tooltip: 'right-full top-1/2 -translate-y-1/2 mr-2',
    arrow: 'left-full top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-r-transparent border-l-gray-800'
  },
  right: {
    tooltip: 'left-full top-1/2 -translate-y-1/2 ml-2',
    arrow: 'right-full top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-l-transparent border-r-gray-800'
  }
}

const Tooltip = React.forwardRef<HTMLDivElement, TooltipProps>(
  ({
    children,
    content,
    placement = 'top',
    disabled = false,
    delay = 200,
    className,
    contentClassName,
    ...props
  }, ref) => {
    const [isVisible, setIsVisible] = useState(false)
    const [shouldShow, setShouldShow] = useState(false)
    const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined)
    const hideTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined)

    const showTooltip = () => {
      if (disabled) return

      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current)
        hideTimeoutRef.current = undefined
      }

      timeoutRef.current = setTimeout(() => {
        setShouldShow(true)
        // Small delay for animation
        setTimeout(() => setIsVisible(true), 10)
      }, delay)
    }

    const hideTooltip = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = undefined
      }

      setIsVisible(false)
      hideTimeoutRef.current = setTimeout(() => {
        setShouldShow(false)
      }, 150) // Match transition duration
    }

    useEffect(() => {
      return () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current)
        if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current)
      }
    }, [])

    const classes = placementClasses[placement]

    return (
      <div
        ref={ref}
        className={cn("relative inline-block", className)}
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        onFocus={showTooltip}
        onBlur={hideTooltip}
        {...props}
      >
        {children}

        {shouldShow && (
          <div
            role="tooltip"
            className={cn(
              "absolute z-50 px-3 py-2 text-sm text-white bg-gray-800 rounded-md shadow-lg outline outline-1 -outline-offset-1 outline-white/10 whitespace-nowrap transition-opacity duration-150",
              isVisible ? "opacity-100" : "opacity-0",
              classes.tooltip,
              contentClassName
            )}
          >
            {content}

            {/* Arrow */}
            <div
              className={cn(
                "absolute w-0 h-0 border-4",
                classes.arrow
              )}
            />
          </div>
        )}
      </div>
    )
  }
)
Tooltip.displayName = "Tooltip"

export { Tooltip }