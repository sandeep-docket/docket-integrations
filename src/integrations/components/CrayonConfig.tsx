import { useState } from 'react'
import { useIntegrationsStore } from '../store'
import { ContentSelectionTable } from './ContentSelectionTable'
import type { ContentItem, ColumnConfig } from './ContentSelectionTable'
import { ConfigurationHeader } from './ConfigurationHeader'
import { ConfigurationFooter } from './ConfigurationFooter'


export function CrayonConfigPanel({ onClose }: { onClose: () => void }) {
  const { connections } = useIntegrationsStore()
  const isAlreadyConnected = Boolean(connections['crayon'])
  
  const [isConnected, setIsConnected] = useState(isAlreadyConnected)
  const [isConnecting, setIsConnecting] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState<'all' | string>('all')
  
  const [content, setContent] = useState<ContentItem[]>([
    { id: 'c1', name: 'Competitor A Battle Card', type: 'battlecard', competitor: 'Competitor A', lastUpdated: '2 days ago', status: 'active', isSelected: true },
    { id: 'c2', name: 'Market Intelligence Q1', type: 'intelligence', competitor: 'Market Analysis', lastUpdated: '1 week ago', status: 'active', isSelected: true },
    { id: 'c3', name: 'Competitor B Positioning', type: 'positioning', competitor: 'Competitor B', lastUpdated: '3 days ago', status: 'active', isSelected: true },
    { id: 'c4', name: 'Competitor C Analysis', type: 'analysis', competitor: 'Competitor C', lastUpdated: '1 day ago', status: 'active', isSelected: false },
    { id: 'c5', name: 'Industry Trends Report', type: 'intelligence', competitor: 'Industry', lastUpdated: '5 days ago', status: 'active', isSelected: true },
    { id: 'c6', name: 'Competitor D Battle Card', type: 'battlecard', competitor: 'Competitor D', lastUpdated: '1 week ago', status: 'draft', isSelected: false },
    { id: 'c7', name: 'Pricing Comparison Analysis', type: 'analysis', competitor: 'Multi-Competitor', lastUpdated: '4 days ago', status: 'active', isSelected: true },
  ])

  const columns: ColumnConfig[] = [
    { key: 'name', label: 'Content', width: 4 },
    { key: 'competitor', label: 'Competitor', width: 3 },
    { key: 'type', label: 'Type', width: 2, render: (item) => <span className="text-xs text-gray-600 capitalize">{item.type}</span> },
    { key: 'lastUpdated', label: 'Updated', width: 2, render: (item) => <span className="text-xs text-gray-500">{item.lastUpdated}</span> },
    { key: 'select', label: 'Select', width: 1 }
  ]

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
  }

  const save = () => {
    const { configure } = useIntegrationsStore.getState()
    configure('crayon', { 
      selectedContent: content.filter(c => c.isSelected),
      credentials: { email, password },
      lastUpdated: new Date().toISOString()
    })
    onClose()
  }

  const filteredContent = content.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.competitor.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = typeFilter === 'all' || item.type === typeFilter
    return matchesSearch && matchesType
  })



  if (!isConnected) {
    return (
      <div className="flex h-full flex-col bg-white rounded-xl overflow-hidden">
        <div className="border-b border-gray-200 px-6 py-6">
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-gray-800 to-gray-900">
              <span className="text-sm font-bold text-white">C</span>
            </div>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-gray-900">Connect Crayon</h1>
              <p className="text-gray-600 mt-0.5 text-sm">Connect your Crayon account</p>
            </div>
            <button onClick={onClose} className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-sm">
            <div className="text-center mb-6">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 mx-auto mb-4">
                <span className="text-3xl">🖍️</span>
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Connect Crayon</h2>
              <p className="text-gray-600 mb-6">
                Enter your Crayon credentials to access competitive intelligence and battle cards.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your-email@company.com"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
                />
              </div>
              <button
                onClick={handleConnect}
                disabled={!email || !password || isConnecting}
                className="w-full rounded-xl bg-gray-900 px-6 py-3 text-sm font-semibold text-white hover:bg-gray-800 disabled:opacity-50 transition-colors"
              >
                {isConnecting ? 'Connecting...' : 'Connect to Crayon'}
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col bg-white rounded-xl overflow-hidden">
      <ConfigurationHeader
        providerId="crayon"
        providerName="Crayon"
        title="Crayon Configuration"
        subtitle="Select competitive intelligence content"
        onClose={onClose}
      />

      <div className="flex-1 overflow-y-auto p-6">
        <ContentSelectionTable
          items={filteredContent}
          columns={columns}
          onItemToggle={toggleContent}
          title="Competitive Intelligence Content"
          searchPlaceholder="Search content..."
          selectedLabel="items selected for ingestion"
          emptyMessage={searchQuery ? `No content matches "${searchQuery}"` : typeFilter !== 'all' ? `No ${typeFilter} content available` : "No content available"}
          filters={[
            {
              key: 'type',
              label: 'Content Type',
              options: [
                { value: 'all', label: 'All Types' },
                { value: 'battlecard', label: 'Battle Cards' },
                { value: 'intelligence', label: 'Intelligence' },
                { value: 'positioning', label: 'Positioning' },
                { value: 'analysis', label: 'Analysis' }
              ],
              value: typeFilter
            }
          ]}
          onFilter={(_, value) => setTypeFilter(value)}
          showReset={true}
          onReset={() => {
            setSearchQuery('')
            setTypeFilter('all')
          }}
        />
      </div>

      <ConfigurationFooter
        onClose={onClose}
        onSave={save}
        helpText="Crayon integration help"
      />
    </div>
  )
}
