import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import { ReactNode } from 'react'
import Button from './Button'

export interface ModalProps {
  open: boolean
  onClose: () => void
  title: string
  description?: string
  icon?: ReactNode
  iconColor?: 'green' | 'red' | 'blue' | 'yellow' | 'gray'
  children?: ReactNode
  primaryAction?: {
    label: string
    onClick: () => void
    variant?: 'primary' | 'danger'
    loading?: boolean
  }
  secondaryAction?: {
    label: string
    onClick: () => void
  }
  size?: 'sm' | 'md' | 'lg' | 'xl'
  hideActions?: boolean
}

const iconColorClasses = {
  green: 'bg-green-500/10 text-green-400',
  red: 'bg-red-500/10 text-red-400',
  blue: 'bg-blue-500/10 text-blue-400',
  yellow: 'bg-yellow-500/10 text-yellow-400',
  gray: 'bg-gray-500/10 text-gray-400'
}

const sizeClasses = {
  sm: 'sm:max-w-sm',
  md: 'sm:max-w-lg',
  lg: 'sm:max-w-2xl',
  xl: 'sm:max-w-4xl'
}

export default function Modal({
  open,
  onClose,
  title,
  description,
  icon,
  iconColor = 'blue',
  children,
  primaryAction,
  secondaryAction,
  size = 'md',
  hideActions = false
}: ModalProps) {
  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-900/50 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
      />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel
            transition
            className={`relative transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 px-4 pb-4 pt-5 text-left shadow-xl outline outline-1 -outline-offset-1 outline-gray-200 dark:outline-white/10 transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full ${sizeClasses[size]} sm:p-6 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95`}
          >
            {/* Header with icon and title */}
            <div>
              {icon && (
                <div className={`mx-auto flex size-12 items-center justify-center rounded-full ${iconColorClasses[iconColor]}`}>
                  <div className="size-6">
                    {icon}
                  </div>
                </div>
              )}
              <div className={`${icon ? 'mt-3' : ''} text-center sm:mt-5`}>
                <DialogTitle as="h3" className="text-base font-semibold text-gray-900 dark:text-white">
                  {title}
                </DialogTitle>
                {description && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {description}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Custom content */}
            {children && (
              <div className="mt-4">
                {children}
              </div>
            )}

            {/* Actions */}
            {!hideActions && (primaryAction || secondaryAction) && (
              <div className={`${children || description ? 'mt-5' : 'mt-3'} sm:mt-6 ${
                primaryAction && secondaryAction
                  ? 'sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3'
                  : 'flex justify-center sm:justify-end'
              }`}>
                {primaryAction && (
                  <Button
                    variant={primaryAction.variant || 'primary'}
                    loading={primaryAction.loading}
                    onClick={primaryAction.onClick}
                    className={`w-full ${primaryAction && secondaryAction ? 'sm:col-start-2' : ''}`}
                  >
                    {primaryAction.label}
                  </Button>
                )}
                {secondaryAction && (
                  <Button
                    variant="ghost"
                    onClick={secondaryAction.onClick}
                    className={`${primaryAction ? 'mt-3' : ''} w-full ring-1 ring-inset ring-gray-300 dark:ring-white/10 hover:bg-gray-50 dark:hover:bg-white/5 ${primaryAction && secondaryAction ? 'sm:col-start-1 sm:mt-0' : ''}`}
                  >
                    {secondaryAction.label}
                  </Button>
                )}
              </div>
            )}
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  )
}