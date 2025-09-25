import { forwardRef } from 'react'

export interface ToggleProps {
  checked?: boolean
  onChange?: (checked: boolean) => void
  disabled?: boolean
  label?: string
  description?: string
  name?: string
  size?: 'sm' | 'md' | 'lg'
  color?: 'indigo' | 'green' | 'red' | 'blue' | 'purple'
  showIcons?: boolean
  className?: string
}

const sizeClasses = {
  sm: {
    toggle: 'w-8 h-4.5 p-0.5',
    thumb: 'size-3.5 group-has-[:checked]:translate-x-3.5',
    icon: 'size-2'
  },
  md: {
    toggle: 'w-11 h-6 p-0.5',
    thumb: 'size-5 group-has-[:checked]:translate-x-5',
    icon: 'size-3'
  },
  lg: {
    toggle: 'w-14 h-7 p-0.5',
    thumb: 'size-6 group-has-[:checked]:translate-x-7',
    icon: 'size-4'
  }
}

const colorClasses = {
  indigo: 'has-[:checked]:bg-indigo-500 outline-indigo-500',
  green: 'has-[:checked]:bg-green-500 outline-green-500',
  red: 'has-[:checked]:bg-red-500 outline-red-500',
  blue: 'has-[:checked]:bg-blue-500 outline-blue-500',
  purple: 'has-[:checked]:bg-purple-500 outline-purple-500'
}

const iconColorClasses = {
  indigo: 'text-indigo-500',
  green: 'text-green-500',
  red: 'text-red-500',
  blue: 'text-blue-500',
  purple: 'text-purple-500'
}

const Toggle = forwardRef<HTMLInputElement, ToggleProps>(({
  checked = false,
  onChange,
  disabled = false,
  label,
  description,
  name,
  size = 'md',
  color = 'indigo',
  showIcons = true,
  className = ''
}, ref) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e.target.checked)
  }

  const toggleId = `toggle-${Math.random().toString(36).substr(2, 9)}`

  const toggleElement = (
    <div className={`group relative inline-flex shrink-0 rounded-full bg-white/10 dark:bg-white/5 outline-offset-2 ring-1 ring-inset ring-white/20 dark:ring-white/10 transition-colors duration-200 ease-in-out ${colorClasses[color]} ${sizeClasses[size].toggle} ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} has-[:focus-visible]:outline has-[:focus-visible]:outline-2`}>
      <span className={`relative rounded-full bg-white shadow-sm ring-1 ring-gray-900/5 dark:ring-gray-100/10 transition-transform duration-200 ease-in-out ${sizeClasses[size].thumb}`}>
        {showIcons && (
          <>
            {/* X icon (unchecked) */}
            <span
              aria-hidden="true"
              className="absolute inset-0 flex size-full items-center justify-center opacity-100 transition-opacity duration-200 ease-in group-has-[:checked]:opacity-0 group-has-[:checked]:duration-100 group-has-[:checked]:ease-out"
            >
              <svg fill="none" viewBox="0 0 12 12" className={`${sizeClasses[size].icon} text-gray-600 dark:text-gray-400`}>
                <path
                  d="M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>

            {/* Check icon (checked) */}
            <span
              aria-hidden="true"
              className="absolute inset-0 flex size-full items-center justify-center opacity-0 transition-opacity duration-100 ease-out group-has-[:checked]:opacity-100 group-has-[:checked]:duration-200 group-has-[:checked]:ease-in"
            >
              <svg fill="currentColor" viewBox="0 0 12 12" className={`${sizeClasses[size].icon} ${iconColorClasses[color]}`}>
                <path d="M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z" />
              </svg>
            </span>
          </>
        )}
      </span>

      <input
        ref={ref}
        id={toggleId}
        name={name}
        type="checkbox"
        checked={checked}
        onChange={handleChange}
        disabled={disabled}
        aria-describedby={description ? `${toggleId}-description` : undefined}
        className="absolute inset-0 appearance-none focus:outline-none"
      />
    </div>
  )

  if (label || description) {
    return (
      <div className={`flex items-start gap-3 ${className}`}>
        {toggleElement}
        <div className="flex-1">
          {label && (
            <label
              htmlFor={toggleId}
              className={`block text-sm font-medium text-gray-900 dark:text-white ${disabled ? 'opacity-50' : 'cursor-pointer'}`}
            >
              {label}
            </label>
          )}
          {description && (
            <p
              id={`${toggleId}-description`}
              className={`mt-1 text-sm text-gray-500 dark:text-gray-400 ${disabled ? 'opacity-50' : ''}`}
            >
              {description}
            </p>
          )}
        </div>
      </div>
    )
  }

  return <div className={className}>{toggleElement}</div>
})

Toggle.displayName = 'Toggle'

export default Toggle