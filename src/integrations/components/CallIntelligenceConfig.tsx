import { useState } from 'react'
import { useIntegrationsStore } from '../store'
import type { IntegrationProvider } from '../types'
import type { IngestionRule } from './IngestionRules'

type CallSettings = {
  syncCallRecordings: boolean
  syncTranscripts: boolean
  syncMeetingNotes: boolean
  syncCallAnalytics: boolean
  enableAIInsights: boolean
  autoTagCalls: boolean
  shareWithSalesTeam: boolean
  shareWithMarketingTeam: boolean
  syncFrequency: 'realtime' | 'hourly' | 'daily'
  includeInternalCalls: boolean
  minCallDuration: number
  selectedSMEs: string[]
  learningRules: IngestionRule[]
}

type SME = {
  id: string
  name: string
  email: string
  role: string
  department: 'Sales' | 'Marketing' | 'Product' | 'Leadership' | 'Engineering'
  tenure: string
  callCount: number
  isSelected: boolean
}

type CallDataType = {
  id: string
  name: string
  description: string
  enabled: boolean
  category: 'recordings' | 'insights' | 'analytics'
}

// Configuration for different call intelligence platforms
const getProviderConfig = (providerId: string) => {
  const configs = {
    'gong': {
      name: 'Gong',
      icon: '📞',
      color: 'purple',
      description: 'Revenue intelligence from call recordings and conversation analytics',
      dataTypes: [
        { id: 'recordings', name: 'Call Recordings', description: 'Audio/video recordings of sales calls', enabled: true, category: 'recordings' as const },
        { id: 'transcripts', name: 'Call Transcripts', description: 'AI-generated transcripts with speaker identification', enabled: true, category: 'recordings' as const },
        { id: 'talk-time', name: 'Talk Time Analysis', description: 'Speaker talk time ratios and conversation balance', enabled: true, category: 'analytics' as const },
        { id: 'sentiment', name: 'Sentiment Analysis', description: 'Emotional tone and sentiment throughout calls', enabled: true, category: 'insights' as const },
        { id: 'keywords', name: 'Keyword Tracking', description: 'Mentions of competitors, products, and key terms', enabled: true, category: 'insights' as const },
        { id: 'objections', name: 'Objection Detection', description: 'Identified customer objections and responses', enabled: true, category: 'insights' as const },
        { id: 'next-steps', name: 'Next Steps & Action Items', description: 'Automatically extracted follow-up actions', enabled: true, category: 'insights' as const },
        { id: 'deal-risks', name: 'Deal Risk Indicators', description: 'Early warning signals for at-risk deals', enabled: false, category: 'analytics' as const },
      ],
      mockSMEs: [
        { id: 'sme1', name: 'Sarah Chen', email: 'sarah.chen@company.com', role: 'Senior Sales Director', department: 'Sales' as const, tenure: '4 years', callCount: 287, isSelected: true },
        { id: 'sme2', name: 'Michael Rodriguez', email: 'michael.r@company.com', role: 'Sales Engineer', department: 'Sales' as const, tenure: '2.5 years', callCount: 156, isSelected: true },
        { id: 'sme3', name: 'Emily Johnson', email: 'emily.j@company.com', role: 'VP of Sales', department: 'Leadership' as const, tenure: '6 years', callCount: 198, isSelected: true },
        { id: 'sme4', name: 'David Park', email: 'david.park@company.com', role: 'Product Marketing Manager', department: 'Marketing' as const, tenure: '3 years', callCount: 89, isSelected: false },
        { id: 'sme5', name: 'Lisa Thompson', email: 'lisa.t@company.com', role: 'Customer Success Manager', department: 'Sales' as const, tenure: '1.5 years', callCount: 124, isSelected: false },
        { id: 'sme6', name: 'James Wilson', email: 'james.w@company.com', role: 'Head of Product', department: 'Product' as const, tenure: '5 years', callCount: 67, isSelected: true },
      ]
    },
    'avoma': {
      name: 'Avoma',
      icon: '🎥',
      color: 'blue',
      description: 'Meeting intelligence and conversation insights',
      dataTypes: [
        { id: 'recordings', name: 'Meeting Recordings', description: 'Video recordings of meetings and calls', enabled: true, category: 'recordings' as const },
        { id: 'transcripts', name: 'Meeting Transcripts', description: 'Accurate transcripts with speaker identification', enabled: true, category: 'recordings' as const },
        { id: 'notes', name: 'AI Meeting Notes', description: 'Automatically generated meeting summaries', enabled: true, category: 'insights' as const },
        { id: 'action-items', name: 'Action Items', description: 'Extracted tasks and follow-up items', enabled: true, category: 'insights' as const },
        { id: 'topics', name: 'Topic Analysis', description: 'Key topics and themes discussed in meetings', enabled: true, category: 'analytics' as const },
        { id: 'questions', name: 'Question Tracking', description: 'Customer questions and responses', enabled: true, category: 'insights' as const },
        { id: 'moments', name: 'Key Moments', description: 'Important highlights and decision points', enabled: false, category: 'insights' as const },
      ],
      mockSMEs: [
        { id: 'sme1', name: 'Sarah Chen', email: 'sarah.chen@company.com', role: 'Senior Sales Director', department: 'Sales' as const, tenure: '4 years', callCount: 287, isSelected: true },
        { id: 'sme2', name: 'Michael Rodriguez', email: 'michael.r@company.com', role: 'Sales Engineer', department: 'Sales' as const, tenure: '2.5 years', callCount: 156, isSelected: true },
        { id: 'sme3', name: 'Emily Johnson', email: 'emily.j@company.com', role: 'VP of Sales', department: 'Leadership' as const, tenure: '6 years', callCount: 198, isSelected: true },
        { id: 'sme4', name: 'David Park', email: 'david.park@company.com', role: 'Product Marketing Manager', department: 'Marketing' as const, tenure: '3 years', callCount: 89, isSelected: false },
        { id: 'sme5', name: 'Lisa Thompson', email: 'lisa.t@company.com', role: 'Customer Success Manager', department: 'Sales' as const, tenure: '1.5 years', callCount: 124, isSelected: false },
        { id: 'sme6', name: 'James Wilson', email: 'james.w@company.com', role: 'Head of Product', department: 'Product' as const, tenure: '5 years', callCount: 67, isSelected: true },
      ]
    }
  }
  return configs[providerId as keyof typeof configs] || configs.gong
}

export function CallIntelligenceConfigPanel({ provider, onClose }: { provider: IntegrationProvider; onClose: () => void }) {
  const configure = useIntegrationsStore((s) => s.configure)
  const { connections } = useIntegrationsStore()
  const isAlreadyConnected = Boolean(connections[provider.id])
  
  const [isConnected, setIsConnected] = useState(isAlreadyConnected)
  const [isConnecting, setIsConnecting] = useState(false)
  const [showNewRuleModal, setShowNewRuleModal] = useState(false)
  
  const config = getProviderConfig(provider.id)
  const [dataTypes] = useState<CallDataType[]>(config.dataTypes)
  const [smes, setSMEs] = useState<SME[]>(config.mockSMEs || [])
  const [learningRules, setLearningRules] = useState<IngestionRule[]>([
    { id: 'rule1', name: 'External Customer Calls', callType: 'external', meetingTitleKeywords: ['demo', 'discovery', 'proposal'], selectedUsers: ['sme1', 'sme2'], isActive: true },
    { id: 'rule2', name: 'Internal Strategy Meetings', callType: 'internal', meetingTitleKeywords: ['standup', 'planning', 'review'], dealStages: ['Discovery', 'Proposal'], isActive: false }
  ])
  const [settings, setSettings] = useState<CallSettings>({
    syncCallRecordings: true,
    syncTranscripts: true,
    syncMeetingNotes: true,
    syncCallAnalytics: true,
    enableAIInsights: true,
    autoTagCalls: true,
    shareWithSalesTeam: true,
    shareWithMarketingTeam: false,
    syncFrequency: 'daily',
    includeInternalCalls: false,
    minCallDuration: 5,
    selectedSMEs: smes.filter(sme => sme.isSelected).map(sme => sme.id),
    learningRules
  })

  const handleConnect = async () => {
    setIsConnecting(true)
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsConnected(true)
    setIsConnecting(false)
  }

  const updateSetting = <K extends keyof CallSettings>(key: K, value: CallSettings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  const toggleLearningRule = (ruleId: string) => {
    setLearningRules(prev => prev.map(rule => 
      rule.id === ruleId ? { ...rule, isActive: !rule.isActive } : rule
    ))
  }

  const save = () => {
    configure(provider.id, { 
      settings, 
      enabledDataTypes: dataTypes.filter(dt => dt.enabled),
      lastUpdated: new Date().toISOString()
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
            <p className="text-gray-600 mb-8">
              {config.description}. Enhance your Sales Knowledge Lake with conversation insights and call intelligence.
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
                  Connect to {config.name}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    )
  }


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
              <p className="text-gray-600 mt-0.5 text-sm">Configure call intelligence and AI insights</p>
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
        <div className="space-y-8">

          {/* Subject Matter Experts */}
          <div>
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Subject Matter Experts</h3>
              <p className="text-gray-600">Select tenured Sellers, Sales Engineers, Product Specialists, Managers, and Company Leaders that Docket should learn from</p>
            </div>
            
            <SMEMultiSelect
              smes={smes}
              selectedSMEs={settings.selectedSMEs}
              onSelectionChange={(selectedIds) => {
                setSMEs(prev => prev.map(sme => ({
                  ...sme,
                  isSelected: selectedIds.includes(sme.id)
                })))
                updateSetting('selectedSMEs', selectedIds)
              }}
            />
          </div>

          {/* Learning Rules */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Learning Rules</h3>
              <button
                onClick={() => setShowNewRuleModal(!showNewRuleModal)}
                className="inline-flex items-center gap-2 rounded-lg bg-gray-900 px-3 py-2 text-sm font-medium text-white hover:bg-gray-800 transition-colors"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                {showNewRuleModal ? 'Cancel' : 'Add Rule'}
              </button>
            </div>
            
            {/* Rules Table */}
            <div className="space-y-2">
              {learningRules.map((rule) => (
                <CompactRuleCard
                  key={rule.id}
                  rule={rule}
                  smes={smes}
                  onToggle={() => toggleLearningRule(rule.id)}
                  onEdit={(updatedRule) => setLearningRules(prev => prev.map(r => r.id === rule.id ? updatedRule : r))}
                  onDelete={() => setLearningRules(prev => prev.filter(r => r.id !== rule.id))}
                />
              ))}
              
              {/* Inline Create Rule Form */}
              {showNewRuleModal && (
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                  <h4 className="text-sm font-semibold text-gray-900 mb-4">Create New Learning Rule</h4>
                  <InlineRuleForm
                    smes={smes}
                    onSave={(rule) => {
                      setLearningRules(prev => [...prev, { ...rule, id: `rule-${Date.now()}`, isActive: true }])
                      setShowNewRuleModal(false)
                    }}
                    onCancel={() => setShowNewRuleModal(false)}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Advanced Settings */}
          <div>
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Advanced Settings</h3>
              <p className="text-gray-600">Fine-tune call processing and filtering options</p>
            </div>
            
            <div className="space-y-4">
              {/* Minimum call duration */}
              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100">
                    <svg className="h-4 w-4 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-base font-semibold text-gray-900 mb-1">Minimum call duration</h4>
                    <p className="text-sm text-gray-600 mb-4">Only process calls longer than this duration</p>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <span>0 min</span>
                        <span>1 min</span>
                        <span>5 min</span>
                        <span>10 min</span>
                        <span>15 min</span>
                        <span>30 min</span>
                      </div>
                      <div className="relative">
                        <input
                          type="range"
                          min="0"
                          max="5"
                          step="1"
                          value={[0, 1, 5, 10, 15, 30].indexOf(settings.minCallDuration)}
                          onChange={(e) => {
                            const breakpoints = [0, 1, 5, 10, 15, 30];
                            updateSetting('minCallDuration', breakpoints[parseInt(e.target.value)]);
                          }}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-with-steps"
                        />
                        <div className="flex justify-between absolute top-1/2 left-0 right-0 transform -translate-y-1/2 pointer-events-none">
                          {[0, 1, 5, 10, 15, 30].map((_, index) => (
                            <div key={index} className="w-2 h-2 bg-gray-400 rounded-full"></div>
                          ))}
                        </div>
                      </div>
                      <div className="text-center">
                        <span className="text-sm font-medium text-gray-900 bg-gray-100 px-3 py-1 rounded-full">
                          {settings.minCallDuration} minutes
                        </span>
                      </div>
                    </div>
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
          <div className="text-sm text-gray-600">
            {settings.selectedSMEs.length} SMEs • {learningRules.filter(r => r.isActive).length} active rules
          </div>
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
              Save Configuration
            </button>
          </div>
        </div>
      </div>

    </div>
  )
}


function SMEMultiSelect({
  smes,
  selectedSMEs,
  onSelectionChange
}: {
  smes: SME[]
  selectedSMEs: string[]
  onSelectionChange: (selectedIds: string[]) => void
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  
  const selectedSMEObjects = smes.filter(sme => selectedSMEs.includes(sme.id))
  const filteredSMEs = smes.filter(sme => 
    sme.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sme.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sme.department.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const toggleSME = (smeId: string) => {
    const newSelection = selectedSMEs.includes(smeId)
      ? selectedSMEs.filter(id => id !== smeId)
      : [...selectedSMEs, smeId]
    onSelectionChange(newSelection)
  }

  const removeSME = (smeId: string) => {
    onSelectionChange(selectedSMEs.filter(id => id !== smeId))
  }

  return (
    <div className="space-y-4">
      {/* Selected SMEs chips */}
      {selectedSMEObjects.length > 0 && (
        <div className="flex flex-wrap gap-2 p-4 bg-gray-50 rounded-lg border border-gray-200">
          {selectedSMEObjects.map((sme) => (
            <div key={sme.id} className="inline-flex items-center gap-2 rounded-lg bg-white border border-gray-200 px-3 py-2 text-sm shadow-sm">
              <div className="flex h-6 w-6 items-center justify-center rounded bg-gray-100">
                <span className="text-xs font-semibold text-gray-700">{sme.name.split(' ').map(n => n[0]).join('')}</span>
              </div>
              <span className="font-medium text-gray-900">{sme.name}</span>
              <span className="text-xs text-gray-500">({sme.department})</span>
              <button
                onClick={() => removeSME(sme.id)}
                className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded p-0.5 transition-colors"
              >
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* SME selector dropdown */}
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="relative w-full rounded-lg border border-gray-300 bg-white py-3 pl-3 pr-10 text-left shadow-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
        >
          <span className="block truncate text-sm text-gray-700">
            {selectedSMEs.length > 0 
              ? `${selectedSMEs.length} SME${selectedSMEs.length > 1 ? 's' : ''} selected`
              : 'Select Subject Matter Experts...'
            }
          </span>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <svg className={`h-5 w-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </span>
        </button>
        
        {isOpen && (
          <div className="absolute z-10 mt-1 w-full rounded-lg bg-white border border-gray-200 shadow-lg">
            {/* Search */}
            <div className="p-3 border-b border-gray-100">
              <div className="relative">
                <svg className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search SMEs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-md border border-gray-300 bg-white pl-10 pr-4 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
                />
              </div>
            </div>
            
            {/* SME List */}
            <div className="max-h-64 overflow-y-auto">
              {filteredSMEs.map((sme) => (
                <button
                  key={sme.id}
                  onClick={() => toggleSME(sme.id)}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
                >
                  <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                    selectedSMEs.includes(sme.id) ? 'border-gray-900 bg-gray-900' : 'border-gray-300'
                  }`}>
                    {selectedSMEs.includes(sme.id) && (
                      <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100">
                    <span className="text-xs font-semibold text-gray-700">{sme.name.split(' ').map(n => n[0]).join('')}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900">{sme.name}</div>
                    <div className="text-xs text-gray-500">{sme.role} • {sme.department} • {sme.callCount} calls</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function CompactRuleCard({ 
  rule, 
  smes,
  onToggle,
  onEdit,
  onDelete 
}: { 
  rule: IngestionRule
  smes: SME[]
  onToggle: () => void
  onEdit: (rule: IngestionRule) => void
  onDelete: () => void
}) {
  const [isEditing, setIsEditing] = useState(false)

  if (isEditing) {
    return (
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
        <h4 className="text-sm font-semibold text-gray-900 mb-4">Edit Learning Rule</h4>
        <InlineRuleForm
          smes={smes}
          initialRule={rule}
          onSave={(updatedRule) => {
            onEdit({ ...updatedRule, id: rule.id, isActive: rule.isActive })
            setIsEditing(false)
          }}
          onCancel={() => setIsEditing(false)}
        />
      </div>
    )
  }

  return (
    <div className="group rounded-lg border border-gray-200 bg-white p-3 hover:border-gray-300 transition-all">
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-1">
            <h4 className="text-sm font-semibold text-gray-900">{rule.name}</h4>
            <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
              rule.callType === 'external' ? 'bg-green-100 text-green-800' :
              rule.callType === 'internal' ? 'bg-blue-100 text-blue-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {rule.callType} calls
            </span>
          </div>
          
          <div className="text-xs text-gray-600 space-y-1">
            <div>
              <span className="font-medium">Keywords:</span> {rule.meetingTitleKeywords.join(', ') || 'None'}
            </div>
            {rule.dealStages && rule.dealStages.length > 0 && (
              <div>
                <span className="font-medium">Deal Stages:</span> {rule.dealStages.join(', ')}
              </div>
            )}
            <div>
              <span className="font-medium">Users:</span> {rule.selectedUsers?.length || 0} selected
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsEditing(true)}
            className="opacity-0 group-hover:opacity-100 p-1.5 text-gray-400 hover:text-gray-600 rounded transition-all"
            title="Edit rule"
          >
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          
          <button
            onClick={onToggle}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              rule.isActive ? 'bg-gray-900' : 'bg-gray-300'
            }`}
          >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              rule.isActive ? 'translate-x-6' : 'translate-x-1'
            }`} />
          </button>
          
          <button
            onClick={onDelete}
            className="opacity-0 group-hover:opacity-100 p-1.5 text-gray-400 hover:text-red-600 rounded transition-all"
            title="Delete rule"
          >
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

function InlineRuleForm({ 
  smes,
  onCancel,
  onSave,
  initialRule
}: { 
  smes: SME[]
  onCancel: () => void
  onSave: (rule: Omit<IngestionRule, 'id' | 'isActive'>) => void
  initialRule?: IngestionRule
}) {
  const [ruleName, setRuleName] = useState(initialRule?.name || '')
  const [callType, setCallType] = useState<'external' | 'internal' | 'all'>(initialRule?.callType || 'external')
  const [selectedUsers, setSelectedUsers] = useState<string[]>(initialRule?.selectedUsers || [])
  const [meetingTitleKeywords, setMeetingTitleKeywords] = useState<string[]>(initialRule?.meetingTitleKeywords || [])
  const [dealStages, setDealStages] = useState<string[]>(initialRule?.dealStages || [])
  const [keywordInput, setKeywordInput] = useState('')

  const addKeyword = () => {
    const keyword = keywordInput.trim()
    if (keyword && !meetingTitleKeywords.includes(keyword)) {
      setMeetingTitleKeywords(prev => [...prev, keyword])
      setKeywordInput('')
    }
  }

  const removeKeyword = (keyword: string) => {
    setMeetingTitleKeywords(prev => prev.filter(k => k !== keyword))
  }

  const handleKeywordKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addKeyword()
    }
  }


  const handleSave = () => {
    if (ruleName.trim()) {
      onSave({
        name: ruleName,
        callType,
        selectedUsers: selectedUsers.length > 0 ? selectedUsers : undefined,
        meetingTitleKeywords,
        dealStages: dealStages.length > 0 ? dealStages : undefined
      })
    }
  }

  return (
    <div>
      <div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Rule name</label>
            <input
              type="text"
              value={ruleName}
              onChange={(e) => setRuleName(e.target.value)}
              placeholder="e.g., Discovery Stage Calls"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Call type</label>
            <select
              value={callType}
              onChange={(e) => setCallType(e.target.value as any)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
            >
              <option value="external">External (customers & prospects)</option>
              <option value="internal">Internal (team meetings)</option>
              <option value="all">All calls</option>
            </select>
          </div>

          {/* User Selection - Multi-select Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select users (optional)</label>
            <select
              multiple
              value={selectedUsers}
              onChange={(e) => {
                const selectedOptions = Array.from(e.target.selectedOptions, option => option.value)
                setSelectedUsers(selectedOptions)
              }}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 min-h-[120px]"
            >
              {smes.map((sme) => (
                <option key={sme.id} value={sme.id} className="py-2">
                  {sme.name} - {sme.role} ({sme.department})
                </option>
              ))}
            </select>
            {selectedUsers.length > 0 && (
              <div className="mt-2 text-xs text-gray-600">
                {selectedUsers.length} user{selectedUsers.length !== 1 ? 's' : ''} selected
              </div>
            )}
          </div>

          {/* Deal Stages - Multi-select Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Deal stages</label>
            <select
              multiple
              value={dealStages}
              onChange={(e) => {
                const selectedOptions = Array.from(e.target.selectedOptions, option => option.value)
                setDealStages(selectedOptions)
              }}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 min-h-[100px]"
            >
              {['Prospecting', 'Discovery', 'Qualification', 'Proposal', 'Negotiation', 'Closed Won', 'Closed Lost'].map(stage => (
                <option key={stage} value={stage} className="py-1">
                  {stage}
                </option>
              ))}
            </select>
            {dealStages.length > 0 && (
              <div className="mt-2 text-xs text-gray-600">
                {dealStages.length} stage{dealStages.length !== 1 ? 's' : ''} selected
              </div>
            )}
          </div>

          {/* Meeting Title Keywords */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Meeting title keywords</label>
            
            {/* Selected keywords */}
            {meetingTitleKeywords.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2 p-2 bg-gray-50 rounded-lg border border-gray-200">
                {meetingTitleKeywords.map((keyword) => (
                  <div key={keyword} className="inline-flex items-center gap-1 rounded-md bg-white border border-gray-200 px-2 py-1 text-sm">
                    <span className="text-gray-900">{keyword}</span>
                    <button
                      onClick={() => removeKeyword(keyword)}
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
            
            {/* Keyword input */}
            <div className="flex gap-2">
              <input
                type="text"
                value={keywordInput}
                onChange={(e) => setKeywordInput(e.target.value)}
                onKeyPress={handleKeywordKeyPress}
                placeholder="Type keyword and press Enter (e.g., standup, demo, review)"
                className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
              />
              <button
                onClick={addKeyword}
                disabled={!keywordInput.trim()}
                className="rounded-lg bg-gray-900 px-3 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50 transition-colors"
              >
                Add
              </button>
            </div>
            <p className="text-xs text-gray-600 mt-1">
              Add keywords that appear in meeting titles. Press Enter or click Add after typing each keyword.
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button 
            onClick={onCancel}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave}
            disabled={!ruleName.trim()}
            className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800 disabled:opacity-50 transition-colors"
          >
            Create Rule
          </button>
        </div>
      </div>
    </div>
  )
}
