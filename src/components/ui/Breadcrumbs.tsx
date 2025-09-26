import React from 'react'
import { HomeIcon } from '@heroicons/react/20/solid'
import { cn } from '@/lib/utils'

export interface BreadcrumbItem {
  name: string
  href?: string
  current: boolean
  onClick?: () => void
}

interface BreadcrumbsProps {
  pages: BreadcrumbItem[]
  homeHref?: string
  onHomeClick?: () => void
  className?: string
}

const Breadcrumbs = React.forwardRef<HTMLElement, BreadcrumbsProps>(
  ({ pages, homeHref = '#', onHomeClick, className, ...props }, ref) => {
    const handleHomeClick = (e: React.MouseEvent) => {
      if (onHomeClick) {
        e.preventDefault()
        onHomeClick()
      }
    }

    const handlePageClick = (page: BreadcrumbItem, e: React.MouseEvent) => {
      if (page.onClick) {
        e.preventDefault()
        page.onClick()
      }
    }

    return (
      <nav
        ref={ref}
        aria-label="Breadcrumb"
        className={cn("flex", className)}
        {...props}
      >
        <ol
          role="list"
          className="flex space-x-4 rounded-md bg-gray-800/50 px-6 py-2 outline outline-1 -outline-offset-1 outline-white/10"
        >
          {/* Home icon */}
          <li className="flex">
            <div className="flex items-center">
              <a
                href={homeHref}
                onClick={handleHomeClick}
                className="text-gray-400 hover:text-gray-300 transition-colors"
              >
                <HomeIcon aria-hidden="true" className="size-5 shrink-0" />
                <span className="sr-only">Home</span>
              </a>
            </div>
          </li>

          {/* Breadcrumb pages */}
          {pages.map((page) => (
            <li key={page.name} className="flex">
              <div className="flex items-center">
                {/* Separator icon */}
                <svg
                  fill="currentColor"
                  viewBox="0 0 24 44"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                  className="h-full w-6 shrink-0 text-white/10"
                >
                  <path d="M.293 0l22 22-22 22h1.414l22-22-22-22H.293z" />
                </svg>

                {/* Page link */}
                {page.current ? (
                  <span
                    aria-current="page"
                    className="ml-4 text-sm font-medium text-gray-200"
                  >
                    {page.name}
                  </span>
                ) : (
                  <a
                    href={page.href || '#'}
                    onClick={(e) => handlePageClick(page, e)}
                    className="ml-4 text-sm font-medium text-gray-400 hover:text-gray-200 transition-colors"
                  >
                    {page.name}
                  </a>
                )}
              </div>
            </li>
          ))}
        </ol>
      </nav>
    )
  }
)
Breadcrumbs.displayName = "Breadcrumbs"

export { Breadcrumbs }