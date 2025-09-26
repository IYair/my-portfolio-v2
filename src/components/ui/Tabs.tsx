import React from 'react'
import { ChevronDownIcon } from '@heroicons/react/16/solid'
import { cn } from '@/lib/utils'

export interface TabItem {
  name: string
  href?: string
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>
  current: boolean
  onClick?: () => void
}

interface TabsProps {
  tabs: TabItem[]
  onTabChange?: (tab: TabItem) => void
  className?: string
}

const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(
  ({ tabs, onTabChange, className, ...props }, ref) => {
    const currentTab = tabs.find((tab) => tab.current)

    const handleTabClick = (tab: TabItem, e: React.MouseEvent) => {
      e.preventDefault()
      if (tab.onClick) {
        tab.onClick()
      }
      if (onTabChange) {
        onTabChange(tab)
      }
    }

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const selectedTab = tabs.find((tab) => tab.name === e.target.value)
      if (selectedTab) {
        if (selectedTab.onClick) {
          selectedTab.onClick()
        }
        if (onTabChange) {
          onTabChange(selectedTab)
        }
      }
    }

    return (
      <div ref={ref} className={cn("", className)} {...props}>
        {/* Mobile select dropdown */}
        <div className="grid grid-cols-1 sm:hidden">
          <select
            value={currentTab?.name || ''}
            onChange={handleSelectChange}
            aria-label="Select a tab"
            className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white/5 py-2 pl-3 pr-8 text-base text-gray-100 outline outline-1 -outline-offset-1 outline-white/10 *:bg-gray-800 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500"
          >
            {tabs.map((tab) => (
              <option key={tab.name} value={tab.name}>
                {tab.name}
              </option>
            ))}
          </select>
          <ChevronDownIcon
            aria-hidden="true"
            className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end fill-gray-400"
          />
        </div>

        {/* Desktop tab navigation */}
        <div className="hidden sm:block">
          <div className="border-b border-white/10">
            <nav aria-label="Tabs" className="-mb-px flex space-x-8">
              {tabs.map((tab) => {
                const TabIcon = tab.icon
                return (
                  <a
                    key={tab.name}
                    href={tab.href || '#'}
                    onClick={(e) => handleTabClick(tab, e)}
                    aria-current={tab.current ? 'page' : undefined}
                    className={cn(
                      tab.current
                        ? 'border-indigo-400 text-indigo-400'
                        : 'border-transparent text-gray-400 hover:border-white/20 hover:text-gray-300',
                      'group inline-flex items-center border-b-2 px-1 py-4 text-sm font-medium transition-colors'
                    )}
                  >
                    {TabIcon && (
                      <TabIcon
                        aria-hidden="true"
                        className={cn(
                          tab.current
                            ? 'text-indigo-400'
                            : 'text-gray-500 group-hover:text-gray-400',
                          '-ml-0.5 mr-2 size-5 transition-colors'
                        )}
                      />
                    )}
                    <span>{tab.name}</span>
                  </a>
                )
              })}
            </nav>
          </div>
        </div>
      </div>
    )
  }
)
Tabs.displayName = "Tabs"

export { Tabs }