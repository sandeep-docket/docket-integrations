import { useState } from 'react'
import { useIntegrationsStore } from '../store'

type SalesloftUser = {
  id: string
  name: string
  email: string
  role: string
  callCount: number
  isSelected: boolean
}

type CallFilter = {
  dealStages: string[]
  callTitles: string[]
}

export function SalesloftConfigPanel({ onClose }: { onClose: () => void }) {
  const { connections } = useIntegrationsStore()
  const isAlreadyConnected = Boolean(connections['salesloft'])
  
  const [isConnected, setIsConnected] = useState(isAlreadyConnected)
  const [isConnecting, setIsConnecting] = useState(false)
  const [apiKey, setApiKey] = useState('')
  const [titleInput, setTitleInput] = useState('')
  
  const [users, setUsers] = useState<SalesloftUser[]>([
    { id: 'u1', name: 'Sarah Chen', email: 'sarah.chen@company.com', role: 'Senior Sales Director', callCount: 287, isSelected: true },
    { id: 'u2', name: 'Michael Rodriguez', email: 'michael.r@company.com', role: 'Sales Engineer', callCount: 156, isSelected: true },
    { id: 'u3', name: 'Emily Johnson', email: 'emily.j@company.com', role: 'VP of Sales', callCount: 198, isSelected: true },
    { id: 'u4', name: 'David Park', email: 'david.park@company.com', role: 'Account Executive', callCount: 234, isSelected: false },
  ])

  const [filters, setFilters] = useState<CallFilter>({
    dealStages: ['Discovery', 'Proposal'],
    callTitles: ['demo', 'discovery', 'kickoff']
  })

  const handleConnect = async () => {
    setIsConnecting(true)
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsConnected(true)
    setIsConnecting(false)
  }

  const toggleUser = (userId: string) => {
    setUsers(prev => prev.map(user => 
      user.id === userId ? { ...user, isSelected: !user.isSelected } : user
    ))
  }

  const addCallTitle = () => {
    const title = titleInput.trim()
    if (title && !filters.callTitles.includes(title)) {
      setFilters(prev => ({ ...prev, callTitles: [...prev.callTitles, title] }))
      setTitleInput('')
    }
  }

  const removeCallTitle = (title: string) => {
    setFilters(prev => ({ ...prev, callTitles: prev.callTitles.filter(t => t !== title) }))
  }

  const save = () => {
    const { configure } = useIntegrationsStore.getState()
    configure('salesloft', { 
      selectedUsers: users.filter(u => u.isSelected),
      filters,
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
              <span className="text-sm font-bold text-white">S</span>
            </div>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-gray-900">Connect Salesloft</h1>
              <p className="text-gray-600 mt-0.5 text-sm">Enter your API key to connect</p>
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
                <span className="text-3xl">📈</span>
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Connect Salesloft</h2>
              <p className="text-gray-600 mb-6">
                Enter your Salesloft API key to access conversation data and call insights.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Salesloft API Key</label>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Enter your API key"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
                />
                <p className="text-xs text-gray-600 mt-1">
                  You can find your API key in Salesloft Settings → Team → API
                </p>
              </div>
              <button
                onClick={handleConnect}
                disabled={!apiKey || isConnecting}
                className="w-full rounded-xl bg-gray-900 px-6 py-3 text-sm font-semibold text-white hover:bg-gray-800 disabled:opacity-50 transition-colors"
              >
                {isConnecting ? 'Connecting...' : 'Connect to Salesloft'}
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }


  return (
    <div className="flex h-full flex-col bg-white rounded-xl overflow-hidden">
      <div className="border-b border-gray-200 px-6 py-6">
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-gray-800 to-gray-900">
            <span className="text-sm font-bold text-white">S</span>
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-gray-900">Salesloft Configuration</h1>
            <p className="text-gray-600 mt-0.5 text-sm">Select call users and configure filters</p>
          </div>
          <button onClick={onClose} className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="space-y-6">
          {/* User Selection */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4">Select Call Users (Experts)</h3>
            <div className="space-y-3">
              {users.map((user) => (
                <div 
                  key={user.id}
                  className={`rounded-lg border p-4 transition-all cursor-pointer ${
                    user.isSelected ? 'border-gray-900 bg-gray-50' : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                  onClick={() => toggleUser(user.id)}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
                      <span className="text-sm font-semibold text-gray-700">{user.name.split(' ').map(n => n[0]).join('')}</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-gray-900">{user.name}</h4>
                      <div className="text-xs text-gray-600">{user.role} • {user.callCount} calls</div>
                    </div>
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                      user.isSelected ? 'border-gray-900 bg-gray-900' : 'border-gray-300'
                    }`}>
                      {user.isSelected && (
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

          {/* Call Filters */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4">Call Filters</h3>
            <div className="space-y-4">
              {/* Deal Stages */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Deal Stages</label>
                <div className="grid grid-cols-2 gap-2">
                  {['Prospecting', 'Discovery', 'Qualification', 'Proposal', 'Negotiation', 'Closed Won'].map(stage => (
                    <label key={stage} className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.dealStages.includes(stage)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFilters(prev => ({ ...prev, dealStages: [...prev.dealStages, stage] }))
                          } else {
                            setFilters(prev => ({ ...prev, dealStages: prev.dealStages.filter(s => s !== stage) }))
                          }
                        }}
                        className="h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                      />
                      <span className="text-sm text-gray-900">{stage}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Call Titles */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Call Title Keywords</label>
                {filters.callTitles.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-2 p-2 bg-gray-50 rounded-lg border border-gray-200">
                    {filters.callTitles.map((title) => (
                      <div key={title} className="inline-flex items-center gap-1 rounded-md bg-white border border-gray-200 px-2 py-1 text-sm">
                        <span className="text-gray-900">{title}</span>
                        <button
                          onClick={() => removeCallTitle(title)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={titleInput}
                    onChange={(e) => setTitleInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addCallTitle()}
                    placeholder="Type call title and press Enter"
                    className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
                  />
                  <button
                    onClick={addCallTitle}
                    disabled={!titleInput.trim()}
                    className="rounded-lg bg-gray-900 px-3 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50 transition-colors"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 bg-gray-50 px-6 py-6">
        <div className="flex items-center justify-between">
          <button className="inline-flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900 font-medium">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Salesloft integration help
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
