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
        <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-5">
          {title}
        </h3>
      )}

      <dl className={`grid grid-cols-1 divide-gray-200 dark:divide-white/10 overflow-hidden rounded-lg bg-white/80 dark:bg-gray-800/75 ring-1 ring-inset ring-gray-200 dark:ring-white/10 shadow backdrop-blur-sm ${gridCols[columns]} ${columns > 1 ? 'md:divide-x md:divide-y-0' : ''}`}>
        {stats.map((item, index) => (
          <div key={item.name} className="px-4 py-5 sm:p-6">
            <dt className="text-base font-normal text-gray-600 dark:text-gray-100 flex items-center">
              {item.icon && (
                <span className="mr-2 text-gray-500 dark:text-gray-400">
                  {item.icon}
                </span>
              )}
              {item.name}
            </dt>
            <dd className="mt-1 flex items-baseline justify-between md:block lg:flex">
              <div className="flex items-baseline text-2xl font-semibold text-indigo-600 dark:text-indigo-400">
                {item.stat}
                {item.previousStat && (
                  <span className="ml-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                    from {item.previousStat}
                  </span>
                )}
              </div>

              {item.change && item.changeType && (
                <div
                  className={classNames(
                    item.changeType === 'increase'
                      ? 'bg-green-100 text-green-800 dark:bg-green-400/10 dark:text-green-400'
                      : 'bg-red-100 text-red-800 dark:bg-red-400/10 dark:text-red-400',
                    'inline-flex items-baseline rounded-full px-2.5 py-0.5 text-sm font-medium md:mt-2 lg:mt-0',
                  )}
                >
                  {item.changeType === 'increase' ? (
                    <ArrowUpIcon
                      aria-hidden="true"
                      className="-ml-1 mr-0.5 size-5 shrink-0 self-center text-green-600 dark:text-green-400"
                    />
                  ) : (
                    <ArrowDownIcon
                      aria-hidden="true"
                      className="-ml-1 mr-0.5 size-5 shrink-0 self-center text-red-600 dark:text-red-400"
                    />
                  )}
                  <span className="sr-only">
                    {item.changeType === 'increase' ? 'Increased' : 'Decreased'} by
                  </span>
                  {item.change}
                </div>
              )}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  )
}