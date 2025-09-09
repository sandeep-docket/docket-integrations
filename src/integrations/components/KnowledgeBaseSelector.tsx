import { useState } from 'react'
import { ContentSelectionTable } from './ContentSelectionTable'
import type { ColumnConfig } from './ContentSelectionTable'

export type KnowledgeBaseItem = {
  id: string
  name: string
  description?: string
  category?: string
  count: number
  lastModified: string
  isSelected: boolean
  type: 'category' | 'article' | 'ticket'
}

type KnowledgeBaseSelectorProps = {
  items: KnowledgeBaseItem[]
  onItemToggle: (itemId: string) => void
  title?: string
  searchPlaceholder?: string
  tabs?: Array<{
    id: string
    label: string
    count: number
  }>
  activeTab?: string
  onTabChange?: (tabId: string) => void
}

export function KnowledgeBaseSelector({
  items,
  onItemToggle,
  title = "Knowledge Base Content",
  searchPlaceholder = "Search content...",
  tabs,
  activeTab,
  onTabChange
}: KnowledgeBaseSelectorProps) {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (item.description?.toLowerCase().includes(searchQuery.toLowerCase()) || false) ||
                         (item.category?.toLowerCase().includes(searchQuery.toLowerCase()) || false)
    return matchesSearch
  })

  const columns: ColumnConfig[] = [
    { key: 'name', label: 'Name', width: 4 },
    { key: 'description', label: 'Description', width: 4 },
    { 
      key: 'count', 
      label: items[0]?.type === 'article' ? 'Views' : 'Items', 
      width: 2,
      render: (item) => <span className="text-sm text-gray-600">{item.count}</span>
    },
    { 
      key: 'lastModified', 
      label: 'Updated', 
      width: 1,
      render: (item) => <span className="text-xs text-gray-500">{item.lastModified}</span>
    },
    { key: 'select', label: 'Select', width: 1 }
  ]

  return (
    <div>
      {/* Tabs */}
      {tabs && tabs.length > 0 && (
        <div className="border-b border-gray-200 mb-6">
          <div className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => onTabChange?.(tab.id)}
                className={`border-b-2 py-4 px-1 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'border-gray-900 text-gray-900'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label} {tab.count > 0 && `(${tab.count})`}
              </button>
            ))}
          </div>
        </div>
      )}

      <ContentSelectionTable
        items={filteredItems}
        columns={columns}
        onItemToggle={onItemToggle}
        title={title}
        searchPlaceholder={searchPlaceholder}
        selectedLabel={`${items[0]?.type || 'items'} selected for ingestion`}
        emptyMessage={searchQuery ? `No content matches "${searchQuery}"` : "No content available"}
        onSearch={setSearchQuery}
      />
    </div>
  )
}
