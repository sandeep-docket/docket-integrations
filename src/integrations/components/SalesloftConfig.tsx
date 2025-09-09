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

type LearningRule = {
  id: string
  name: string
  callType: 'external' | 'internal' | 'all'
  selectedUsers: string[]
  meetingTitleKeywords: string[]
  dealStages: string[]
  isActive: boolean
}

export function SalesloftConfigPanel({ onClose }: { onClose: () => void }) {
  const { connections } = useIntegrationsStore()
  const isAlreadyConnected = Boolean(connections['salesloft'])
  
  const [isConnected, setIsConnected] = useState(isAlreadyConnected)
  const [isConnecting, setIsConnecting] = useState(false)
  const [apiKey, setApiKey] = useState('')
  const [showCreateRule, setShowCreateRule] = useState(false)
  const [newRuleName, setNewRuleName] = useState('')
  const [newRuleCallType, setNewRuleCallType] = useState<'external' | 'internal' | 'all'>('external')
  const [newRuleKeywords, setNewRuleKeywords] = useState<string[]>([])
  const [newRuleDealStages, setNewRuleDealStages] = useState<string[]>([])
  const [keywordInput, setKeywordInput] = useState('')
  
  const [users, setUsers] = useState<SalesloftUser[]>([
    { id: 'u1', name: 'Sarah Chen', email: 'sarah.chen@company.com', role: 'Senior Sales Director', callCount: 287, isSelected: true },
    { id: 'u2', name: 'Michael Rodriguez', email: 'michael.r@company.com', role: 'Sales Engineer', callCount: 156, isSelected: true },
    { id: 'u3', name: 'Emily Johnson', email: 'emily.j@company.com', role: 'VP of Sales', callCount: 198, isSelected: true },
    { id: 'u4', name: 'David Park', email: 'david.park@company.com', role: 'Account Executive', callCount: 234, isSelected: false },
  ])

  const [learningRules, setLearningRules] = useState<LearningRule[]>([
    {
      id: '1',
      name: 'Sales engagement calls',
      callType: 'external',
      selectedUsers: ['u1', 'u2', 'u3'],
      meetingTitleKeywords: ['demo', 'discovery', 'kickoff'],
      dealStages: ['Discovery', 'Proposal'],
      isActive: true
    }
  ])

  const dealStages = ['Discovery', 'Qualification', 'Proposal', 'Negotiation', 'Closed Won', 'Closed Lost']

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

  const addKeyword = () => {
    const keyword = keywordInput.trim().toLowerCase()
    if (keyword && !newRuleKeywords.includes(keyword)) {
      setNewRuleKeywords(prev => [...prev, keyword])
      setKeywordInput('')
    }
  }

  const removeKeyword = (keyword: string) => {
    setNewRuleKeywords(prev => prev.filter(k => k !== keyword))
  }

  const toggleDealStage = (stage: string) => {
    setNewRuleDealStages(prev => 
      prev.includes(stage) ? prev.filter(s => s !== stage) : [...prev, stage]
    )
  }

  const createRule = () => {
    if (newRuleName.trim()) {
      const newRule: LearningRule = {
        id: Date.now().toString(),
        name: newRuleName.trim(),
        callType: newRuleCallType,
        selectedUsers: users.filter(u => u.isSelected).map(u => u.id),
        meetingTitleKeywords: [...newRuleKeywords],
        dealStages: [...newRuleDealStages],
        isActive: true
      }
      setLearningRules(prev => [...prev, newRule])
      
      // Reset form
      setNewRuleName('')
      setNewRuleCallType('external')
      setNewRuleKeywords([])
      setNewRuleDealStages([])
      setShowCreateRule(false)
    }
  }

  const toggleRule = (ruleId: string) => {
    setLearningRules(prev => prev.map(rule => 
      rule.id === ruleId ? { ...rule, isActive: !rule.isActive } : rule
    ))
  }

  const save = () => {
    const { configure } = useIntegrationsStore.getState()
    configure('salesloft', { 
      selectedUsers: users.filter(u => u.isSelected),
      learningRules: learningRules.filter(r => r.isActive),
      apiKey,
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
                Enter your API key to access sales engagement and conversation intelligence data.
              </p>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">API Key</label>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Enter your Salesloft API key"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
                />
              </div>
              
              <button
                onClick={handleConnect}
                disabled={isConnecting || !apiKey.trim()}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gray-900 px-6 py-3 text-sm font-semibold text-white hover:bg-gray-800 disabled:opacity-50 transition-colors"
              >
                {isConnecting ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    <span>Connecting...</span>
                  </>
                ) : (
                  'Connect to Salesloft'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const selectedUsers = users.filter(u => u.isSelected)

  return (
    <div className="flex h-full flex-col bg-white rounded-xl overflow-hidden">
      <div className="border-b border-gray-200 px-6 py-6">
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-gray-800 to-gray-900">
            <span className="text-sm font-bold text-white">S</span>
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-gray-900">Salesloft Configuration</h1>
            <p className="text-gray-600 mt-0.5 text-sm">Configure sales engagement insights</p>
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
          {/* Subject Matter Experts */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Subject Matter Experts</h3>
              <div className="text-sm text-gray-600">{selectedUsers.length} experts selected</div>
            </div>

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

          {/* Learning Rules */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Ingestion Rules</h3>
              <button
                onClick={() => setShowCreateRule(true)}
                className="inline-flex items-center gap-2 rounded-lg bg-gray-900 px-3 py-2 text-sm font-medium text-white hover:bg-gray-800 transition-colors"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Rule
              </button>
            </div>

            <div className="space-y-3">
              {learningRules.map((rule) => (
                <div key={rule.id} className="rounded-lg border border-gray-200 bg-white p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-sm font-semibold text-gray-900">{rule.name}</h4>
                        <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                          rule.callType === 'external' ? 'bg-green-100 text-green-800' :
                          rule.callType === 'internal' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {rule.callType} calls
                        </span>
                      </div>
                      
                      <div className="space-y-2 text-xs text-gray-600">
                        <div>
                          <span className="font-medium">Keywords:</span> {rule.meetingTitleKeywords.join(', ') || 'None'}
                        </div>
                        <div>
                          <span className="font-medium">Deal Stages:</span> {rule.dealStages.join(', ') || 'All'}
                        </div>
                        <div>
                          <span className="font-medium">Users:</span> {rule.selectedUsers.length} selected
                        </div>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => toggleRule(rule.id)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        rule.isActive ? 'bg-gray-900' : 'bg-gray-300'
                      }`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        rule.isActive ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>
                </div>
              ))}
              
              {/* Inline Create Rule Form */}
              {showCreateRule && (
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                  <h4 className="text-sm font-semibold text-gray-900 mb-4">Create New Ingestion Rule</h4>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Rule Name</label>
                      <input
                        type="text"
                        value={newRuleName}
                        onChange={(e) => setNewRuleName(e.target.value)}
                        placeholder="e.g., Sales engagement calls"
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Call Type</label>
                      <div className="flex gap-2">
                        {[
                          { value: 'external', label: 'External' },
                          { value: 'internal', label: 'Internal' },
                          { value: 'all', label: 'All' }
                        ].map((option) => (
                          <button
                            key={option.value}
                            onClick={() => setNewRuleCallType(option.value as any)}
                            className={`px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
                              newRuleCallType === option.value
                                ? 'bg-gray-900 text-white'
                                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Meeting Title Keywords</label>
                      <div className="flex gap-2 mb-2">
                        <input
                          type="text"
                          value={keywordInput}
                          onChange={(e) => setKeywordInput(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && addKeyword()}
                          placeholder="Add keyword..."
                          className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
                        />
                        <button
                          onClick={addKeyword}
                          className="px-3 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
                        >
                          Add
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {newRuleKeywords.map((keyword) => (
                          <span
                            key={keyword}
                            className="inline-flex items-center gap-1 bg-white text-gray-800 px-2 py-1 rounded-md text-xs border border-gray-200"
                          >
                            {keyword}
                            <button
                              onClick={() => removeKeyword(keyword)}
                              className="text-gray-500 hover:text-gray-700"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Deal Stages</label>
                      <div className="grid grid-cols-2 gap-2">
                        {dealStages.map((stage) => (
                          <label key={stage} className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={newRuleDealStages.includes(stage)}
                              onChange={() => toggleDealStage(stage)}
                              className="rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                            />
                            <span className="text-sm text-gray-700">{stage}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex gap-3 pt-2">
                      <button
                        onClick={() => setShowCreateRule(false)}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={createRule}
                        disabled={!newRuleName.trim()}
                        className="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 disabled:opacity-50 transition-colors"
                      >
                        Create Rule
                      </button>
                    </div>
                  </div>
                </div>
              )}
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