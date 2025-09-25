import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import { ReactNode } from 'react'

export interface DropdownOption {
  label: string
  value: string | number
  icon?: ReactNode
  disabled?: boolean
  danger?: boolean
  onClick?: () => void
  href?: string
}

export interface DropdownGroup {
  options: DropdownOption[]
}

export interface DropdownProps {
  label: string
  options?: DropdownOption[]
  groups?: DropdownGroup[]
  onSelect?: (value: string | number) => void
  variant?: 'default' | 'ghost' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  icon?: ReactNode
  disabled?: boolean
  className?: string
}

const variantClasses = {
  default: 'bg-white dark:bg-white/10 text-gray-900 dark:text-white ring-1 ring-inset ring-gray-300 dark:ring-white/5 hover:bg-gray-50 dark:hover:bg-white/20',
  ghost: 'bg-transparent text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10',
  outline: 'bg-transparent text-gray-900 dark:text-white ring-1 ring-inset ring-gray-300 dark:ring-white/20 hover:bg-gray-50 dark:hover:bg-white/5'
}

const sizeClasses = {
  sm: 'px-2.5 py-1.5 text-sm',
  md: 'px-3 py-2 text-sm',
  lg: 'px-4 py-2.5 text-base'
}

export default function Dropdown({
  label,
  options = [],
  groups = [],
  onSelect,
  variant = 'default',
  size = 'md',
  icon,
  disabled = false,
  className = ''
}: DropdownProps) {
  const handleOptionClick = (option: DropdownOption) => {
    if (option.disabled) return

    if (option.onClick) {
      option.onClick()
    } else if (onSelect) {
      onSelect(option.value)
    }
  }

  // Use either flat options or grouped options
  const menuGroups = groups.length > 0 ? groups : [{ options }]

  return (
    <Menu as="div" className={`relative inline-block ${className}`}>
      <MenuButton
        disabled={disabled}
        className={`inline-flex w-full justify-center items-center gap-x-1.5 rounded-md font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed ${variantClasses[variant]} ${sizeClasses[size]}`}
      >
        {icon && (
          <span className="mr-1">
            {icon}
          </span>
        )}
        {label}
        <ChevronDownIcon aria-hidden="true" className="-mr-1 size-5 text-gray-500 dark:text-gray-400" />
      </MenuButton>

      <MenuItems
        transition
        className="absolute right-0 z-10 mt-2 w-56 origin-top-right divide-y divide-gray-100 dark:divide-white/10 rounded-md bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black/5 dark:ring-white/10 transition data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
      >
        {menuGroups.map((group, groupIndex) => (
          <div key={groupIndex} className="py-1">
            {group.options.map((option) => (
              <MenuItem key={option.value} disabled={option.disabled}>
                {option.href ? (
                  <a
                    href={option.href}
                    className={`group flex items-center px-4 py-2 text-sm transition-colors data-[focus]:outline-none ${
                      option.danger
                        ? 'text-red-700 dark:text-red-400 data-[focus]:bg-red-50 dark:data-[focus]:bg-red-500/10 data-[focus]:text-red-900 dark:data-[focus]:text-red-300'
                        : option.disabled
                        ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
                        : 'text-gray-700 dark:text-gray-300 data-[focus]:bg-gray-100 dark:data-[focus]:bg-white/5 data-[focus]:text-gray-900 dark:data-[focus]:text-white'
                    }`}
                  >
                    {option.icon && (
                      <span className={`mr-3 size-5 transition-colors ${
                        option.danger
                          ? 'text-red-500 dark:text-red-400 group-data-[focus]:text-red-700 dark:group-data-[focus]:text-red-300'
                          : option.disabled
                          ? 'text-gray-400 dark:text-gray-600'
                          : 'text-gray-500 dark:text-gray-400 group-data-[focus]:text-gray-700 dark:group-data-[focus]:text-gray-300'
                      }`}>
                        {option.icon}
                      </span>
                    )}
                    {option.label}
                  </a>
                ) : (
                  <button
                    onClick={() => handleOptionClick(option)}
                    disabled={option.disabled}
                    className={`group flex w-full items-center px-4 py-2 text-sm text-left transition-colors data-[focus]:outline-none ${
                      option.danger
                        ? 'text-red-700 dark:text-red-400 data-[focus]:bg-red-50 dark:data-[focus]:bg-red-500/10 data-[focus]:text-red-900 dark:data-[focus]:text-red-300'
                        : option.disabled
                        ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
                        : 'text-gray-700 dark:text-gray-300 data-[focus]:bg-gray-100 dark:data-[focus]:bg-white/5 data-[focus]:text-gray-900 dark:data-[focus]:text-white'
                    }`}
                  >
                    {option.icon && (
                      <span className={`mr-3 size-5 transition-colors ${
                        option.danger
                          ? 'text-red-500 dark:text-red-400 group-data-[focus]:text-red-700 dark:group-data-[focus]:text-red-300'
                          : option.disabled
                          ? 'text-gray-400 dark:text-gray-600'
                          : 'text-gray-500 dark:text-gray-400 group-data-[focus]:text-gray-700 dark:group-data-[focus]:text-gray-300'
                      }`}>
                        {option.icon}
                      </span>
                    )}
                    {option.label}
                  </button>
                )}
              </MenuItem>
            ))}
          </div>
        ))}
      </MenuItems>
    </Menu>
  )
}