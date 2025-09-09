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

      <div className="flex-1 overflow-y-auto p-6">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">Pages & Databases</h3>
            <div className="flex items-center gap-3">
              {connectedPages.length > 0 && (
                <div className="text-xs text-green-700 bg-green-50 px-2 py-1 rounded-full">
                  ✓ {connectedPages.length} items synced
                </div>
              )}
              <div className="flex gap-2">
                <button
                  onClick={() => window.open('https://notion.so', '_blank')}
                  className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <span className="text-sm">📄</span>
                  Add Page
                </button>
                <button
                  onClick={() => window.open('https://notion.so', '_blank')}
                  className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <span className="text-sm">🗂️</span>
                  Add Database
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            {connectedPages.map((page) => (
              <div key={page.id} className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 bg-gray-50">
                <div className="text-lg">{page.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900 truncate">{page.name}</div>
                  <div className="text-xs text-gray-500">{page.path} • {page.type} • Updated {page.lastModified}</div>
                </div>
              </div>
            ))}
          </div>

          {connectedPages.length === 0 && (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">📝</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No pages connected</h3>
              <p className="text-gray-600 mb-6">Connect pages and databases from Notion to start syncing content</p>
              <div className="flex justify-center gap-3">
                <button
                  onClick={() => window.open('https://notion.so', '_blank')}
                  className="inline-flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-gray-800 transition-colors"
                >
                  <span className="text-sm">📄</span>
                  Add Page
                </button>
                <button
                  onClick={() => window.open('https://notion.so', '_blank')}
                  className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <span className="text-sm">🗂️</span>
                  Add Database
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

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