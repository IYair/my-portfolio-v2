import { ReactNode } from 'react'

export interface BadgeProps {
  children: ReactNode
  variant?: 'gray' | 'red' | 'yellow' | 'green' | 'blue' | 'indigo' | 'purple' | 'pink'
  size?: 'sm' | 'md' | 'lg'
  removable?: boolean
  onRemove?: () => void
  icon?: ReactNode
  className?: string
  href?: string
  onClick?: () => void
}

const variantClasses = {
  gray: 'bg-gray-400/10 text-gray-400 hover:bg-gray-400/20',
  red: 'bg-red-400/10 text-red-400 hover:bg-red-400/20',
  yellow: 'bg-yellow-400/10 text-yellow-500 hover:bg-yellow-400/20',
  green: 'bg-green-400/10 text-green-400 hover:bg-green-400/20',
  blue: 'bg-blue-400/10 text-blue-400 hover:bg-blue-400/20',
  indigo: 'bg-indigo-400/10 text-indigo-400 hover:bg-indigo-400/20',
  purple: 'bg-purple-400/10 text-purple-400 hover:bg-purple-400/20',
  pink: 'bg-pink-400/10 text-pink-400 hover:bg-pink-400/20'
}

const removeButtonClasses = {
  gray: 'hover:bg-gray-400/20 stroke-gray-400 hover:stroke-gray-300',
  red: 'hover:bg-red-400/20 stroke-red-400 hover:stroke-red-300',
  yellow: 'hover:bg-yellow-400/20 stroke-yellow-400 hover:stroke-yellow-300',
  green: 'hover:bg-green-400/20 stroke-green-400 hover:stroke-green-300',
  blue: 'hover:bg-blue-400/20 stroke-blue-400 hover:stroke-blue-300',
  indigo: 'hover:bg-indigo-400/20 stroke-indigo-400 hover:stroke-indigo-300',
  purple: 'hover:bg-purple-400/20 stroke-purple-400 hover:stroke-purple-300',
  pink: 'hover:bg-pink-400/20 stroke-pink-400 hover:stroke-pink-300'
}

const sizeClasses = {
  sm: 'px-1.5 py-0.5 text-xs',
  md: 'px-2 py-1 text-xs',
  lg: 'px-2.5 py-1.5 text-sm'
}

export default function Badge({
  children,
  variant = 'gray',
  size = 'md',
  removable = false,
  onRemove,
  icon,
  className = '',
  href,
  onClick
}: BadgeProps) {
  const baseClasses = `inline-flex items-center gap-x-0.5 rounded-md font-medium transition-colors ${sizeClasses[size]} ${variantClasses[variant]}`

  const content = (
    <>
      {icon && (
        <span className="size-3">
          {icon}
        </span>
      )}
      <span>{children}</span>
      {removable && onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onRemove()
          }}
          className={`group relative -mr-1 size-3.5 rounded-sm transition-colors ${removeButtonClasses[variant]}`}
        >
          <span className="sr-only">Remove</span>
          <svg viewBox="0 0 14 14" className="size-3.5">
            <path d="M4 4l6 6m0-6l-6 6" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <span className="absolute -inset-1" />
        </button>
      )}
    </>
  )

  if (href) {
    return (
      <a
        href={href}
        className={`${baseClasses} hover:opacity-80 cursor-pointer ${className}`}
      >
        {content}
      </a>
    )
  }

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`${baseClasses} hover:opacity-80 cursor-pointer ${className}`}
      >
        {content}
      </button>
    )
  }

  return (
    <span className={`${baseClasses} ${className}`}>
      {content}
    </span>
  )
}

// Helper component for rendering multiple badges
export function BadgeGroup({
  children,
  className = ''
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div className={`flex flex-wrap gap-1 ${className}`}>
      {children}
    </div>
  )
}