import React from 'react'
import Pagination, { PaginationProps } from './Pagination'

export interface Column<T> {
  key: keyof T | string
  header: string
  render?: (item: T, key: keyof T | string) => React.ReactNode
  className?: string
  headerClassName?: string
}

export interface TableProps<T> {
  data: T[]
  columns: Column<T>[]
  title?: string
  description?: string
  headerActions?: React.ReactNode
  onRowClick?: (item: T) => void
  emptyMessage?: string
  className?: string
  pagination?: Omit<PaginationProps, 'showingStart' | 'showingEnd'>
}

function Table<T extends Record<string, unknown>>({
  data,
  columns,
  title,
  description,
  headerActions,
  onRowClick,
  emptyMessage = "No hay datos para mostrar",
  className = "",
  pagination
}: TableProps<T>) {
  // Calculate pagination values
  const showingStart = pagination ? (pagination.currentPage - 1) * 10 + 1 : 1
  const showingEnd = pagination ? Math.min(pagination.currentPage * 10, pagination.totalItems) : data.length
  
  return (
    <div className={`flex flex-col h-full ${className}`}>
      {(title || description || headerActions) && (
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            {title && (
              <h1 className="text-base font-semibold text-gray-900 dark:text-white">
                {title}
              </h1>
            )}
            {description && (
              <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                {description}
              </p>
            )}
          </div>
          {headerActions && (
            <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
              {headerActions}
            </div>
          )}
        </div>
      )}

      <div className="mt-8 flex-1 overflow-x-auto">
        <div className="inline-block min-w-full align-middle">
          {data.length === 0 ? (
            <div className="text-center py-12">
              <div className="mx-auto h-12 w-12 text-gray-400">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2h4a1 1 0 011 1v1a1 1 0 01-1 1v9a2 2 0 01-2 2H5a2 2 0 01-2-2V7a1 1 0 01-1-1V5a1 1 0 011-1h4z" />
                </svg>
              </div>
              <h3 className="mt-2 text-sm font-semibold text-gray-900 dark:text-gray-100">
                {emptyMessage}
              </h3>
            </div>
          ) : (
            <table className="relative min-w-full divide-y divide-gray-300 dark:divide-white/15">
              <thead>
                <tr>
                  {columns.map((column, index) => (
                    <th
                      key={index}
                      scope="col"
                      className={`py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white ${
                        index === 0 ? 'pl-0 pr-3' : 'px-3'
                      } ${column.headerClassName || ''}`}
                    >
                      {column.header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-white/10 bg-gray-50/30 dark:bg-gray-900">
                {data.map((item, rowIndex) => (
                  <tr
                    key={rowIndex}
                    className={`${
                      onRowClick
                        ? 'cursor-pointer hover:bg-gray-50/80 dark:hover:bg-gray-800/60 transition-colors'
                        : 'hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors'
                    }`}
                    onClick={() => onRowClick?.(item)}
                  >
                    {columns.map((column, colIndex) => (
                      <td
                        key={colIndex}
                        className={`whitespace-nowrap py-5 text-sm text-gray-900 dark:text-gray-100 ${
                          colIndex === 0 ? 'pl-0 pr-3' : 'px-3'
                        } ${column.className || ''}`}
                      >
                        {column.render
                          ? column.render(item, column.key)
                          : typeof column.key === 'string' && column.key.includes('.')
                          ? String(column.key.split('.').reduce((obj: Record<string, unknown>, key: string) => obj?.[key] as Record<string, unknown>, item as Record<string, unknown>) ?? '')
                          : String(item[column.key as keyof T] ?? '')
                        }
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
      
      {/* Pagination */}
      {pagination && (
        <div className="mt-auto pt-4">
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            totalItems={pagination.totalItems}
            onPageChange={pagination.onPageChange}
            showingStart={showingStart}
            showingEnd={showingEnd}
          />
        </div>
      )}
    </div>
  )
}

export default Table