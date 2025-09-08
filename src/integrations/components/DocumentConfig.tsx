import { useState, Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { useIntegrationsStore } from '../store'
import type { IntegrationProvider } from '../types'

type DocumentItem = {
  id: string
  name: string
  type: 'file' | 'page' | 'database' | 'site' | 'list' | 'library'
  path: string
  size?: string
  lastModified: string
  isSelected: boolean
  icon: string
  url?: string
  accountId: string
  accountName: string
}

type ConnectedAccount = {
  id: string
  email: string
  name: string
  isActive: boolean
  connectedAt: string
}

type DocumentSettings = {
  selectedItems: string[]
  activeAccount: string
}

// Configuration for different document platforms
const getProviderConfig = (providerId: string) => {
  const configs = {
    'google-drive': {
      name: 'Google Drive',
      icon: '📁',
      itemName: 'files',
      supportedTypes: ['Documents', 'Spreadsheets', 'Presentations', 'PDFs', 'Images'],
      mockAccounts: [
        { id: 'acc1', email: 'john.doe@company.com', name: 'John Doe', isActive: true, connectedAt: '2024-01-15' },
        { id: 'acc2', email: 'sales@company.com', name: 'Sales Team', isActive: false, connectedAt: '2024-01-10' }
      ],
      mockItems: [
        { id: '1', name: 'Sales Playbook 2024.pdf', type: 'file' as const, path: '/Sales/Playbooks', size: '2.4 MB', lastModified: '2 days ago', isSelected: true, icon: '📄', url: 'https://drive.google.com/...', accountId: 'acc1', accountName: 'john.doe@company.com' },
        { id: '2', name: 'Product Demo Script.docx', type: 'file' as const, path: '/Marketing/Content', size: '156 KB', lastModified: '1 week ago', isSelected: true, icon: '📄', accountId: 'acc1', accountName: 'john.doe@company.com' },
        { id: '3', name: 'Competitive Analysis Q1.xlsx', type: 'file' as const, path: '/Sales/Research', size: '1.8 MB', lastModified: '3 days ago', isSelected: false, icon: '📊', accountId: 'acc1', accountName: 'john.doe@company.com' },
        { id: '4', name: 'Customer Success Stories.pptx', type: 'file' as const, path: '/Marketing/Case Studies', size: '12 MB', lastModified: '5 days ago', isSelected: true, icon: '📊', accountId: 'acc1', accountName: 'john.doe@company.com' },
        { id: '5', name: 'Pricing Strategy 2024.pdf', type: 'file' as const, path: '/Strategy/Pricing', size: '890 KB', lastModified: '1 day ago', isSelected: false, icon: '📈', accountId: 'acc1', accountName: 'john.doe@company.com' },
        { id: '6', name: 'Sales Targets Q2.xlsx', type: 'file' as const, path: '/Sales/Planning', size: '445 KB', lastModified: '1 week ago', isSelected: true, icon: '📊', accountId: 'acc2', accountName: 'sales@company.com' },
        { id: '7', name: 'Onboarding Guide.pdf', type: 'file' as const, path: '/HR/Training', size: '3.2 MB', lastModified: '2 weeks ago', isSelected: false, icon: '📄', accountId: 'acc2', accountName: 'sales@company.com' },
      ]
    },
    'sharepoint': {
      name: 'SharePoint',
      icon: '📚',
      itemName: 'sites and lists',
      supportedTypes: ['Document Libraries', 'Lists', 'Pages', 'News'],
      mockAccounts: [
        { id: 'sp-acc1', email: 'admin@company.onmicrosoft.com', name: 'Company Admin', isActive: true, connectedAt: '2024-01-12' }
      ],
      mockItems: [
        { id: 'site1', name: 'Sales Team Site', type: 'site' as const, path: '/sites/sales', size: '2.4 GB', lastModified: '1 day ago', isSelected: true, icon: '🏢', accountId: 'sp-acc1', accountName: 'admin@company.onmicrosoft.com', url: 'https://company.sharepoint.com/sites/sales' },
        { id: 'site2', name: 'Marketing Hub', type: 'site' as const, path: '/sites/marketing', size: '1.8 GB', lastModified: '2 days ago', isSelected: true, icon: '📢', accountId: 'sp-acc1', accountName: 'admin@company.onmicrosoft.com', url: 'https://company.sharepoint.com/sites/marketing' },
        { id: 'site3', name: 'Product Documentation', type: 'site' as const, path: '/sites/product', size: '890 MB', lastModified: '1 week ago', isSelected: false, icon: '📋', accountId: 'sp-acc1', accountName: 'admin@company.onmicrosoft.com', url: 'https://company.sharepoint.com/sites/product' },
        { id: 'list1', name: 'Customer Feedback', type: 'list' as const, path: '/sites/sales/Lists', size: '45 MB', lastModified: '3 days ago', isSelected: true, icon: '📝', accountId: 'sp-acc1', accountName: 'admin@company.onmicrosoft.com' },
        { id: 'list2', name: 'Competitive Analysis', type: 'list' as const, path: '/sites/marketing/Lists', size: '23 MB', lastModified: '5 days ago', isSelected: false, icon: '📊', accountId: 'sp-acc1', accountName: 'admin@company.onmicrosoft.com' },
        { id: 'lib1', name: 'Sales Playbooks', type: 'library' as const, path: '/sites/sales/Shared Documents', size: '156 MB', lastModified: '2 days ago', isSelected: true, icon: '📚', accountId: 'sp-acc1', accountName: 'admin@company.onmicrosoft.com' },
        { id: 'lib2', name: 'Training Materials', type: 'library' as const, path: '/sites/hr/Documents', size: '234 MB', lastModified: '1 week ago', isSelected: false, icon: '🎓', accountId: 'sp-acc1', accountName: 'admin@company.onmicrosoft.com' },
      ]
    },
    'notion': {
      name: 'Notion',
      icon: '📝',
      itemName: 'pages and databases',
      supportedTypes: ['Pages', 'Databases', 'Templates'],
      isNotionStyle: true,
      mockAccounts: [
        { id: 'n-acc1', email: 'team@company.com', name: 'Company Workspace', isActive: true, connectedAt: '2024-01-08' }
      ],
      mockItems: [
        { id: 'n1', name: 'Product Roadmap', type: 'database' as const, path: '/Product Team', size: '—', lastModified: '1 hour ago', isSelected: true, icon: '🗂️', accountId: 'n-acc1', accountName: 'team@company.com' },
        { id: 'n2', name: 'Sales Methodology', type: 'page' as const, path: '/Sales Team', size: '—', lastModified: '2 days ago', isSelected: true, icon: '📄', accountId: 'n-acc1', accountName: 'team@company.com' },
        { id: 'n3', name: 'Customer Success Playbook', type: 'page' as const, path: '/CS Team', size: '—', lastModified: '1 week ago', isSelected: false, icon: '📖', accountId: 'n-acc1', accountName: 'team@company.com' },
        { id: 'n4', name: 'Competitive Intelligence', type: 'database' as const, path: '/Strategy', size: '—', lastModified: '3 days ago', isSelected: true, icon: '🔍', accountId: 'n-acc1', accountName: 'team@company.com' },
        { id: 'n5', name: 'Onboarding Guide', type: 'page' as const, path: '/HR/Training', size: '—', lastModified: '2 weeks ago', isSelected: true, icon: '📚', accountId: 'n-acc1', accountName: 'team@company.com' },
        { id: 'n6', name: 'Meeting Notes Template', type: 'page' as const, path: '/Templates', size: '—', lastModified: '1 month ago', isSelected: false, icon: '📝', accountId: 'n-acc1', accountName: 'team@company.com' },
      ]
    }
  }
  return configs[providerId as keyof typeof configs] || configs['google-drive']
}

export function DocumentConfigPanel({ provider, onClose }: { provider: IntegrationProvider; onClose: () => void }) {
  const configure = useIntegrationsStore((s) => s.configure)
  const { connections } = useIntegrationsStore()
  const isAlreadyConnected = Boolean(connections[provider.id])
  
  const [isConnected, setIsConnected] = useState(isAlreadyConnected)
  const [isConnecting, setIsConnecting] = useState(false)
  const [showBrowser, setShowBrowser] = useState(false)
  const [showDisconnectModal, setShowDisconnectModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [advancedMode, setAdvancedMode] = useState(false)
  
  const config = getProviderConfig(provider.id)
  const [accounts] = useState<ConnectedAccount[]>(config.mockAccounts || [])
  const [items, setItems] = useState<DocumentItem[]>(config.mockItems)
  const [settings, setSettings] = useState<DocumentSettings>({
    selectedItems: items.filter(item => item.isSelected).map(item => item.id),
    activeAccount: accounts.find(acc => acc.isActive)?.id || ''
  })

  const handleConnect = async () => {
    setIsConnecting(true)
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsConnected(true)
    setIsConnecting(false)
  }

  const toggleItemSelection = (itemId: string) => {
    setItems(prev => prev.map(item => 
      item.id === itemId ? { ...item, isSelected: !item.isSelected } : item
    ))
    setSettings(prev => ({
      ...prev,
      selectedItems: prev.selectedItems.includes(itemId)
        ? prev.selectedItems.filter(id => id !== itemId)
        : [...prev.selectedItems, itemId]
    }))
  }

  const save = () => {
    configure(provider.id, { 
      settings, 
      selectedItems: items.filter(item => item.isSelected),
      totalItems: items.length 
    })
    onClose()
  }

  if (!isConnected) {
    return (
      <div className="flex h-full flex-col bg-white rounded-xl overflow-hidden">
        {/* Header */}
        <div className="border-b border-gray-200 px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 shadow-lg">
                <span className="text-sm font-bold text-white">{config.name[0]}</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Connect {config.name}</h1>
                <p className="text-gray-600 mt-0.5 text-sm">Connect your {config.name} account to Docket</p>
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
              <span className="text-3xl">{config.icon}</span>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Connect your {config.name} account</h2>
            <p className="text-gray-600 mb-6">
              Give Docket access to your {config.itemName} to power the Sales Knowledge Lake with relevant content and documents.
            </p>
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="text-sm font-medium text-gray-900 mb-1">Connecting as:</div>
              <div className="text-sm text-gray-600">demo.user@company.com</div>
            </div>
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
                  Connect to {config.name}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    )
  }

  const activeAccount = accounts.find(acc => acc.isActive)
  const selectedItems = items.filter(item => item.isSelected)
  const filteredItems = items.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.path.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="flex h-full flex-col bg-white rounded-xl overflow-hidden">
      {/* Header */}
      <div className="border-b border-gray-200 px-6 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 shadow-lg">
              <span className="text-sm font-bold text-white">{config.name[0]}</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">{config.name} Configuration</h1>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-gray-600 text-sm">Connected as {activeAccount?.email}</p>
                <button 
                  onClick={() => setShowDisconnectModal(true)}
                  className="text-xs text-red-600 hover:text-red-800 font-medium"
                >
                  Disconnect
                </button>
              </div>
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
      <div className="flex-1 flex">
        {/* File List */}
        <div className="flex-1 flex flex-col">
          {/* Search and Controls */}
          <div className="border-b border-gray-100 px-6 py-4">
            <div className="flex items-center justify-between mb-4">
              <div className="relative flex-1 max-w-md">
                <svg className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search files..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-white pl-10 pr-4 py-2.5 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
              <div className="flex items-center gap-3">
                {/* Mode Toggle */}
                <div className="flex rounded-lg bg-gray-100 p-1">
                  <button
                    onClick={() => setAdvancedMode(false)}
                    className={`rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
                      !advancedMode
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    Files
                  </button>
                  <button
                    onClick={() => setAdvancedMode(true)}
                    className={`rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
                      advancedMode
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    Folders
                  </button>
                </div>
                <button
                  onClick={() => setShowBrowser(true)}
                  className="inline-flex items-center justify-center rounded-lg bg-gray-900 p-2.5 text-white hover:bg-gray-800 transition-colors"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="text-sm text-gray-600">
              {searchQuery ? (
                filteredItems.filter(i => i.isSelected).length > 0 ? 
                  `${filteredItems.filter(i => i.isSelected).length} item${filteredItems.filter(i => i.isSelected).length !== 1 ? 's' : ''} found` :
                  'No matches found'
              ) : (
                `${selectedItems.length} ${advancedMode ? 'folders' : 'files'} selected`
              )}
            </div>
          </div>

          {/* Files List */}
          <div className="flex-1 overflow-y-auto">
            {searchQuery ? (
              // Search results
              <div className="p-6">
                {filteredItems.filter(i => i.isSelected).length > 0 ? (
                  <div className="space-y-2">
                    {filteredItems.filter(i => i.isSelected).map((item) => (
                      <FileListItem
                        key={item.id}
                        item={item}
                        onRemove={() => toggleItemSelection(item.id)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="text-gray-500 mb-2">We couldn't find anything for "{searchQuery}"</div>
                  </div>
                )}
              </div>
            ) : (
              // Account grouped view
              <div className="flex-1">
                {accounts.map(account => {
                  const accountItems = items.filter(item => item.accountId === account.id && item.isSelected)
                  
                  return (
                    <div key={account.id} className="border-b border-gray-100">
                      <button className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                        <div className="flex items-center gap-3">
                          <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                          <div className="text-left">
                            <div className="text-sm font-medium text-gray-900">{account.email}</div>
                            <div className="text-xs text-gray-500">
                              {account.isActive ? '' : '(disconnected)'} 
                            </div>
                          </div>
                        </div>
                        <div className="text-xs text-gray-500">{accountItems.length} items</div>
                      </button>
                      
                      <div className="px-6 pb-4">
                        <div className="space-y-2 ml-7">
                          {accountItems.map((item) => (
                            <FileListItem
                              key={item.id}
                              item={item}
                              onRemove={() => toggleItemSelection(item.id)}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  )
                })}
                
                {selectedItems.length === 0 && (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <div className="text-gray-500 mb-2">No items selected</div>
                      <button
                        onClick={() => setShowBrowser(true)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        Browse {config.name}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Account Sidebar removed */}
      </div>

      {/* Content Ingestion Notice */}
      {selectedItems.length > 0 && provider.id === 'sharepoint' && (
        <div className="border-t border-gray-100 bg-blue-50 px-6 py-4">
          <div className="flex items-start gap-3">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600">
              <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-blue-900">Content Ingestion Process</p>
              <p className="text-xs text-blue-700 mt-1">
                Once you save, content ingestion will begin automatically. 
                It may take up to 24 hours for data to be available for answer generation within Docket.
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
            {config.name} integration help
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
              {provider.id === 'sharepoint' ? 'Save & Start Ingestion' : 'Save Configuration'}
            </button>
          </div>
        </div>
      </div>

      {/* Document Browser Modal */}
      {showBrowser && (
        <DocumentBrowser
          config={config}
          items={items}
          onClose={() => setShowBrowser(false)}
          onSelectionChange={setItems}
        />
      )}

      {/* Disconnect Modal */}
      {showDisconnectModal && (
        <DisconnectModal
          providerName={config.name}
          selectedItemsCount={selectedItems.length}
          onClose={() => setShowDisconnectModal(false)}
          onConfirm={(keepItems) => {
            if (!keepItems) {
              setItems(prev => prev.map(item => ({ ...item, isSelected: false })))
            }
            setShowDisconnectModal(false)
            onClose()
          }}
        />
      )}
    </div>
  )
}

function FileListItem({ 
  item, 
  onRemove
}: { 
  item: DocumentItem
  onRemove: () => void
}) {
  const getItemTypeColor = (item: DocumentItem) => {
    switch (item.type) {
      case 'site': return 'bg-blue-500'
      case 'list': return 'bg-green-500'
      case 'library': return 'bg-purple-500'
      case 'database': return 'bg-indigo-500'
      case 'page': return 'bg-gray-500'
      default:
        const ext = item.name.split('.').pop()?.toLowerCase()
        switch (ext) {
          case 'pdf': return 'bg-red-500'
          case 'docx':
          case 'doc': return 'bg-blue-500'
          case 'xlsx':
          case 'xls': return 'bg-green-500'
          case 'pptx':
          case 'ppt': return 'bg-orange-500'
          default: return 'bg-gray-500'
        }
    }
  }

  const getItemTypeLabel = (item: DocumentItem) => {
    switch (item.type) {
      case 'site': return 'SITE'
      case 'list': return 'LIST'
      case 'library': return 'LIB'
      case 'database': return 'DB'
      case 'page': return 'PAGE'
      default:
        const ext = item.name.split('.').pop()?.toLowerCase()
        switch (ext) {
          case 'pdf': return 'PDF'
          case 'docx':
          case 'doc': return 'DOC'
          case 'xlsx':
          case 'xls': return 'XLS'
          case 'pptx':
          case 'ppt': return 'PPT'
          default: return 'FILE'
        }
    }
  }

  return (
    <div className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-gray-50 group transition-colors">
      <div className={`flex h-8 w-8 items-center justify-center rounded text-xs font-bold text-white ${getItemTypeColor(item)}`}>
        {getItemTypeLabel(item)}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-gray-900 truncate">{item.name}</div>
        <div className="text-xs text-gray-500 flex items-center gap-1">
          <span className="flex items-center gap-1">
            <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
              <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
            </svg>
            {item.accountName.split('@')[0]}
          </span>
          {item.size && (
            <>
              <span>•</span>
              <span>{item.size}</span>
            </>
          )}
        </div>
      </div>
      <button 
        onClick={onRemove}
        className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-600 rounded transition-all"
        title="Remove from sync"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </div>
  )
}

function DisconnectModal({
  providerName,
  selectedItemsCount,
  onClose,
  onConfirm
}: {
  providerName: string
  selectedItemsCount: number
  onClose: () => void
  onConfirm: (keepItems: boolean) => void
}) {
  const [keepItems, setKeepItems] = useState(true)

  return (
    <Transition appear show as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <div className="fixed inset-0 bg-black/40" />
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-xl bg-white shadow-2xl transition-all">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Disconnect {providerName}</h3>
                <p className="text-sm text-gray-600 mb-4">Choose what happens to your synced items</p>
                
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <div className="text-sm font-medium text-gray-900 mb-1">{selectedItemsCount} items have been ingested</div>
                  <div className="text-xs text-gray-600">Source: sam@yc.com</div>
                </div>

                <div className="mb-6">
                  <div className="text-sm font-medium text-gray-900 mb-3">What would you like to do?</div>
                  
                  <div className="space-y-3">
                    <label className="flex items-start gap-3 cursor-pointer p-4 rounded-lg bg-green-50 border border-green-200 transition-colors">
                      <input
                        type="radio"
                        checked={keepItems}
                        onChange={() => setKeepItems(true)}
                        className="h-4 w-4 text-green-600 border-gray-300 focus:ring-green-500 mt-0.5"
                      />
                      <div>
                        <div className="text-sm font-medium text-gray-900">Keep items in Docket</div>
                        <div className="text-xs text-gray-600 mt-1">
                          Your items will remain accessible in Docket. The integration can be reconnected at any time.
                        </div>
                      </div>
                    </label>
                    <label className="flex items-start gap-3 cursor-pointer p-4 rounded-lg bg-amber-50 border border-amber-200 transition-colors">
                      <input
                        type="radio"
                        checked={!keepItems}
                        onChange={() => setKeepItems(false)}
                        className="h-4 w-4 text-amber-600 border-gray-300 focus:ring-amber-500 mt-0.5"
                      />
                      <div>
                        <div className="text-sm font-medium text-gray-900">Remove items from Docket</div>
                        <div className="text-xs text-gray-600 mt-1">
                          All synchronized items will be permanently removed from Docket. Original files from the source will remain unaffected.
                        </div>
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3">
                <button 
                  onClick={onClose}
                  className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => onConfirm(keepItems)}
                  className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 transition-colors"
                >
                  Disconnect
                </button>
              </div>
            </Dialog.Panel>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}

function DocumentBrowser({ 
  config, 
  items, 
  onClose, 
  onSelectionChange 
}: { 
  config: any
  items: DocumentItem[]
  onClose: () => void
  onSelectionChange: (items: DocumentItem[]) => void
}) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedInBrowser, setSelectedInBrowser] = useState<string[]>(
    items.filter(item => item.isSelected).map(item => item.id)
  )
  
  const filteredItems = items.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.path.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const toggleItem = (itemId: string) => {
    setSelectedInBrowser(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    )
  }

  const handleSave = () => {
    const updatedItems = items.map(item => ({
      ...item,
      isSelected: selectedInBrowser.includes(item.id)
    }))
    onSelectionChange(updatedItems)
    onClose()
  }

  return (
    <Transition appear show as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <div className="fixed inset-0 bg-black/25" />
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white shadow-2xl transition-all">
              {/* Browser Header */}
              <div className="border-b border-gray-200 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Browse {config.name}</h3>
                    <p className="text-sm text-gray-600">Select {config.itemName} to add to Sales Knowledge Lake</p>
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

              {/* Search */}
              <div className="px-6 py-4 border-b border-gray-100">
                <div className="relative">
                  <svg className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    placeholder={`Search ${config.itemName}...`}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 bg-white pl-10 pr-4 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
                  />
                </div>
              </div>

              {/* Items List */}
              <div className="max-h-96 overflow-y-auto">
                <div className="divide-y divide-gray-100">
                  {filteredItems.map((item) => (
                    <label key={item.id} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 cursor-pointer transition-colors">
                      <input
                        type="checkbox"
                        checked={selectedInBrowser.includes(item.id)}
                        onChange={() => toggleItem(item.id)}
                        className="h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                      />
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-sm">
                        {item.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-900 truncate">{item.name}</div>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <span>{item.path}</span>
                          {item.size && (
                            <>
                              <span>•</span>
                              <span>{item.size}</span>
                            </>
                          )}
                          <span>•</span>
                          <span>{item.lastModified}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                          item.type === 'database' ? 'bg-purple-100 text-purple-800' :
                          item.type === 'page' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {item.type}
                        </span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Browser Footer */}
              <div className="border-t border-gray-200 bg-gray-50 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    {selectedInBrowser.length} of {items.length} items selected
                  </div>
                  <div className="flex gap-3">
                    <button 
                      onClick={onClose}
                      className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={handleSave}
                      className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 transition-colors"
                    >
                      Save Selection
                    </button>
                  </div>
                </div>
              </div>
            </Dialog.Panel>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}
