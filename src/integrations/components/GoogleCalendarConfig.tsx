import { useState } from 'react'
import { useIntegrationsStore } from '../store'

type CalendarSettings = {
  syncMeetingTitles: boolean
  syncMeetingDescriptions: boolean
  syncAttendees: boolean
  includeInternalMeetings: boolean
  includeExternalMeetings: boolean
  keywordFilters: string[]
}

export function GoogleCalendarConfigPanel({ onClose }: { onClose: () => void }) {
  const { connections } = useIntegrationsStore()
  const isAlreadyConnected = Boolean(connections['google-calendar'])
  
  const [isConnected, setIsConnected] = useState(isAlreadyConnected)
  const [isConnecting, setIsConnecting] = useState(false)
  const [keywordInput, setKeywordInput] = useState('')
  
  const [settings, setSettings] = useState<CalendarSettings>({
    syncMeetingTitles: true,
    syncMeetingDescriptions: true,
    syncAttendees: false,
    includeInternalMeetings: false,
    includeExternalMeetings: true,
    keywordFilters: ['demo', 'discovery', 'proposal', 'kickoff']
  })

  const handleConnect = async () => {
    setIsConnecting(true)
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsConnected(true)
    setIsConnecting(false)
  }

  const updateSetting = <K extends keyof CalendarSettings>(key: K, value: CalendarSettings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  const addKeyword = () => {
    const keyword = keywordInput.trim()
    if (keyword && !settings.keywordFilters.includes(keyword)) {
      setSettings(prev => ({ ...prev, keywordFilters: [...prev.keywordFilters, keyword] }))
      setKeywordInput('')
    }
  }

  const removeKeyword = (keyword: string) => {
    setSettings(prev => ({ ...prev, keywordFilters: prev.keywordFilters.filter(k => k !== keyword) }))
  }

  const save = () => {
    const { configure } = useIntegrationsStore.getState()
    configure('google-calendar', { 
      settings,
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
              <p className="text-gray-600 mt-0.5 text-sm">Connect your Google Calendar to Docket</p>
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
              Access meeting data and calendar insights to enhance Sales Knowledge Lake with meeting context and scheduling patterns.
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
            <p className="text-gray-600 mt-0.5 text-sm">Configure meeting data sync settings</p>
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
          {/* Sync Settings */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4">Meeting Data Sync</h3>
            <div className="space-y-3">
              <SettingRow title="Sync meeting titles" description="Include meeting titles in Knowledge Lake" checked={settings.syncMeetingTitles} onChange={(checked) => updateSetting('syncMeetingTitles', checked)} />
              <SettingRow title="Sync meeting descriptions" description="Include meeting agendas and descriptions" checked={settings.syncMeetingDescriptions} onChange={(checked) => updateSetting('syncMeetingDescriptions', checked)} />
              <SettingRow title="Include attendee information" description="Sync meeting attendee lists" checked={settings.syncAttendees} onChange={(checked) => updateSetting('syncAttendees', checked)} />
            </div>
          </div>

          {/* Meeting Types */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4">Meeting Types</h3>
            <div className="space-y-3">
              <SettingRow title="External meetings" description="Customer and prospect meetings" checked={settings.includeExternalMeetings} onChange={(checked) => updateSetting('includeExternalMeetings', checked)} />
              <SettingRow title="Internal meetings" description="Team meetings and internal discussions" checked={settings.includeInternalMeetings} onChange={(checked) => updateSetting('includeInternalMeetings', checked)} />
            </div>
          </div>

          {/* Keyword Filters */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4">Meeting Title Filters</h3>
            {settings.keywordFilters.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                {settings.keywordFilters.map((keyword) => (
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
            <div className="flex gap-2">
              <input
                type="text"
                value={keywordInput}
                onChange={(e) => setKeywordInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addKeyword()}
                placeholder="Add meeting title keyword"
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

function SettingRow({ title, description, checked, onChange }: { title: string; description: string; checked: boolean; onChange: (checked: boolean) => void }) {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200 bg-gray-50">
      <div>
        <div className="text-sm font-medium text-gray-900">{title}</div>
        <div className="text-xs text-gray-600">{description}</div>
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
          checked ? 'bg-gray-900' : 'bg-gray-300'
        }`}
      >
        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
      </button>
    </div>
  )
}
