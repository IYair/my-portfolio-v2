import React from 'react'
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XCircleIcon,
  XMarkIcon
} from '@heroicons/react/20/solid'
import { cn } from '@/lib/utils'

export type AlertVariant = 'success' | 'warning' | 'error' | 'info'
export type AlertStyle = 'default' | 'left-accent'

interface AlertAction {
  label: string
  onClick: () => void
  variant?: 'primary' | 'secondary'
}

interface AlertProps {
  variant: AlertVariant
  style?: AlertStyle
  title?: string
  description?: string | React.ReactNode
  actions?: AlertAction[]
  dismissible?: boolean
  onDismiss?: () => void
  className?: string
  children?: React.ReactNode
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>
}

const variantStyles = {
  success: {
    default: 'bg-green-500/10 outline-green-500/20 text-green-200',
    leftAccent: 'border-l-4 border-green-500 bg-green-500/10',
    icon: 'text-green-400',
    title: 'text-green-200',
    description: 'text-green-200/85',
    button: 'text-green-200 hover:bg-white/10 focus-visible:outline-green-500/50'
  },
  warning: {
    default: 'bg-yellow-500/10 outline-yellow-500/15 text-yellow-100',
    leftAccent: 'border-l-4 border-yellow-500 bg-yellow-500/10',
    icon: 'text-yellow-300',
    title: 'text-yellow-100',
    description: 'text-yellow-100/80',
    button: 'text-yellow-300 hover:bg-white/10 focus-visible:outline-yellow-500/50'
  },
  error: {
    default: 'bg-red-500/10 outline-red-500/20 text-red-200',
    leftAccent: 'border-l-4 border-red-500 bg-red-500/10',
    icon: 'text-red-400',
    title: 'text-red-200',
    description: 'text-red-200/85',
    button: 'text-red-200 hover:bg-white/10 focus-visible:outline-red-500/50'
  },
  info: {
    default: 'bg-blue-500/10 outline-blue-500/20 text-blue-300',
    leftAccent: 'border-l-4 border-blue-500 bg-blue-500/10',
    icon: 'text-blue-400',
    title: 'text-blue-300',
    description: 'text-blue-300/85',
    button: 'text-blue-300 hover:bg-white/10 focus-visible:outline-blue-500/50'
  }
}

const defaultIcons = {
  success: CheckCircleIcon,
  warning: ExclamationTriangleIcon,
  error: XCircleIcon,
  info: InformationCircleIcon
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({
    variant,
    style = 'default',
    title,
    description,
    actions,
    dismissible = false,
    onDismiss,
    className,
    children,
    icon: CustomIcon,
    ...props
  }, ref) => {
    const styles = variantStyles[variant]
    const Icon = CustomIcon || defaultIcons[variant]

    const containerClasses = cn(
      'rounded-md p-4',
      style === 'default' ? `${styles.default} outline outline-1` : styles.leftAccent,
      className
    )

    return (
      <div ref={ref} className={containerClasses} {...props}>
        <div className="flex">
          <div className="shrink-0">
            <Icon aria-hidden="true" className={cn("size-5", styles.icon)} />
          </div>

          <div className="ml-3 flex-1">
            {title && (
              <h3 className={cn("text-sm font-medium", styles.title)}>
                {title}
              </h3>
            )}

            {description && (
              <div className={cn("text-sm", title ? "mt-2" : "", styles.description)}>
                {typeof description === 'string' ? <p>{description}</p> : description}
              </div>
            )}

            {children && (
              <div className={cn("text-sm", (title || description) ? "mt-2" : "", styles.description)}>
                {children}
              </div>
            )}

            {actions && actions.length > 0 && (
              <div className="mt-4">
                <div className="-mx-2 -my-1.5 flex">
                  {actions.map((action, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={action.onClick}
                      className={cn(
                        "rounded-md px-2 py-1.5 text-sm font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1",
                        index > 0 ? "ml-3" : "",
                        styles.button
                      )}
                    >
                      {action.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {dismissible && (
            <div className="ml-auto pl-3">
              <div className="-mx-1.5 -my-1.5">
                <button
                  type="button"
                  onClick={onDismiss}
                  className={cn(
                    "inline-flex rounded-md p-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1",
                    styles.icon,
                    `hover:bg-${variant === 'warning' ? 'yellow' : variant === 'error' ? 'red' : variant === 'info' ? 'blue' : 'green'}-500/10`,
                    `focus-visible:ring-${variant === 'warning' ? 'yellow' : variant === 'error' ? 'red' : variant === 'info' ? 'blue' : 'green'}-500`,
                    `focus-visible:ring-offset-${variant === 'warning' ? 'yellow' : variant === 'error' ? 'red' : variant === 'info' ? 'blue' : 'green'}-900`
                  )}
                >
                  <span className="sr-only">Dismiss</span>
                  <XMarkIcon aria-hidden="true" className="size-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }
)
Alert.displayName = "Alert"

export { Alert }