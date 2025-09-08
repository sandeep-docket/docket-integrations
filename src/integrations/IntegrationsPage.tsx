import { useState, useMemo } from 'react'
import { useIntegrationsStore } from './store'
import { CommandPalette } from './components/cmdk/CommandPalette'
import { ConfigureDrawer } from './components/ConfigureDrawer'
import { ConnectionModal } from './components/ConnectionModal'
import type { IntegrationCategory } from './types'
import { 
  HomeIcon, 
  ChartBarIcon, 
  InboxIcon, 
  FolderOpenIcon, 
  Cog6ToothIcon,
  BellIcon 
} from '@heroicons/react/24/outline'

export function IntegrationsPage() {
  const { providers, connections, connect } = useIntegrationsStore()
  const [activeTab, setActiveTab] = useState('Integrations')
  const [selectedCategory, setSelectedCategory] = useState<'All' | IntegrationCategory>('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [showRecommendedBanner, setShowRecommendedBanner] = useState(true)
  const [showConnectionModal, setShowConnectionModal] = useState<string | null>(null)

  const tabs = ['People', 'Knowledge Graph', 'Integrations', 'Single Sign-On', 'GuardNote']
  const categories: Array<'All' | IntegrationCategory> = [
    'All', 'CRM', 'Communication', 'Storage & Wiki', 'Enablement'
  ]

  // Recommended integrations for new users
  const recommendedIntegrations = useMemo(() => [
    providers.find(p => p.id === 'slack'),
    providers.find(p => p.id === 'gong'),
    providers.find(p => p.id === 'hubspot')
  ].filter(Boolean), [providers])

  // Check if user has connected any integration
  const hasRecommendedIntegrations = useMemo(() => {
    const hasAnyConnection = Object.keys(connections).length > 0
    return hasAnyConnection || !showRecommendedBanner
  }, [connections, showRecommendedBanner])

  const filteredProviders = useMemo(() => {
    let filtered = providers

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(p => p.category === selectedCategory)
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(query) || 
        p.description.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query)
      )
    }

    return filtered
  }, [providers, selectedCategory, searchQuery])

  const handleRecommendedConnect = (provider: any) => {
    setShowConnectionModal(provider.id)
  }

  const handleModalConnect = () => {
    const providerId = showConnectionModal
    if (providerId) {
      connect(providerId, 'demo@company.com')
      setShowConnectionModal(null)
    }
  }

  return (
    <div className="flex min-h-screen bg-white">
      {/* Left Sidebar */}
      <div className="flex w-14 flex-shrink-0 flex-col items-center justify-between border-r border-black/10 bg-white">
        <div className="flex w-full flex-col items-center">
          {/* Logo */}
          <div className="flex h-14 w-14 items-center justify-center">
            <div className="h-6 w-6 rounded bg-black"></div>
          </div>
          
          {/* Navigation Icons */}
          <div className="flex w-full flex-col items-center">
            <NavIcon icon={HomeIcon} />
            <NavIcon icon={ChartBarIcon} />
            <NavIcon icon={InboxIcon} />
            <NavIcon icon={FolderOpenIcon} />
            <NavIcon icon={Cog6ToothIcon} active />
          </div>
        </div>

        {/* Bottom section */}
        <div className="flex w-full flex-col items-center pb-4">
          <div className="relative mb-4">
            <NavIcon icon={BellIcon} />
            <div className="absolute right-3 top-2 h-1.5 w-1.5 rounded-full bg-red-500"></div>
          </div>
          <div className="h-8 w-8 rounded-full border border-[#EBEDF0] bg-gray-100"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 min-w-0 overflow-hidden bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm">
          <div className="px-4 py-6 sm:px-6">
            <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          </div>
          
          {/* Tabs */}
          <div className="border-b border-gray-200 px-4 sm:px-6">
            <div className="flex gap-6 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`whitespace-nowrap pb-4 pt-2 text-sm font-medium transition-colors ${
                    activeTab === tab
                      ? 'border-b-2 border-blue-600 text-blue-600'
                      : 'text-gray-500 hover:text-gray-700 hover:border-gray-300 border-b-2 border-transparent'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-4 py-6 sm:px-6">
          {/* Header with Search/Filters */}
          <div className="mb-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">Integrations</h2>
              <p className="text-gray-600">Connect and manage your integrations to streamline your workflow</p>
            </div>
            
            {/* Search and Filters - Moved to right side */}
            <div className="flex flex-col sm:flex-row gap-3 lg:items-center">
              <div className="relative">
                <svg className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search integrations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-white pl-10 pr-4 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 sm:w-64"
                />
              </div>
              <div className="flex gap-2 overflow-x-auto pb-1">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`whitespace-nowrap rounded-lg px-3 py-2 text-xs font-medium transition-all flex-shrink-0 ${
                      selectedCategory === category
                        ? 'bg-gray-900 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Recommended Integrations Banner */}
          {!hasRecommendedIntegrations && (
            <div className="mb-6 rounded-xl border border-gray-200 bg-white p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Essential Integrations for Sales Knowledge Lake™</h3>
                  <p className="text-gray-600 text-sm leading-relaxed max-w-2xl">
                    Get started by connecting these core integrations. Each will contribute valuable data to your centralized knowledge repository, 
                    enabling AI-powered insights and instant answers for your go-to-market teams.
                  </p>
                </div>
                <button 
                  onClick={() => setShowRecommendedBanner(false)}
                  className="text-gray-400 hover:text-gray-600 p-1"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {recommendedIntegrations.map((provider) => provider && (
                  <RecommendedIntegrationCard
                    key={provider.id}
                    provider={provider}
                    connected={Boolean(connections[provider.id])}
                    onConnect={() => handleRecommendedConnect(provider)}
                  />
                ))}
              </div>
              
            </div>
          )}

          {/* Results Info */}
          <div className="mb-6 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              {filteredProviders.length} integration{filteredProviders.length !== 1 ? 's' : ''} 
              {selectedCategory !== 'All' && ` in ${selectedCategory}`}
              {searchQuery && ` matching "${searchQuery}"`}
            </div>
            {Object.keys(connections).length > 0 && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                <span>{Object.keys(connections).length} connected</span>
              </div>
            )}
          </div>

          {/* Integration Grid */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredProviders.length > 0 ? (
              filteredProviders.map((provider) => (
                <IntegrationChannelCard 
                  key={provider.id} 
                  provider={provider} 
                  connected={Boolean(connections[provider.id])} 
                />
              ))
            ) : (
              <div className="col-span-full rounded-xl border-2 border-dashed border-gray-300 bg-white p-16 text-center">
                <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center">
                  <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.674-2.64" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No integrations found</h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  {searchQuery 
                    ? `No integrations match "${searchQuery}". Try adjusting your search or filters.`
                    : `No integrations available in ${selectedCategory}. Try selecting a different category.`
                  }
                </p>
                {(searchQuery || selectedCategory !== 'All') && (
                  <button 
                    onClick={() => {
                      setSearchQuery('')
                      setSelectedCategory('All')
                    }}
                    className="inline-flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 transition-colors"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Clear filters
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <CommandPalette />

      {/* Global Connection Modal */}
      {showConnectionModal && (
        <ConnectionModal
          provider={providers.find(p => p.id === showConnectionModal)!}
          open={Boolean(showConnectionModal)}
          onClose={() => setShowConnectionModal(null)}
          onConfirm={handleModalConnect}
        />
      )}
    </div>
  )
}

function NavIcon({ icon: Icon, active = false }: { icon: React.ComponentType<any>; active?: boolean }) {
  return (
    <div className="flex h-14 w-14 items-center justify-center">
      <div className={`flex h-8 w-8 items-center justify-center rounded-full ${active ? 'bg-[#E1E5EA]' : ''}`}>
        <Icon className="h-5 w-5 text-black" />
      </div>
    </div>
  )
}

function RecommendedIntegrationCard({
  provider,
  connected,
  onConnect
}: {
  provider: any
  connected: boolean
  onConnect: () => void
}) {
  const getProviderIcon = (name: string) => {
    const iconMap: Record<string, string> = {
      'Slack': '💬',
      'Gong': '📞', 
      'HubSpot': '🟠'
    }
    return iconMap[name] || '🔗'
  }

  const getProviderBenefit = (name: string) => {
    const benefitMap: Record<string, string> = {
      'Slack': 'Team knowledge & Q&As',
      'Gong': 'Call intelligence & objections',
      'HubSpot': 'CRM data & deal insights'
    }
    return benefitMap[name] || provider.category
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 hover:border-gray-300 transition-all">
      <div className="flex items-center gap-3 mb-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-xl">
          {getProviderIcon(provider.name)}
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-semibold text-gray-900 mb-1">{provider.name}</h4>
          <p className="text-xs text-gray-600">{getProviderBenefit(provider.name)}</p>
        </div>
      </div>
      
      {connected ? (
        <div className="flex items-center gap-2 rounded-lg bg-green-50 border border-green-200 px-3 py-1.5 text-green-700">
          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span className="text-xs font-medium">Connected</span>
        </div>
      ) : (
        <button
          onClick={onConnect}
          className="w-full rounded-lg bg-gray-900 px-3 py-2 text-sm font-semibold text-white hover:bg-gray-800 transition-colors"
        >
          Connect
        </button>
      )}
    </div>
  )
}

function IntegrationChannelCard({ 
  provider, 
  connected 
}: { 
  provider: any; 
  connected: boolean 
}) {
  const { connect, disconnect } = useIntegrationsStore()
  const [loading, setLoading] = useState(false)
  const [showConfigure, setShowConfigure] = useState(false)
  const [showConnectionModal, setShowConnectionModal] = useState(false)

  const handleToggle = async () => {
    if (connected) {
      setLoading(true)
      await new Promise(r => setTimeout(r, 500))
      disconnect(provider.id)
      setLoading(false)
    } else {
      setShowConnectionModal(true)
    }
  }

  const handleConnect = () => {
    connect(provider.id, 'demo@company.com')
    setShowConnectionModal(false)
  }

  // Icon mapping for different providers
  const getProviderIcon = (name: string) => {
    const iconMap: Record<string, string> = {
      'Google Drive': '📧',
      'Salesforce': '⚡', 
      'Slack': '💬',
      'Microsoft Teams': '🔷',
      'Notion': '📝',
      'HubSpot': '🟠',
      'Zendesk': '📞',
      'Intercom': '💬',
      'Gong': '🎯',
      'SharePoint': '📁',
      'Confluence': '📚',
      'Highspot': '🎯',
      'Seismic': '📊',
      'Avoma': '🎥',
      'Zapier': '⚡'
    }
    return iconMap[name] || '🔗'
  }

  const getProviderDescription = (name: string, category: string) => {
    const descMap: Record<string, string> = {
      'Google Drive': 'Access and sync files from Google Drive',
      'Salesforce': 'Sync leads, contacts, and opportunities', 
      'Slack': 'Send notifications and updates to Slack channels',
      'Microsoft Teams': 'Collaborate and communicate via Teams',
      'Notion': 'Sync pages and databases from Notion workspace',
      'HubSpot': 'Manage contacts, deals, and marketing campaigns',
      'Zendesk': 'Sync support tickets and customer interactions',
      'Intercom': 'Connect customer conversations and support data',
      'Gong': 'Analyze sales calls and conversation insights',
      'SharePoint': 'Access documents and files from SharePoint',
      'Confluence': 'Sync documentation and knowledge base content',
      'Highspot': 'Access sales enablement content and analytics',
      'Seismic': 'Manage sales content and buyer engagement',
      'Avoma': 'Capture and analyze meeting insights',
      'Zapier': 'Automate workflows between different apps'
    }
    return descMap[name] || `${category} integration for enhanced workflow`
  }

  return (
    <div className="group rounded-xl border border-gray-200 bg-white p-4 hover:border-gray-300 transition-all duration-200">
      {/* Header with toggle */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3 flex-1">
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gray-100 text-2xl">
            {getProviderIcon(provider.name)}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold text-gray-900 mb-1 truncate">{provider.name}</h3>
            <p className="text-sm text-gray-600 line-clamp-2">{getProviderDescription(provider.name, provider.category)}</p>
          </div>
        </div>
        <button
          onClick={handleToggle}
          disabled={loading}
          className={`relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 disabled:opacity-50 ml-3 ${
            connected ? 'bg-gray-900' : 'bg-gray-300'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-all duration-200 ${
              connected ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>

      {/* Bottom actions */}
      <div className="flex items-center justify-between">
        {/* Documentation link */}
        <button 
          onClick={() => window.open(provider.website || '#', '_blank')}
          className="flex items-center justify-center rounded-lg bg-gray-100 p-2 text-gray-700 hover:bg-gray-200 transition-colors"
          title="View documentation"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </button>
        
        {/* Configure button - only show when connected */}
        {connected && (
          <button 
            onClick={() => setShowConfigure(true)}
            className="flex items-center justify-center rounded-lg bg-gray-100 p-2 text-gray-700 hover:bg-gray-200 transition-colors"
            title="Configure integration"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        )}
      </div>

      {/* Configure Drawer - uses existing system */}
      <ConfigureDrawer 
        provider={provider} 
        open={showConfigure} 
        onClose={() => setShowConfigure(false)} 
      />

      {/* Connection Modal */}
      <ConnectionModal
        provider={provider}
        open={showConnectionModal}
        onClose={() => setShowConnectionModal(false)}
        onConfirm={handleConnect}
      />
    </div>
  )
}