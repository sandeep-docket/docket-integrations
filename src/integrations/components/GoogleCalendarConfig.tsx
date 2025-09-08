import { useState } from 'react'
import { useIntegrationsStore } from '../store'

type CalendarSettings = {
  syncMeetings: boolean
  syncEvents: boolean
  includePrivateEvents: boolean
  meetingTypes: string[]
  minimumDuration: number
}

export function GoogleCalendarConfigPanel({ onClose }: { onClose: () => void }) {
  const { connections } = useIntegrationsStore()
  const isAlreadyConnected = Boolean(connections['google-calendar'])
  
  const [isConnected, setIsConnected] = useState(isAlreadyConnected)
  const [isConnecting, setIsConnecting] = useState(false)
  
  const [settings, setSettings] = useState<CalendarSettings>({
    syncMeetings: true,
    syncEvents: false,
    includePrivateEvents: false,
    meetingTypes: ['customer', 'prospect', 'demo'],
    minimumDuration: 15
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
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="5"
                    max="60"
                    value={settings.minimumDuration}
                    onChange={(e) => updateSetting('minimumDuration', parseInt(e.target.value))}
                    className="flex-1 h-2 bg-gray-200 rounded-lg"
                  />
                  <span className="text-sm font-medium text-gray-900 min-w-[3rem]">{settings.minimumDuration} min</span>
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
