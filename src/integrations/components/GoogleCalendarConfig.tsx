import { useState } from 'react'
import { useIntegrationsStore } from '../store'

type CalendarSettings = {
  syncMeetings: boolean
  syncEvents: boolean
  includePrivateEvents: boolean
  meetingTypes: string[]
  minimumDuration: number
}

type IngestionRule = {
  id: string
  name: string
  meetingType: 'external' | 'internal' | 'all'
  selectedAttendees: string[]
  meetingTitleKeywords: string[]
  isActive: boolean
}

type TeamMember = {
  id: string
  name: string
  email: string
  role: string
  isSelected: boolean
}

export function GoogleCalendarConfigPanel({ onClose }: { onClose: () => void }) {
  const { connections } = useIntegrationsStore()
  const isAlreadyConnected = Boolean(connections['google-calendar'])
  
  const [isConnected, setIsConnected] = useState(isAlreadyConnected)
  const [isConnecting, setIsConnecting] = useState(false)
  const [showCreateRule, setShowCreateRule] = useState(false)
  const [newRuleName, setNewRuleName] = useState('')
  const [newRuleMeetingType, setNewRuleMeetingType] = useState<'external' | 'internal' | 'all'>('external')
  const [newRuleKeywords, setNewRuleKeywords] = useState<string[]>([])
  const [keywordInput, setKeywordInput] = useState('')
  
  const [settings, setSettings] = useState<CalendarSettings>({
    syncMeetings: true,
    syncEvents: false,
    includePrivateEvents: false,
    meetingTypes: ['customer', 'prospect', 'demo'],
    minimumDuration: 15
  })

  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    { id: 'tm1', name: 'Sarah Chen', email: 'sarah.chen@company.com', role: 'Sales Director', isSelected: true },
    { id: 'tm2', name: 'Michael Rodriguez', email: 'michael.r@company.com', role: 'Sales Engineer', isSelected: true },
    { id: 'tm3', name: 'Emily Johnson', email: 'emily.j@company.com', role: 'VP of Sales', isSelected: true },
    { id: 'tm4', name: 'David Park', email: 'david.park@company.com', role: 'Account Executive', isSelected: false },
  ])

  const [ingestionRules, setIngestionRules] = useState<IngestionRule[]>([
    {
      id: '1',
      name: 'Customer meetings',
      meetingType: 'external',
      selectedAttendees: ['tm1', 'tm2', 'tm3'],
      meetingTitleKeywords: ['demo', 'discovery', 'kickoff', 'onboarding'],
      isActive: true
    }
  ])

  const handleConnect = async () => {
    setIsConnecting(true)
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsConnected(true)
    setIsConnecting(false)
  }

  const updateSetting = <K extends keyof CalendarSettings>(key: K, value: CalendarSettings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  const toggleTeamMember = (memberId: string) => {
    setTeamMembers(prev => prev.map(member => 
      member.id === memberId ? { ...member, isSelected: !member.isSelected } : member
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

  const createRule = () => {
    if (newRuleName.trim()) {
      const newRule: IngestionRule = {
        id: Date.now().toString(),
        name: newRuleName.trim(),
        meetingType: newRuleMeetingType,
        selectedAttendees: teamMembers.filter(m => m.isSelected).map(m => m.id),
        meetingTitleKeywords: [...newRuleKeywords],
        isActive: true
      }
      setIngestionRules(prev => [...prev, newRule])
      
      // Reset form
      setNewRuleName('')
      setNewRuleMeetingType('external')
      setNewRuleKeywords([])
      setShowCreateRule(false)
    }
  }

  const toggleRule = (ruleId: string) => {
    setIngestionRules(prev => prev.map(rule => 
      rule.id === ruleId ? { ...rule, isActive: !rule.isActive } : rule
    ))
  }

  const save = () => {
    const { configure } = useIntegrationsStore.getState()
    configure('google-calendar', { 
      settings,
      selectedTeamMembers: teamMembers.filter(m => m.isSelected),
      ingestionRules: ingestionRules.filter(r => r.isActive),
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
              <span className="text-sm font-bold text-white">GC</span>
            </div>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-gray-900">Connect Google Calendar</h1>
              <p className="text-gray-600 mt-0.5 text-sm">Connect your calendar for meeting insights</p>
            </div>
            <button onClick={onClose} className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center max-w-sm">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 mx-auto mb-6">
              <span className="text-3xl">📅</span>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Connect Google Calendar</h2>
            <p className="text-gray-600 mb-8">
              Access meeting data and scheduling insights to enhance Sales Knowledge Lake with customer interaction context.
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
                'Connect to Google Calendar'
              )}
            </button>
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
            <span className="text-sm font-bold text-white">GC</span>
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-gray-900">Google Calendar Configuration</h1>
            <p className="text-gray-600 mt-0.5 text-sm">Configure meeting and event sync settings</p>
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
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4">Sync Settings</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200 bg-gray-50">
                <div>
                  <div className="text-sm font-medium text-gray-900">Sync customer meetings</div>
                  <div className="text-xs text-gray-600">Include customer and prospect meetings</div>
                </div>
                <button
                  onClick={() => updateSetting('syncMeetings', !settings.syncMeetings)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.syncMeetings ? 'bg-gray-900' : 'bg-gray-300'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.syncMeetings ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200 bg-gray-50">
                <div>
                  <div className="text-sm font-medium text-gray-900">Sync all events</div>
                  <div className="text-xs text-gray-600">Include general calendar events</div>
                </div>
                <button
                  onClick={() => updateSetting('syncEvents', !settings.syncEvents)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.syncEvents ? 'bg-gray-900' : 'bg-gray-300'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.syncEvents ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Minimum meeting duration</label>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>0 min</span>
                    <span>5 min</span>
                    <span>15 min</span>
                    <span>30 min</span>
                    <span>60 min</span>
                  </div>
                  <div className="relative">
                    <input
                      type="range"
                      min="0"
                      max="4"
                      step="1"
                      value={[0, 5, 15, 30, 60].indexOf(settings.minimumDuration)}
                      onChange={(e) => {
                        const breakpoints = [0, 5, 15, 30, 60];
                        updateSetting('minimumDuration', breakpoints[parseInt(e.target.value)]);
                      }}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-with-steps"
                    />
                    <div className="flex justify-between absolute top-1/2 left-0 right-0 transform -translate-y-1/2 pointer-events-none">
                      {[0, 5, 15, 30, 60].map((_, index) => (
                        <div key={index} className="w-2 h-2 bg-gray-400 rounded-full"></div>
                      ))}
                    </div>
                  </div>
                  <div className="text-center">
                    <span className="text-sm font-medium text-gray-900 bg-gray-100 px-3 py-1 rounded-full">
                      {settings.minimumDuration} minutes
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Team Members */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Team Members</h3>
              <div className="text-sm text-gray-600">{teamMembers.filter(m => m.isSelected).length} members selected</div>
            </div>

            <div className="space-y-3">
              {teamMembers.map((member) => (
                <div 
                  key={member.id}
                  className={`rounded-lg border p-3 transition-all cursor-pointer ${
                    member.isSelected ? 'border-gray-900 bg-gray-50' : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                  onClick={() => toggleTeamMember(member.id)}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100">
                      <span className="text-xs font-semibold text-gray-700">{member.name.split(' ').map(n => n[0]).join('')}</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-gray-900">{member.name}</h4>
                      <div className="text-xs text-gray-600">{member.role} • {member.email}</div>
                    </div>
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                      member.isSelected ? 'border-gray-900 bg-gray-900' : 'border-gray-300'
                    }`}>
                      {member.isSelected && (
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

          {/* Ingestion Rules */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Meeting Ingestion Rules</h3>
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
              {ingestionRules.map((rule) => (
                <div key={rule.id} className="rounded-lg border border-gray-200 bg-white p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-sm font-semibold text-gray-900">{rule.name}</h4>
                        <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                          rule.meetingType === 'external' ? 'bg-green-100 text-green-800' :
                          rule.meetingType === 'internal' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {rule.meetingType} meetings
                        </span>
                      </div>
                      
                      <div className="space-y-2 text-xs text-gray-600">
                        <div>
                          <span className="font-medium">Keywords:</span> {rule.meetingTitleKeywords.join(', ') || 'None'}
                        </div>
                        <div>
                          <span className="font-medium">Attendees:</span> {rule.selectedAttendees.length} selected
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
                  <h4 className="text-sm font-semibold text-gray-900 mb-4">Create New Meeting Rule</h4>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Rule Name</label>
                      <input
                        type="text"
                        value={newRuleName}
                        onChange={(e) => setNewRuleName(e.target.value)}
                        placeholder="e.g., Customer meetings"
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Meeting Type</label>
                      <div className="flex gap-2">
                        {[
                          { value: 'external', label: 'External' },
                          { value: 'internal', label: 'Internal' },
                          { value: 'all', label: 'All' }
                        ].map((option) => (
                          <button
                            key={option.value}
                            onClick={() => setNewRuleMeetingType(option.value as any)}
                            className={`px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
                              newRuleMeetingType === option.value
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
            Google Calendar help
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
