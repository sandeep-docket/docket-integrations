import { useState } from 'react'
import { useIntegrationsStore } from '../store'

type HighspotContent = {
  id: string
  name: string
  type: 'pitch' | 'playbook' | 'battlecard' | 'case-study' | 'demo' | 'template'
  category: string
  tags: string[]
  lastModified: string
  viewCount: number
  isSelected: boolean
  url: string
}

type ContentSettings = {
  syncSalesContent: boolean
  syncPlaybooks: boolean
  syncBattlecards: boolean
  syncCaseStudies: boolean
  enableContentAnalytics: boolean
  trackContentUsage: boolean
  selectedContent: string[]
  contentCategories: string[]
}

export function HighspotConfigPanel({ onClose }: { onClose: () => void }) {
  const { connections } = useIntegrationsStore()
  const isAlreadyConnected = Boolean(connections['highspot'])
  
  const [isConnected, setIsConnected] = useState(isAlreadyConnected)
  const [isConnecting, setIsConnecting] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<'all' | string>('all')
  
  const [content, setContent] = useState<HighspotContent[]>([
    { id: 'hs1', name: 'Enterprise Sales Pitch Deck', type: 'pitch', category: 'Sales Presentations', tags: ['enterprise', 'pitch', 'demo'], lastModified: '2 days ago', viewCount: 45, isSelected: true, url: 'https://highspot.com/content/1' },
    { id: 'hs2', name: 'Competitive Battle Card - Competitor A', type: 'battlecard', category: 'Competitive Intelligence', tags: ['competitive', 'objections'], lastModified: '1 week ago', viewCount: 78, isSelected: true, url: 'https://highspot.com/content/2' },
    { id: 'hs3', name: 'Customer Success Stories Q1', type: 'case-study', category: 'Case Studies', tags: ['success', 'testimonials'], lastModified: '3 days ago', viewCount: 34, isSelected: false, url: 'https://highspot.com/content/3' },
    { id: 'hs4', name: 'Discovery Call Playbook', type: 'playbook', category: 'Sales Methodology', tags: ['discovery', 'qualification'], lastModified: '1 day ago', viewCount: 92, isSelected: true, url: 'https://highspot.com/content/4' },
    { id: 'hs5', name: 'Product Demo Script', type: 'demo', category: 'Product Demos', tags: ['demo', 'script', 'product'], lastModified: '5 days ago', viewCount: 67, isSelected: true, url: 'https://highspot.com/content/5' },
    { id: 'hs6', name: 'Proposal Template - Enterprise', type: 'template', category: 'Templates', tags: ['proposal', 'enterprise'], lastModified: '1 week ago', viewCount: 23, isSelected: false, url: 'https://highspot.com/content/6' },
    { id: 'hs7', name: 'ROI Calculator Presentation', type: 'pitch', category: 'Sales Tools', tags: ['roi', 'calculator', 'value'], lastModified: '4 days ago', viewCount: 56, isSelected: true, url: 'https://highspot.com/content/7' },
  ])

  const [settings, setSettings] = useState<ContentSettings>({
    syncSalesContent: true,
    syncPlaybooks: true,
    syncBattlecards: true,
    syncCaseStudies: true,
    enableContentAnalytics: true,
    trackContentUsage: true,
    selectedContent: content.filter(c => c.isSelected).map(c => c.id),
    contentCategories: ['Sales Presentations', 'Competitive Intelligence', 'Case Studies', 'Sales Methodology']
  })

  const categories = ['all', ...Array.from(new Set(content.map(c => c.category)))]

  const handleConnect = async () => {
    setIsConnecting(true)
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsConnected(true)
    setIsConnecting(false)
  }

  const toggleContent = (contentId: string) => {
    setContent(prev => prev.map(item => 
      item.id === contentId ? { ...item, isSelected: !item.isSelected } : item
    ))
    setSettings(prev => ({
      ...prev,
      selectedContent: prev.selectedContent.includes(contentId)
        ? prev.selectedContent.filter(id => id !== contentId)
        : [...prev.selectedContent, contentId]
    }))
  }

  const updateSetting = <K extends keyof ContentSettings>(key: K, value: ContentSettings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  const save = () => {
    const { configure } = useIntegrationsStore.getState()
    configure('highspot', { 
      settings,
      selectedContent: content.filter(c => c.isSelected),
      lastUpdated: new Date().toISOString()
    })
    onClose()
  }

  const filteredContent = content.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  if (!isConnected) {
    return (
      <div className="flex h-full flex-col bg-white rounded-xl overflow-hidden">
        {/* Header */}
        <div className="border-b border-gray-200 px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 shadow-lg">
                <span className="text-sm font-bold text-white">H</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Connect Highspot</h1>
                <p className="text-gray-600 mt-0.5 text-sm">Connect your Highspot account to Docket</p>
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
              <span className="text-3xl">🎯</span>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Connect your Highspot account</h2>
            <p className="text-gray-600 mb-8">
              Give Docket access to your sales enablement content to power the Sales Knowledge Lake with proven materials and playbooks.
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
                  Connect to Highspot
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    )
  }

  const selectedContent = content.filter(c => c.isSelected)

  return (
    <div className="flex h-full flex-col bg-white rounded-xl overflow-hidden">
      {/* Header */}
      <div className="border-b border-gray-200 px-6 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 shadow-lg">
              <span className="text-sm font-bold text-white">H</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Highspot Configuration</h1>
              <p className="text-gray-600 mt-0.5 text-sm">Select sales enablement content to sync with Knowledge Lake</p>
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
      <div className="flex-1 overflow-y-auto p-6">
        <div className="space-y-6">
          {/* Content Analytics Settings */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4">Content Analytics</h3>
            <div className="space-y-4">
              <SettingCard
                title="Enable content analytics"
                description="Track content performance and usage metrics for AI insights"
                checked={settings.enableContentAnalytics}
                onChange={(checked) => updateSetting('enableContentAnalytics', checked)}
              />
              
              <SettingCard
                title="Track content usage"
                description="Monitor which content is most effective for different sales scenarios"
                checked={settings.trackContentUsage}
                onChange={(checked) => updateSetting('trackContentUsage', checked)}
              />
            </div>
          </div>

          {/* Content Selection */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Sales Content</h3>
              <div className="text-sm text-gray-600">
                {selectedContent.length} items selected
              </div>
            </div>

            {/* Search and Filter */}
            <div className="flex gap-4 mb-4">
              <div className="relative flex-1">
                <svg className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search content..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-white pl-10 pr-4 py-2.5 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
                />
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
              >
                <option value="all">All categories</option>
                {categories.slice(1).map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            {/* Content List */}
            <div className="space-y-3">
              {filteredContent.map((item) => (
                <HighspotContentCard
                  key={item.id}
                  content={item}
                  onToggle={() => toggleContent(item.id)}
                />
              ))}
            </div>

            {filteredContent.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                {searchQuery || selectedCategory !== 'all' 
                  ? 'No content matches your filters'
                  : 'No content available'
                }
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content Ingestion Notice */}
      {selectedContent.length > 0 && (
        <div className="border-t border-gray-100 bg-blue-50 px-6 py-4">
          <div className="flex items-start gap-3">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600">
              <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-blue-900">Content Sync Process</p>
              <p className="text-xs text-blue-700 mt-1">
                Selected content will be synced to your Sales Knowledge Lake. 
                Content analytics and usage data will help improve AI recommendations.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="border-t border-gray-200 bg-gray-50 px-6 py-6">
        <div className="flex items-center justify-between">
          <button className="inline-flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900 font-medium">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Highspot integration help
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
              Save & Sync Content
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function SettingCard({ 
  title, 
  description, 
  checked, 
  onChange 
}: { 
  title: string
  description: string
  checked: boolean
  onChange: (checked: boolean) => void
}) {
  return (
    <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200 bg-gray-50">
      <div>
        <div className="text-sm font-medium text-gray-900">{title}</div>
        <div className="text-xs text-gray-600">{description}</div>
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 ${
          checked ? 'bg-gray-900' : 'bg-gray-300'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
            checked ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  )
}

function HighspotContentCard({ 
  content, 
  onToggle 
}: { 
  content: HighspotContent
  onToggle: () => void
}) {
  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case 'pitch': return '📊'
      case 'playbook': return '📖'
      case 'battlecard': return '⚔️'
      case 'case-study': return '📋'
      case 'demo': return '🎥'
      case 'template': return '📄'
      default: return '📁'
    }
  }

  const getContentTypeColor = (type: string) => {
    switch (type) {
      case 'pitch': return 'bg-blue-100 text-blue-800'
      case 'playbook': return 'bg-purple-100 text-purple-800'
      case 'battlecard': return 'bg-red-100 text-red-800'
      case 'case-study': return 'bg-green-100 text-green-800'
      case 'demo': return 'bg-orange-100 text-orange-800'
      case 'template': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div 
      className={`group rounded-lg border p-4 transition-all cursor-pointer ${
        content.isSelected 
          ? 'border-gray-900 bg-gray-50 shadow-md' 
          : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
      }`}
      onClick={onToggle}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4 flex-1">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 text-xl">
            {getContentTypeIcon(content.type)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <h4 className="text-base font-semibold text-gray-900 truncate">{content.name}</h4>
              <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getContentTypeColor(content.type)}`}>
                {content.type}
              </span>
            </div>
            <div className="text-sm text-gray-600 mb-2">{content.category}</div>
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                {content.viewCount} views
              </span>
              <span>Updated {content.lastModified}</span>
              <div className="flex gap-1">
                {content.tags.slice(0, 2).map(tag => (
                  <span key={tag} className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-xs">
                    {tag}
                  </span>
                ))}
              </div>
              <button 
                onClick={(e) => {
                  e.stopPropagation()
                  window.open(content.url, '_blank')
                }}
                className="opacity-0 group-hover:opacity-100 text-blue-600 hover:text-blue-800 transition-all"
              >
                View in Highspot
              </button>
            </div>
          </div>
        </div>
        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
          content.isSelected ? 'border-gray-900 bg-gray-900' : 'border-gray-300 group-hover:border-gray-400'
        }`}>
          {content.isSelected && (
            <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          )}
        </div>
      </div>
    </div>
  )
}
