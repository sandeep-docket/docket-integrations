import { useState } from 'react'
import { useIntegrationsStore } from '../store'
import { ContentSelectionTable } from './ContentSelectionTable'
import type { ContentItem, ColumnConfig } from './ContentSelectionTable'
import { ConfigurationHeader } from './ConfigurationHeader'
import { ConfigurationFooter } from './ConfigurationFooter'
import { IntegrationAvatar } from './IntegrationAvatar'


export function SeismicConfigPanel({ onClose }: { onClose: () => void }) {
  const { connections } = useIntegrationsStore()
  const isAlreadyConnected = Boolean(connections['seismic'])
  
  const [isConnected, setIsConnected] = useState(isAlreadyConnected)
  const [isConnecting, setIsConnecting] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'official' | 'unofficial'>('all')
  
  const [content, setContent] = useState<ContentItem[]>([
    { id: 'content1', name: 'Sales Enablement', description: 'Core sales enablement materials and resources', lastModified: '1 day ago', contentCount: 78, isOfficial: true, isSelected: true },
    { id: 'content2', name: 'Product Training', description: 'Product knowledge and training materials', lastModified: '2 days ago', contentCount: 45, isOfficial: true, isSelected: true },
    { id: 'content3', name: 'Competitive Battlecards', description: 'Competitive intelligence and positioning', lastModified: '3 days ago', contentCount: 32, isOfficial: true, isSelected: true },
    { id: 'content4', name: 'Customer Success Stories', description: 'Case studies and customer testimonials', lastModified: '1 week ago', contentCount: 23, isOfficial: true, isSelected: true },
    { id: 'content5', name: 'Proposal Templates', description: 'Standardized proposal and contract templates', lastModified: '5 days ago', contentCount: 19, isOfficial: true, isSelected: false },
    { id: 'content6', name: 'Demo Scripts', description: 'Product demonstration scripts and guides', lastModified: '4 days ago', contentCount: 34, isOfficial: true, isSelected: true },
    { id: 'content7', name: 'Objection Handling', description: 'Common objections and response strategies', lastModified: '2 weeks ago', contentCount: 28, isOfficial: true, isSelected: false },
    { id: 'content8', name: 'Industry Solutions', description: 'Industry-specific solutions and use cases', lastModified: '1 day ago', contentCount: 56, isOfficial: true, isSelected: true },
  ])

  const columns: ColumnConfig[] = [
    { key: 'name', label: 'Content', width: 3 },
    { key: 'description', label: 'Description', width: 5 },
    { 
      key: 'isOfficial', 
      label: 'Official Status', 
      width: 2,
      render: (item) => (
        <input
          type="checkbox"
          checked={item.isOfficial}
          readOnly
          className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        />
      )
    },
    { key: 'select', label: 'Mark for ingestion', width: 2 }
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
    configure('seismic', { 
      selectedContent: content.filter(c => c.isSelected),
      lastUpdated: new Date().toISOString()
    })
    onClose()
  }

  const filteredContent = content.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (item.description?.toLowerCase().includes(searchQuery.toLowerCase()) || false)
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'official' && item.isOfficial) ||
                         (statusFilter === 'unofficial' && !item.isOfficial)
    return matchesSearch && matchesStatus
  })

  if (!isConnected) {
    return (
      <div className="flex h-full flex-col bg-white rounded-xl overflow-hidden">
        <ConfigurationHeader
          providerId="seismic"
          providerName="Seismic"
          title="Connect Seismic"
          subtitle="Connect your Seismic account"
          onClose={onClose}
        />

        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center max-w-sm">
            <div className="mx-auto mb-6">
              <IntegrationAvatar 
                providerId="seismic"
                providerName="Seismic"
                size="lg"
                className="h-16 w-16 mx-auto"
              />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Connect your Seismic account</h2>
            <p className="text-gray-600 mb-8">
              Access sales enablement content to enhance Sales Knowledge Lake with proven materials.
            </p>
            <button
              onClick={handleConnect}
              disabled={isConnecting}
              className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-6 py-3 text-sm font-semibold text-white hover:bg-gray-800 disabled:opacity-50 transition-colors min-w-[140px]"
            >
              {isConnecting ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>Connecting...</span>
                </>
              ) : (
                'Connect to Seismic'
              )}
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col bg-white rounded-xl overflow-hidden">
      <ConfigurationHeader
        providerId="seismic"
        providerName="Seismic"
        title="Seismic Configuration"
        subtitle="Select content for ingestion"
        onClose={onClose}
      />

      <div className="flex-1 overflow-y-auto p-6">
        <ContentSelectionTable
          items={filteredContent}
          columns={columns}
          onItemToggle={toggleContent}
          title="Select Content"
          searchPlaceholder="Search here"
          selectedLabel="content selected for ingestion"
          emptyMessage={searchQuery ? `No content matches "${searchQuery}"` : "No content available"}
          filters={[
            {
              key: 'status',
              label: 'Official Status',
              options: [
                { value: 'all', label: 'All' },
                { value: 'official', label: 'Official' },
                { value: 'unofficial', label: 'Unofficial' }
              ],
              value: statusFilter
            }
          ]}
          onFilter={(_, value) => setStatusFilter(value as any)}
          showReset={true}
          onReset={() => {
            setSearchQuery('')
            setStatusFilter('all')
          }}
        />
      </div>

      <ConfigurationFooter
        onClose={onClose}
        onSave={save}
        helpText="Seismic integration help"
        saveVariant="blue"
        saveText="Save"
      />
    </div>
  )
}
