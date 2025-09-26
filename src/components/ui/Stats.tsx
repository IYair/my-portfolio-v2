import React from 'react'
import { ArrowDownIcon, ArrowUpIcon } from '@heroicons/react/20/solid'

export interface StatItem {
  name: string
  stat: string | number
  previousStat?: string | number
  change?: string
  changeType?: 'increase' | 'decrease'
  icon?: React.ReactNode
}

export interface StatsProps {
  title?: string
  stats: StatItem[]
  columns?: 1 | 2 | 3 | 4
  className?: string
}

function classNames(...classes: (string | undefined | false)[]): string {
  return classes.filter(Boolean).join(' ')
}

export default function Stats({
  title,
  stats,
  columns = 3,
  className = ""
}: StatsProps) {

  const gridCols = {
    1: 'grid-cols-1',
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-3',
    4: 'md:grid-cols-4'
  }

  return (
    <div className={className}>
      {title && (
        <h3 className="text-base font-semibold text-white">
          {title}
        </h3>
      )}

      <dl className={`mt-5 grid grid-cols-1 gap-5 ${gridCols[columns]}`}>
        {stats.map((item) => (
          <div
            key={item.name}
            className="relative overflow-hidden rounded-lg bg-gray-800/75 px-4 pb-12 pt-5 shadow ring-1 ring-inset ring-white/10 sm:px-6 sm:pt-6"
          >
            <dt>
              {item.icon && (
                <div className="absolute rounded-md bg-indigo-500 p-3">
                  <span className="size-6 text-white" aria-hidden="true">
                    {item.icon}
                  </span>
                </div>
              )}
              <p className="ml-16 truncate text-sm font-medium text-gray-400">{item.name}</p>
            </dt>
            <dd className="ml-16 flex items-baseline pb-6 sm:pb-7">
              <p className="text-2xl font-semibold text-white">{item.stat}</p>
              {item.change && item.changeType && (
                <p
                  className={classNames(
                    item.changeType === 'increase' ? 'text-green-400' : 'text-red-400',
                    'ml-2 flex items-baseline text-sm font-semibold',
                  )}
                >
                  {item.changeType === 'increase' ? (
                    <ArrowUpIcon aria-hidden="true" className="size-5 shrink-0 self-center text-green-400" />
                  ) : (
                    <ArrowDownIcon aria-hidden="true" className="size-5 shrink-0 self-center text-red-400" />
                  )}
                  <span className="sr-only"> {item.changeType === 'increase' ? 'Increased' : 'Decreased'} by </span>
                  {item.change}
                </p>
              )}
              {item.previousStat !== undefined && (
                <div className="absolute inset-x-0 bottom-0 bg-gray-700/20 px-4 py-4 sm:px-6">
                  <div className="text-sm">
                    <span className="font-medium text-indigo-400">
                      from {item.previousStat}
                    </span>
                  </div>
                </div>
              )}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  )
}