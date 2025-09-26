import React from 'react'
import { CheckIcon } from '@heroicons/react/20/solid'
import { cn } from '@/lib/utils'

export type StepStatus = 'complete' | 'current' | 'upcoming'

export interface Step {
  name: string
  description?: string
  href?: string
  status: StepStatus
  onClick?: () => void
}

interface ProgressStepperProps {
  steps: Step[]
  onStepClick?: (step: Step, index: number) => void
  className?: string
}

const ProgressStepper = React.forwardRef<HTMLElement, ProgressStepperProps>(
  ({ steps, onStepClick, className, ...props }, ref) => {
    const handleStepClick = (step: Step, index: number, e: React.MouseEvent) => {
      if (step.onClick) {
        e.preventDefault()
        step.onClick()
      }
      if (onStepClick) {
        e.preventDefault()
        onStepClick(step, index)
      }
    }

    return (
      <nav
        ref={ref}
        aria-label="Progress"
        className={cn("", className)}
        {...props}
      >
        <ol role="list" className="overflow-hidden">
          {steps.map((step, stepIdx) => (
            <li
              key={step.name}
              className={cn(
                stepIdx !== steps.length - 1 ? 'pb-10' : '',
                'relative'
              )}
            >
              {step.status === 'complete' ? (
                <>
                  {/* Connector line for completed step */}
                  {stepIdx !== steps.length - 1 ? (
                    <div
                      aria-hidden="true"
                      className="absolute left-4 top-4 -ml-px mt-0.5 h-full w-0.5 bg-indigo-500"
                    />
                  ) : null}

                  {/* Completed step */}
                  <a
                    href={step.href || '#'}
                    onClick={(e) => handleStepClick(step, stepIdx, e)}
                    className="group relative flex items-start"
                  >
                    <span className="flex h-9 items-center">
                      <span className="relative z-10 flex size-8 items-center justify-center rounded-full bg-indigo-500 group-hover:bg-indigo-600 transition-colors">
                        <CheckIcon aria-hidden="true" className="size-5 text-white" />
                      </span>
                    </span>
                    <span className="ml-4 flex min-w-0 flex-col">
                      <span className="text-sm font-medium text-white">
                        {step.name}
                      </span>
                      {step.description && (
                        <span className="text-sm text-gray-400">
                          {step.description}
                        </span>
                      )}
                    </span>
                  </a>
                </>
              ) : step.status === 'current' ? (
                <>
                  {/* Connector line for current step */}
                  {stepIdx !== steps.length - 1 ? (
                    <div
                      aria-hidden="true"
                      className="absolute left-4 top-4 -ml-px mt-0.5 h-full w-0.5 bg-gray-700"
                    />
                  ) : null}

                  {/* Current step */}
                  <a
                    href={step.href || '#'}
                    onClick={(e) => handleStepClick(step, stepIdx, e)}
                    aria-current="step"
                    className="group relative flex items-start"
                  >
                    <span aria-hidden="true" className="flex h-9 items-center">
                      <span className="relative z-10 flex size-8 items-center justify-center rounded-full border-2 border-indigo-500 bg-gray-900">
                        <span className="size-2.5 rounded-full bg-indigo-500" />
                      </span>
                    </span>
                    <span className="ml-4 flex min-w-0 flex-col">
                      <span className="text-sm font-medium text-indigo-400">
                        {step.name}
                      </span>
                      {step.description && (
                        <span className="text-sm text-gray-400">
                          {step.description}
                        </span>
                      )}
                    </span>
                  </a>
                </>
              ) : (
                <>
                  {/* Connector line for upcoming step */}
                  {stepIdx !== steps.length - 1 ? (
                    <div
                      aria-hidden="true"
                      className="absolute left-4 top-4 -ml-px mt-0.5 h-full w-0.5 bg-white/15"
                    />
                  ) : null}

                  {/* Upcoming step */}
                  <a
                    href={step.href || '#'}
                    onClick={(e) => handleStepClick(step, stepIdx, e)}
                    className="group relative flex items-start"
                  >
                    <span aria-hidden="true" className="flex h-9 items-center">
                      <span className="relative z-10 flex size-8 items-center justify-center rounded-full border-2 border-white/15 bg-gray-900 group-hover:border-white/25 transition-colors">
                        <span className="size-2.5 rounded-full bg-transparent group-hover:bg-white/15 transition-colors" />
                      </span>
                    </span>
                    <span className="ml-4 flex min-w-0 flex-col">
                      <span className="text-sm font-medium text-gray-400">
                        {step.name}
                      </span>
                      {step.description && (
                        <span className="text-sm text-gray-400">
                          {step.description}
                        </span>
                      )}
                    </span>
                  </a>
                </>
              )}
            </li>
          ))}
        </ol>
      </nav>
    )
  }
)
ProgressStepper.displayName = "ProgressStepper"

export { ProgressStepper }