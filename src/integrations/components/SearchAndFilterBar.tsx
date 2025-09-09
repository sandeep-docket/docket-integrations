import { useState } from 'react'

export type FilterOption = {
  value: string
  label: string
}

export type FilterConfig = {
  key: string
  label: string
  options: FilterOption[]
  value: string
}

type SearchAndFilterBarProps = {
  searchQuery: string
  onSearchChange: (query: string) => void
  searchPlaceholder?: string
  filters?: FilterConfig[]
  onFilterChange?: (filterKey: string, value: string) => void
  showReset?: boolean
  onReset?: () => void
  resultCount?: number
  resultLabel?: string
}

export function SearchAndFilterBar({
  searchQuery,
  onSearchChange,
  searchPlaceholder = "Search...",
  filters = [],
  onFilterChange,
  showReset = false,
  onReset,
  resultCount,
  resultLabel = "rows found"
}: SearchAndFilterBarProps) {
  const [showFilterDropdown, setShowFilterDropdown] = useState(false)

  const handleReset = () => {
    onSearchChange('')
    setShowFilterDropdown(false)
    onReset?.()
  }

  return (
    <div className="mb-4">
      <div className="flex items-center gap-3 mb-4">
        {/* Search */}
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white pl-10 pr-4 py-2.5 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
          />
        </div>
        
        {/* Inline Filters */}
        {filters.map(filter => (
          <select
            key={filter.key}
            value={filter.value}
            onChange={(e) => onFilterChange?.(filter.key, e.target.value)}
            className="rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
          >
            {filter.options.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        ))}

        {/* Reset Button */}
        {showReset && (
          <button
            onClick={handleReset}
            className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Reset
          </button>
        )}

        {/* Filter Toggle Button (for complex filters) */}
        {filters.length > 2 && (
          <button
            onClick={() => setShowFilterDropdown(!showFilterDropdown)}
            className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <svg className="h-4 w-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z" />
            </svg>
            Filter
          </button>
        )}
      </div>

      {/* Filter Dropdown */}
      {showFilterDropdown && filters.length > 2 && (
        <div className="mb-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
          <div className="flex items-center gap-4 flex-wrap">
            {filters.map(filter => (
              <div key={filter.key} className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">{filter.label}:</span>
                <div className="flex gap-2">
                  {filter.options.map(option => (
                    <button
                      key={option.value}
                      onClick={() => onFilterChange?.(filter.key, option.value)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                        filter.value === option.value
                          ? 'bg-gray-900 text-white'
                          : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Result Count */}
      {resultCount !== undefined && (
        <div className="text-sm text-gray-600 mb-4">
          {resultCount} {resultLabel}
        </div>
      )}
    </div>
  )
}
