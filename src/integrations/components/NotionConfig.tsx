import { useState } from 'react'
import { useIntegrationsStore } from '../store'

type NotionPage = {
  id: string
  name: string
  type: 'page' | 'database'
  path: string
  lastModified: string
  icon: string
  isConnected: boolean
}

export function NotionConfigPanel({ onClose }: { onClose: () => void }) {
  const { connections } = useIntegrationsStore()
  const isAlreadyConnected = Boolean(connections['notion'])
  
  const [isConnected, setIsConnected] = useState(isAlreadyConnected)
  const [isConnecting, setIsConnecting] = useState(false)
  
  const [pages] = useState<NotionPage[]>([
    { id: 'n1', name: 'Product Roadmap', type: 'database', path: '/Product Team', lastModified: '1 hour ago', icon: '🗂️', isConnected: true },
    { id: 'n2', name: 'Sales Methodology', type: 'page', path: '/Sales Team', lastModified: '2 days ago', icon: '📄', isConnected: true },
    { id: 'n3', name: 'Customer Success Playbook', type: 'page', path: '/CS Team', lastModified: '1 week ago', icon: '📖', isConnected: false },
    { id: 'n4', name: 'Competitive Intelligence', type: 'database', path: '/Strategy', lastModified: '3 days ago', icon: '🔍', isConnected: true },
    { id: 'n5', name: 'Onboarding Guide', type: 'page', path: '/HR/Training', lastModified: '2 weeks ago', icon: '📚', isConnected: true },
  ])

  const handleConnect = async () => {
    setIsConnecting(true)
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsConnected(true)
    setIsConnecting(false)
  }


  if (!isConnected) {
    return (
      <div className="flex h-full flex-col bg-white rounded-xl overflow-hidden">
        {/* Header */}
        <div className="border-b border-gray-200 px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 shadow-lg">
                <span className="text-sm font-bold text-white">N</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Connect Notion</h1>
                <p className="text-gray-600 mt-0.5 text-sm">Connect your Notion workspace to Docket</p>
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
              <span className="text-3xl">📝</span>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Connect your Notion workspace</h2>
            <p className="text-gray-600 mb-8">
              Give Docket access to your pages and databases to power the Sales Knowledge Lake with your team's knowledge.
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
                  Connect to Notion
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    )
  }

  const connectedPages = pages.filter(p => p.isConnected)

  return (
    <div className="flex h-full flex-col bg-white rounded-xl overflow-hidden">
      {/* Header */}
      <div className="border-b border-gray-200 px-6 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 shadow-lg">
              <span className="text-sm font-bold text-white">N</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Notion Configuration</h1>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-gray-600 text-sm">Connected as team@company.com</p>
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
      <div className="flex-1 overflow-y-auto p-6">
        <div className="space-y-6">
          {/* Info Banner */}
          <div className="rounded-lg bg-blue-50 border border-blue-200 p-4">
            <div className="flex items-start gap-3">
              <svg className="h-5 w-5 text-blue-600 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h4 className="text-sm font-semibold text-blue-900">Page Management in Notion</h4>
                <p className="text-xs text-blue-700 mt-1">
                  Adding and removing pages is done within Notion using the connection settings. 
                  This view shows which pages are currently contributing to your Sales Knowledge Lake.
                </p>
              </div>
            </div>
          </div>

          {/* Connected Pages */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Connected Pages & Databases</h3>
              <div className="text-sm text-gray-600">
                {connectedPages.length} pages contributing to Knowledge Lake
              </div>
            </div>

            <div className="space-y-2">
              {connectedPages.map((page) => (
                <div key={page.id} className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 bg-gray-50">
                  <div className="text-xl">{page.icon}</div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">{page.name}</div>
                    <div className="text-xs text-gray-500">{page.path} • Updated {page.lastModified}</div>
                  </div>
                  <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                    page.type === 'database' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {page.type}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Management Instructions */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4">Managing Page Access</h3>
            <div className="space-y-4">
              <div className="rounded-lg border border-gray-200 bg-white p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-100">
                    <svg className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                  <div>
                    <h5 className="text-sm font-semibold text-gray-900 mb-2">Adding Pages to Docket</h5>
                    <ol className="text-xs text-gray-600 space-y-1 list-decimal list-inside">
                      <li>In Notion, navigate to the page you want to add</li>
                      <li>Click the 3 dots menu (⋯) in the top right</li>
                      <li>Select "Connect to" under "Connections"</li>
                      <li>Choose "Docket Inc" and click "Confirm"</li>
                    </ol>
                  </div>
                </div>
              </div>
              
              <div className="rounded-lg border border-gray-200 bg-white p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-100">
                    <svg className="h-4 w-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    </svg>
                  </div>
                  <div>
                    <h5 className="text-sm font-semibold text-gray-900 mb-2">Removing Pages from Docket</h5>
                    <ol className="text-xs text-gray-600 space-y-1 list-decimal list-inside">
                      <li>In Notion, navigate to the page you want to remove</li>
                      <li>Click the 3 dots menu (⋯) in the top right</li>
                      <li>Select "Docket Inc" under "Connections"</li>
                      <li>Click "Disconnect" and then "Confirm"</li>
                    </ol>
                  </div>
                </div>
              </div>
              
              <div className="rounded-lg border border-gray-200 bg-white p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100">
                    <svg className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    </svg>
                  </div>
                  <div>
                    <h5 className="text-sm font-semibold text-gray-900 mb-2">Manage All Connections</h5>
                    <ol className="text-xs text-gray-600 space-y-1 list-decimal list-inside">
                      <li>In Notion, go to "Settings and Members" in the left sidebar</li>
                      <li>Navigate to "My connections" tab</li>
                      <li>Find "Docket Inc" and click the 3 dots menu</li>
                      <li>Select "Access selected pages" to review and update</li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 bg-gray-50 px-6 py-6">
        <div className="flex items-center justify-between">
          <button className="inline-flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900 font-medium">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Notion integration help
          </button>
          <div className="flex gap-3">
            <button 
              onClick={onClose}
              className="rounded-xl border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
