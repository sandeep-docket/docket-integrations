import { useState } from 'react'
import { useIntegrationsStore } from '../store'

type MindtickleHub = {
  id: string
  name: string
  description: string
  contentCount: number
  lastModified: string
  isSelected: boolean
}

export function MindtickleConfigPanel({ onClose }: { onClose: () => void }) {
  const { connections } = useIntegrationsStore()
  const isAlreadyConnected = Boolean(connections['mindtickle'])
  
  const [isConnected, setIsConnected] = useState(isAlreadyConnected)
  const [isConnecting, setIsConnecting] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mfaSecret, setMfaSecret] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  
  const [hubs, setHubs] = useState<MindtickleHub[]>([
    { id: 'h1', name: 'Sales Onboarding', description: 'New hire training and certification programs', contentCount: 45, lastModified: '2 days ago', isSelected: true },
    { id: 'h2', name: 'Product Training', description: 'Product knowledge and feature deep-dives', contentCount: 78, lastModified: '1 week ago', isSelected: true },
    { id: 'h3', name: 'Sales Methodology', description: 'Sales process and methodology training', contentCount: 34, lastModified: '3 days ago', isSelected: false },
    { id: 'h4', name: 'Competitive Intelligence', description: 'Competitive positioning and battle cards', contentCount: 56, lastModified: '5 days ago', isSelected: true },
    { id: 'h5', name: 'Customer Success Training', description: 'Customer onboarding and success strategies', contentCount: 23, lastModified: '1 day ago', isSelected: false },
  ])

  const handleConnect = async () => {
    setIsConnecting(true)
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsConnected(true)
    setIsConnecting(false)
  }

  const toggleHub = (hubId: string) => {
    setHubs(prev => prev.map(hub => 
      hub.id === hubId ? { ...hub, isSelected: !hub.isSelected } : hub
    ))
  }

  const save = () => {
    const { configure } = useIntegrationsStore.getState()
    configure('mindtickle', { 
      selectedHubs: hubs.filter(h => h.isSelected),
      lastUpdated: new Date().toISOString()
    })
    onClose()
  }

  if (!isConnected) {
    return (
      <div className="flex h-full flex-col bg-white rounded-xl overflow-hidden">
        <div className="border-b border-gray-200 px-6 py-6">
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-gray-800 to-gray-900">
              <span className="text-sm font-bold text-white">M</span>
            </div>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-gray-900">Connect Mindtickle</h1>
              <p className="text-gray-600 mt-0.5 text-sm">Connect your Mindtickle CMS account</p>
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
                <span className="text-3xl">🎓</span>
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Connect Mindtickle CMS</h2>
              <p className="text-gray-600 mb-6">
                Enter your Mindtickle credentials to access training content and learning hubs.
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">MFA Secret String</label>
                <input
                  type="text"
                  value={mfaSecret}
                  onChange={(e) => setMfaSecret(e.target.value)}
                  placeholder="Alphanumeric code from authenticator"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
                />
                <p className="text-xs text-gray-600 mt-1">
                  Enter the alphanumeric code shown below the QR code in your authenticator app
                </p>
              </div>
              <button
                onClick={handleConnect}
                disabled={!email || !password || !mfaSecret || isConnecting}
                className="w-full rounded-xl bg-gray-900 px-6 py-3 text-sm font-semibold text-white hover:bg-gray-800 disabled:opacity-50 transition-colors"
              >
                {isConnecting ? 'Connecting...' : 'Connect to Mindtickle'}
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const selectedHubs = hubs.filter(h => h.isSelected)

  return (
    <div className="flex h-full flex-col bg-white rounded-xl overflow-hidden">
      <div className="border-b border-gray-200 px-6 py-6">
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-gray-800 to-gray-900">
            <span className="text-sm font-bold text-white">M</span>
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-gray-900">Mindtickle Configuration</h1>
            <p className="text-gray-600 mt-0.5 text-sm">Select content hubs for ingestion</p>
          </div>
          <button onClick={onClose} className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">Content Hubs</h3>
            <div className="text-sm text-gray-600">{selectedHubs.length} hubs selected</div>
          </div>

          <div className="relative mb-4">
            <svg className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search content hubs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white pl-10 pr-4 py-2.5 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
            />
          </div>

          <div className="space-y-3">
            {hubs.filter(h => 
              h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              h.description.toLowerCase().includes(searchQuery.toLowerCase())
            ).map((hub) => (
              <div 
                key={hub.id}
                className={`rounded-lg border p-4 transition-all cursor-pointer ${
                  hub.isSelected ? 'border-gray-900 bg-gray-50' : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
                onClick={() => toggleHub(hub.id)}
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
                    <span className="text-lg">🎓</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="text-sm font-semibold text-gray-900">{hub.name}</h4>
                      <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800">
                        {hub.contentCount} items
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{hub.description}</p>
                    <div className="text-xs text-gray-500">Updated {hub.lastModified}</div>
                  </div>
                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                    hub.isSelected ? 'border-gray-900 bg-gray-900' : 'border-gray-300'
                  }`}>
                    {hub.isSelected && (
                      <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 bg-gray-50 px-6 py-6">
        <div className="flex items-center justify-between">
          <button className="inline-flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900 font-medium">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Mindtickle integration help
          </button>
          <div className="flex gap-3">
            <button onClick={onClose} className="rounded-xl border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              Cancel
            </button>
            <button onClick={save} className="rounded-xl bg-gray-900 hover:bg-gray-800 px-5 py-2.5 text-sm font-semibold text-white transition-colors">
              Save Configuration
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
