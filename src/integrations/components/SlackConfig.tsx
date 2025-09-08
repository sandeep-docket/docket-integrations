import { useState } from 'react'
import { useIntegrationsStore } from '../store'

type SlackChannel = {
  id: string
  name: string
  isPrivate: boolean
  memberCount: number
  hasDocketBot: boolean
}

type SlackSettings = {
  respondToAtDocket: boolean
  respondInAllChannels: boolean
  selectedChannels: string[]
  autoRespondToQuestions: boolean
  autoRespondInAllChannels: boolean
  autoSelectedChannels: string[]
  forwardUnansweredQuestions: boolean
  allowAnyoneToAddBot: boolean
}

export function SlackConfigPanel({ onClose }: { onClose: () => void }) {
  const configure = useIntegrationsStore((s) => s.configure)
  const [isConnected, setIsConnected] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  
  // Mock Slack channels
  const [channels] = useState<SlackChannel[]>([
    { id: 'general', name: 'general', isPrivate: false, memberCount: 25, hasDocketBot: true },
    { id: 'sales-team', name: 'sales-team', isPrivate: true, memberCount: 8, hasDocketBot: true },
    { id: 'marketing', name: 'marketing', isPrivate: false, memberCount: 12, hasDocketBot: false },
    { id: 'product', name: 'product', isPrivate: false, memberCount: 15, hasDocketBot: false },
    { id: 'customer-success', name: 'customer-success', isPrivate: true, memberCount: 6, hasDocketBot: true },
  ])

  const [settings, setSettings] = useState<SlackSettings>({
    respondToAtDocket: true,
    respondInAllChannels: true,
    selectedChannels: [],
    autoRespondToQuestions: false,
    autoRespondInAllChannels: false,
    autoSelectedChannels: [],
    forwardUnansweredQuestions: true,
    allowAnyoneToAddBot: true
  })

  const handleConnect = async () => {
    setIsConnecting(true)
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsConnected(true)
    setIsConnecting(false)
  }

  const updateSetting = <K extends keyof SlackSettings>(key: K, value: SlackSettings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  const toggleChannel = (channelId: string, settingKey: 'selectedChannels' | 'autoSelectedChannels') => {
    const currentChannels = settings[settingKey]
    const newChannels = currentChannels.includes(channelId)
      ? currentChannels.filter(id => id !== channelId)
      : [...currentChannels, channelId]
    updateSetting(settingKey, newChannels)
  }

  const save = () => {
    configure('slack', { settings, channels: channels.filter(c => c.hasDocketBot) })
    onClose()
  }

  if (!isConnected) {
    return (
      <div className="flex h-full flex-col bg-white rounded-xl overflow-hidden">
        {/* Header */}
        <div className="border-b border-gray-200 px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg">
                <span className="text-sm font-bold text-white">S</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Connect Slack</h1>
                <p className="text-gray-600 mt-0.5 text-sm">Connect your Slack workspace to Docket</p>
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
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-100 to-pink-100 mx-auto mb-6">
              <span className="text-3xl">💬</span>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Connect your Slack workspace</h2>
            <p className="text-gray-600 mb-8">
              Enable AI-powered responses and insights directly in your Slack channels. 
              Docket will help your team get instant answers to go-to-market questions.
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
                  Connect to Slack
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
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg">
              <span className="text-sm font-bold text-white">S</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Slack Configuration</h1>
              <p className="text-gray-600 mt-0.5 text-sm">Configure AI responses and channel settings</p>
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
        {/* Channels Section */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Channels with Docket Bot</h3>
          <p className="text-sm text-gray-600 mb-4">
            Channels where the Docket bot is installed. New channels can only be added from Slack.
          </p>
          <div className="space-y-2">
            {channels.filter(c => c.hasDocketBot).map((channel) => (
              <div key={channel.id} className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-100">
                    <span className="text-sm">{channel.isPrivate ? '🔒' : '#'}</span>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">{channel.name}</div>
                    <div className="text-xs text-gray-500">{channel.memberCount} members</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-green-600 font-medium">Bot installed</span>
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Response Settings */}
        <div className="space-y-6">
          {/* @docket responses */}
          <SettingCard
            title="Respond to @docket in Slack"
            description="Allow teammates to get instant answers by using @docket tag in channels"
            checked={settings.respondToAtDocket}
            onChange={(checked) => updateSetting('respondToAtDocket', checked)}
          >
            {settings.respondToAtDocket && (
              <div className="mt-4 space-y-3">
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      checked={settings.respondInAllChannels}
                      onChange={() => updateSetting('respondInAllChannels', true)}
                      className="h-4 w-4 text-gray-900 border-gray-300 focus:ring-gray-900"
                    />
                    <span className="text-sm text-gray-700">Respond in all channels</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      checked={!settings.respondInAllChannels}
                      onChange={() => updateSetting('respondInAllChannels', false)}
                      className="h-4 w-4 text-gray-900 border-gray-300 focus:ring-gray-900"
                    />
                    <span className="text-sm text-gray-700">Respond in selected channels</span>
                  </label>
                </div>
                {!settings.respondInAllChannels && (
                  <ChannelSelector
                    channels={channels.filter(c => c.hasDocketBot)}
                    selectedChannels={settings.selectedChannels}
                    onToggleChannel={(channelId) => toggleChannel(channelId, 'selectedChannels')}
                  />
                )}
              </div>
            )}
          </SettingCard>

          {/* Auto responses */}
          <SettingCard
            title="Automatically respond to questions"
            description="Respond to questions even when @docket tag is not used"
            checked={settings.autoRespondToQuestions}
            onChange={(checked) => updateSetting('autoRespondToQuestions', checked)}
          >
            {settings.autoRespondToQuestions && (
              <div className="mt-4 space-y-3">
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      checked={settings.autoRespondInAllChannels}
                      onChange={() => updateSetting('autoRespondInAllChannels', true)}
                      className="h-4 w-4 text-gray-900 border-gray-300 focus:ring-gray-900"
                    />
                    <span className="text-sm text-gray-700">Respond in all channels</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      checked={!settings.autoRespondInAllChannels}
                      onChange={() => updateSetting('autoRespondInAllChannels', false)}
                      className="h-4 w-4 text-gray-900 border-gray-300 focus:ring-gray-900"
                    />
                    <span className="text-sm text-gray-700">Respond in selected channels</span>
                  </label>
                </div>
                {!settings.autoRespondInAllChannels && (
                  <ChannelSelector
                    channels={channels.filter(c => c.hasDocketBot)}
                    selectedChannels={settings.autoSelectedChannels}
                    onToggleChannel={(channelId) => toggleChannel(channelId, 'autoSelectedChannels')}
                  />
                )}
              </div>
            )}
          </SettingCard>

          {/* Forward unanswered questions */}
          <SettingCard
            title="Forward unanswered questions"
            description="Forward questions that Docket cannot answer to designated team members"
            checked={settings.forwardUnansweredQuestions}
            onChange={(checked) => updateSetting('forwardUnansweredQuestions', checked)}
          />

          {/* Allow bot additions */}
          <SettingCard
            title="Allow anyone to add Docket bot to channels"
            description="Let any team member add the Docket bot to new channels"
            checked={settings.allowAnyoneToAddBot}
            onChange={(checked) => updateSetting('allowAnyoneToAddBot', checked)}
          />
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 bg-gray-50 px-6 py-6">
        <div className="flex items-center justify-between">
          <button className="inline-flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900 font-medium">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Slack integration help
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
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function SettingCard({ 
  title, 
  description, 
  checked, 
  onChange, 
  children 
}: { 
  title: string
  description: string
  checked: boolean
  onChange: (checked: boolean) => void
  children?: React.ReactNode
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h4 className="text-base font-semibold text-gray-900 mb-1">{title}</h4>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
        <button
          onClick={() => onChange(!checked)}
          className={`relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 ml-4 ${
            checked ? 'bg-gray-900' : 'bg-gray-300'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
              checked ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>
      {children}
    </div>
  )
}

function ChannelSelector({ 
  channels, 
  selectedChannels, 
  onToggleChannel 
}: { 
  channels: SlackChannel[]
  selectedChannels: string[]
  onToggleChannel: (channelId: string) => void
}) {
  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
      <h5 className="text-sm font-medium text-gray-900 mb-3">Select channels:</h5>
      <div className="space-y-2 max-h-32 overflow-y-auto">
        {channels.map((channel) => (
          <label key={channel.id} className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={selectedChannels.includes(channel.id)}
              onChange={() => onToggleChannel(channel.id)}
              className="h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900"
            />
            <div className="flex items-center gap-2">
              <span className="text-sm">{channel.isPrivate ? '🔒' : '#'}</span>
              <span className="text-sm text-gray-900">{channel.name}</span>
              <span className="text-xs text-gray-500">({channel.memberCount})</span>
            </div>
          </label>
        ))}
      </div>
    </div>
  )
}
