import { useState } from 'react'

export type ContentItem = {
  id: string
  name: string
  description?: string
  metadata?: Record<string, any>
  isSelected: boolean
  [key: string]: any // Allow for additional properties
}

export type ColumnConfig = {
  key: string
  label: string
  width: number // col-span value (1-12)
  render?: (item: ContentItem) => React.ReactNode
  searchable?: boolean
}

type ContentSelectionTableProps = {
  items: ContentItem[]
  columns: ColumnConfig[]
  onItemToggle: (itemId: string) => void
  searchPlaceholder?: string
  title?: string
  emptyMessage?: string
  selectedLabel?: string
  onSearch?: (query: string) => void
  onFilter?: (filterKey: string, filterValue: string) => void
  filters?: Array<{
    key: string
    label: string
    options: Array<{ value: string; label: string }>
    value: string
  }>
  showReset?: boolean
  onReset?: () => void
}

export function ContentSelectionTable({
  items,
  columns,
  onItemToggle,
  searchPlaceholder = "Search...",
  title,
  emptyMessage = "No items found",
  selectedLabel = "selected",
  onSearch,
  onFilter,
  filters = [],
  showReset = false,
  onReset
}: ContentSelectionTableProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  const selectedCount = items.filter(item => item.isSelected).length

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    onSearch?.(query)
  }

  const handleReset = () => {
    setSearchQuery('')
    setShowFilters(false)
    onReset?.()
  }

  // Default filtering logic if no custom onSearch provided
  const filteredItems = onSearch ? items : items.filter(item => {
    const searchableFields = columns
      .filter(col => col.searchable !== false)
      .map(col => {
        if (col.key === 'name') return item.name
        if (col.key === 'description') return item.description
        return item[col.key]
      })
      .filter(Boolean)
      .join(' ')
      .toLowerCase()
    
    return searchableFields.includes(searchQuery.toLowerCase())
  })

  return (
    <div>
      {/* Header */}
      {title && (
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900">{title}</h3>
          <div className="flex items-center gap-3">
            {selectedCount > 0 && (
              <div className="text-xs text-green-700 bg-green-50 px-2 py-1 rounded-full">
                ✓ {selectedCount} {selectedLabel}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Search and Filters */}
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
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white pl-10 pr-4 py-2.5 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
            />
          </div>
          
          {/* Filters */}
          {filters.map(filter => (
            <select
              key={filter.key}
              value={filter.value}
              onChange={(e) => onFilter?.(filter.key, e.target.value)}
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

          {/* Filter Toggle Button */}
          {filters.length > 0 && (
            <button
              onClick={() => setShowFilters(!showFilters)}
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
        {showFilters && filters.length > 0 && (
          <div className="mb-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
            <div className="flex items-center gap-4 flex-wrap">
              {filters.map(filter => (
                <div key={filter.key} className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-700">{filter.label}:</span>
                  <div className="flex gap-2">
                    {filter.options.map(option => (
                      <button
                        key={option.value}
                        onClick={() => onFilter?.(filter.key, option.value)}
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

        {/* Row Count */}
        <div className="text-sm text-gray-600 mb-4">
          {filteredItems.length} rows found
        </div>
      </div>

      {/* Table */}
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        {/* Table Header */}
        <div className="bg-gray-50 grid grid-cols-12 gap-4 px-4 py-3 text-sm font-medium text-gray-700 border-b border-gray-200">
          {columns.map(column => (
            <div key={column.key} className={`col-span-${column.width}`}>
              {column.label}
            </div>
          ))}
        </div>

        {/* Table Body */}
        <div className="bg-white">
          {filteredItems.map((item, index) => (
            <div 
              key={item.id}
              className={`grid grid-cols-12 gap-4 items-center px-4 py-3 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer ${
                index === filteredItems.length - 1 ? 'border-b-0' : ''
              }`}
              onClick={() => onItemToggle(item.id)}
            >
              {columns.map(column => (
                <div key={column.key} className={`col-span-${column.width}`}>
                  {column.render ? (
                    column.render(item)
                  ) : column.key === 'select' ? (
                    <div className="flex justify-center">
                      <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                        item.isSelected ? 'border-gray-900 bg-gray-900' : 'border-gray-300'
                      }`}>
                        {item.isSelected && (
                          <svg className="h-2.5 w-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                    </div>
                  ) : column.key === 'name' ? (
                    <span className="text-sm font-medium text-gray-900 truncate">{item[column.key]}</span>
                  ) : (
                    <span className="text-sm text-gray-600 truncate">{item[column.key]}</span>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Empty State */}
      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500">{emptyMessage}</div>
        </div>
      )}
    </div>
  )
}
