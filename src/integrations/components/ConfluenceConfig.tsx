import { useState } from 'react'
import { useIntegrationsStore } from '../store'

type ConfluenceSpace = {
  id: string
  name: string
  key: string
  description: string
  pageCount: number
  lastModified: string
  isSelected: boolean
  url: string
  type: 'team' | 'personal' | 'global'
}

export function ConfluenceConfigPanel({ onClose }: { onClose: () => void }) {
  const { connections } = useIntegrationsStore()
  const isAlreadyConnected = Boolean(connections['confluence'])
  
  const [isConnected, setIsConnected] = useState(isAlreadyConnected)
  const [isConnecting, setIsConnecting] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  
  const [spaces, setSpaces] = useState<ConfluenceSpace[]>([
    { id: 'space1', name: 'Sales Knowledge Base', key: 'SKB', description: 'Comprehensive sales processes, methodologies, and best practices', pageCount: 45, lastModified: '2 days ago', isSelected: true, url: 'https://company.atlassian.net/wiki/spaces/SKB', type: 'team' },
    { id: 'space2', name: 'Product Documentation', key: 'PROD', description: 'Technical documentation, feature specs, and product guides', pageCount: 128, lastModified: '1 day ago', isSelected: true, url: 'https://company.atlassian.net/wiki/spaces/PROD', type: 'team' },
    { id: 'space3', name: 'Marketing Hub', key: 'MKT', description: 'Campaign strategies, messaging frameworks, and market research', pageCount: 67, lastModified: '3 days ago', isSelected: false, url: 'https://company.atlassian.net/wiki/spaces/MKT', type: 'team' },
    { id: 'space4', name: 'Customer Success', key: 'CS', description: 'Customer onboarding, support processes, and success metrics', pageCount: 89, lastModified: '1 week ago', isSelected: true, url: 'https://company.atlassian.net/wiki/spaces/CS', type: 'team' },
    { id: 'space5', name: 'Engineering Docs', key: 'ENG', description: 'Technical architecture, APIs, and development guidelines', pageCount: 234, lastModified: '5 days ago', isSelected: false, url: 'https://company.atlassian.net/wiki/spaces/ENG', type: 'team' },
    { id: 'space6', name: 'Leadership Updates', key: 'LEAD', description: 'Company updates, strategic initiatives, and leadership communications', pageCount: 23, lastModified: '1 day ago', isSelected: false, url: 'https://company.atlassian.net/wiki/spaces/LEAD', type: 'global' },
  ])

  const handleConnect = async () => {
    setIsConnecting(true)
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsConnected(true)
    setIsConnecting(false)
  }

  const toggleSpace = (spaceId: string) => {
    setSpaces(prev => prev.map(space => 
      space.id === spaceId ? { ...space, isSelected: !space.isSelected } : space
    ))
  }

  const save = () => {
    const { configure } = useIntegrationsStore.getState()
    configure('confluence', { 
      selectedSpaces: spaces.filter(s => s.isSelected),
      lastUpdated: new Date().toISOString()
    })
    onClose()
  }

  const filteredSpaces = spaces.filter(space => 
    space.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    space.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
    space.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (!isConnected) {
    return (
      <div className="flex h-full flex-col bg-white rounded-xl overflow-hidden">
        {/* Header */}
        <div className="border-b border-gray-200 px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 shadow-lg">
                <span className="text-sm font-bold text-white">C</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Connect Confluence</h1>
                <p className="text-gray-600 mt-0.5 text-sm">Connect your Confluence workspace to Docket</p>
              </div>
            </div>
            <button 
              onClick={onClose} 
              className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Connection Content */}
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center max-w-sm">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 mx-auto mb-6">
              <span className="text-3xl">📚</span>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Connect your Confluence workspace</h2>
            <p className="text-gray-600 mb-8">
              Give Docket access to your Confluence spaces to power the Sales Knowledge Lake with your team's documentation and knowledge.
            </p>
            <button
              onClick={handleConnect}
              disabled={isConnecting}
              className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-6 py-3 text-sm font-semibold text-white hover:bg-gray-800 disabled:opacity-50 transition-colors shadow-lg min-w-[140px]"
            >
              {isConnecting ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>Connecting...</span>
                </>
              ) : (
                <>
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.102m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                  Connect to Confluence
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    )
  }

  const selectedSpaces = spaces.filter(s => s.isSelected)

  return (
    <div className="flex h-full flex-col bg-white rounded-xl overflow-hidden">
      {/* Header */}
      <div className="border-b border-gray-200 px-6 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 shadow-lg">
              <span className="text-sm font-bold text-white">C</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Confluence Configuration</h1>
              <p className="text-gray-600 mt-0.5 text-sm">Select spaces to ingest into Sales Knowledge Lake</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Search and Summary */}
        <div className="border-b border-gray-100 px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="relative flex-1 max-w-md">
              <svg className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search spaces..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white pl-10 pr-4 py-2.5 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
              />
            </div>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <div className="text-gray-600">
              {selectedSpaces.length} space{selectedSpaces.length !== 1 ? 's' : ''} selected • {selectedSpaces.reduce((sum, s) => sum + s.pageCount, 0)} total pages
            </div>
            <div className="text-xs text-gray-500">
              Each space connection syncs full page content
            </div>
          </div>
        </div>

        {/* Spaces List */}
        <div className="p-6">
          <div className="space-y-3">
            {filteredSpaces.map((space) => (
              <SpaceCard
                key={space.id}
                space={space}
                onToggle={() => toggleSpace(space.id)}
              />
            ))}
          </div>
          
          {filteredSpaces.length === 0 && searchQuery && (
            <div className="text-center py-12">
              <div className="text-gray-500">No spaces match "{searchQuery}"</div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 bg-gray-50 px-6 py-6">
        <div className="flex items-center justify-between">
          <button className="inline-flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900 font-medium">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Confluence integration help
          </button>
          <div className="flex gap-3">
            <button 
              onClick={onClose}
              className="rounded-xl border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={save}
              className="rounded-xl bg-gray-900 hover:bg-gray-800 px-5 py-2.5 text-sm font-semibold text-white transition-colors shadow-lg"
            >
              Save & Start Ingestion
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function SpaceCard({ 
  space, 
  onToggle 
}: { 
  space: ConfluenceSpace
  onToggle: () => void
}) {
  const getSpaceTypeIcon = (type: string) => {
    switch (type) {
      case 'team': return '👥'
      case 'personal': return '👤'
      case 'global': return '🌐'
      default: return '📚'
    }
  }

  const getSpaceTypeColor = (type: string) => {
    switch (type) {
      case 'team': return 'bg-blue-100 text-blue-800'
      case 'personal': return 'bg-gray-100 text-gray-800'
      case 'global': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div 
      className={`group rounded-xl border p-5 transition-all cursor-pointer ${
        space.isSelected 
          ? 'border-gray-900 bg-gray-50 shadow-md' 
          : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
      }`}
      onClick={onToggle}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4 flex-1">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-xl">
            📚
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <h4 className="text-base font-semibold text-gray-900">{space.name}</h4>
              <span className="text-xs font-mono bg-gray-100 text-gray-700 px-2 py-1 rounded">{space.key}</span>
              <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getSpaceTypeColor(space.type)}`}>
                {getSpaceTypeIcon(space.type)} {space.type}
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-3 leading-relaxed">{space.description}</p>
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.674-2.64" />
                </svg>
                {space.pageCount} pages
              </span>
              <span>Updated {space.lastModified}</span>
              <button 
                onClick={(e) => {
                  e.stopPropagation()
                  window.open(space.url, '_blank')
                }}
                className="opacity-0 group-hover:opacity-100 text-blue-600 hover:text-blue-800 transition-all"
              >
                View in Confluence
              </button>
            </div>
          </div>
        </div>
        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
          space.isSelected ? 'border-gray-900 bg-gray-900' : 'border-gray-300 group-hover:border-gray-400'
        }`}>
          {space.isSelected && (
            <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          )}
        </div>
      </div>
      
      {space.isSelected && (
        <div className="mt-4 rounded-lg bg-blue-50 border border-blue-200 p-3">
          <div className="flex items-center gap-2 text-sm">
            <svg className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-blue-800 font-medium">
              Full page content from this space will be ingested into Sales Knowledge Lake
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
