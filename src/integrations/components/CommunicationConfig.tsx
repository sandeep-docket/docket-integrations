import { useState } from 'react'
import { useIntegrationsStore } from '../store'
import type { IntegrationProvider } from '../types'

type Channel = {
  id: string
  name: string
  isPrivate: boolean
  memberCount: number
}

type CommunicationSettings = {
  respondToMentions: boolean
  respondInAllChannels: boolean
  selectedChannels: string[]
  autoRespondToQuestions: boolean
  autoRespondInAllChannels: boolean
  autoSelectedChannels: string[]
  forwardUnansweredQuestions: boolean
  allowAnyoneToAddBot: boolean
}

// Configuration for different communication platforms
const getProviderConfig = (providerId: string) => {
  const configs = {
    slack: {
      name: 'Slack',
      icon: '💬',
      color: 'purple',
      mentionText: '@docket',
      botName: 'Docket bot',
      channels: [
        { id: 'general', name: 'general', isPrivate: false, memberCount: 25 },
        { id: 'sales-team', name: 'sales-team', isPrivate: true, memberCount: 8 },
        { id: 'marketing', name: 'marketing', isPrivate: false, memberCount: 12 },
        { id: 'product', name: 'product', isPrivate: false, memberCount: 15 },
        { id: 'customer-success', name: 'customer-success', isPrivate: true, memberCount: 6 },
        { id: 'engineering', name: 'engineering', isPrivate: false, memberCount: 20 },
        { id: 'design', name: 'design', isPrivate: false, memberCount: 7 }
      ]
    },
    msteams: {
      name: 'Microsoft Teams',
      icon: '🔷',
      color: 'blue',
      mentionText: '@Docket',
      botName: 'Docket app',
      channels: [
        { id: 'general', name: 'General', isPrivate: false, memberCount: 30 },
        { id: 'sales', name: 'Sales Team', isPrivate: true, memberCount: 12 },
        { id: 'marketing', name: 'Marketing', isPrivate: false, memberCount: 15 },
        { id: 'leadership', name: 'Leadership', isPrivate: true, memberCount: 5 }
      ]
    }
  }
  return configs[providerId as keyof typeof configs] || configs.slack
}

export function CommunicationConfigPanel({ provider, onClose }: { provider: IntegrationProvider; onClose: () => void }) {
  const configure = useIntegrationsStore((s) => s.configure)
  
  const config = getProviderConfig(provider.id)
  const [channels] = useState<Channel[]>(config.channels)
  
  const [settings, setSettings] = useState<CommunicationSettings>({
    respondToMentions: true,
    respondInAllChannels: true,
    selectedChannels: [],
    autoRespondToQuestions: false,
    autoRespondInAllChannels: false,
    autoSelectedChannels: [],
    forwardUnansweredQuestions: true,
    allowAnyoneToAddBot: true
  })

  const updateSetting = <K extends keyof CommunicationSettings>(key: K, value: CommunicationSettings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  const save = () => {
    configure(provider.id, { settings, connectedChannels: channels.length })
    onClose()
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
        <div className="space-y-8">
          {/* Response Modes */}
          <div>
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Response Configuration</h3>
              <p className="text-gray-600">Configure how Docket AI responds to your team in {config.name}</p>
            </div>
            <div className="space-y-6">
              {/* Mention responses */}
              <SettingCard
                title="Mention-based responses"
                description={`Respond when team members use ${config.mentionText} in messages`}
                checked={settings.respondToMentions}
                onChange={(checked) => updateSetting('respondToMentions', checked)}
                icon={
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100">
                    <span className="text-sm font-bold text-gray-700">@</span>
                  </div>
                }
              >
                {settings.respondToMentions && (
                  <div className="mt-4 space-y-4">
                    <ChannelScopeSelector
                      allChannels={settings.respondInAllChannels}
                      onScopeChange={(allChannels) => updateSetting('respondInAllChannels', allChannels)}
                      channels={channels}
                      selectedChannels={settings.selectedChannels}
                      onChannelChange={(channels) => updateSetting('selectedChannels', channels)}
                      label="Where to respond to mentions"
                    />
                  </div>
                )}
              </SettingCard>

              {/* Auto responses */}
              <SettingCard
                title="Smart auto-responses"
                description="Automatically detect and respond to questions without requiring mentions"
                checked={settings.autoRespondToQuestions}
                onChange={(checked) => updateSetting('autoRespondToQuestions', checked)}
                icon={
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100">
                    <svg className="h-4 w-4 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                }
              >
                {settings.autoRespondToQuestions && (
                  <div className="mt-4 space-y-4">
                    <div className="rounded-lg bg-amber-50 border border-amber-200 p-3">
                      <div className="flex gap-2">
                        <svg className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        <div>
                          <p className="text-xs font-medium text-amber-800">
                            Docket will analyze messages and respond when it detects go-to-market questions
                          </p>
                        </div>
                      </div>
                    </div>
                    <ChannelScopeSelector
                      allChannels={settings.autoRespondInAllChannels}
                      onScopeChange={(allChannels) => updateSetting('autoRespondInAllChannels', allChannels)}
                      channels={channels}
                      selectedChannels={settings.autoSelectedChannels}
                      onChannelChange={(channels) => updateSetting('autoSelectedChannels', channels)}
                      label="Where to auto-respond"
                    />
                  </div>
                )}
              </SettingCard>
            </div>
          </div>

          {/* Team & Permissions */}
          <div>
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Team & Permissions</h3>
              <p className="text-gray-600">Control how team members can interact with Docket</p>
            </div>
            <div className="space-y-4">
              {/* Allow bot additions */}
              <SettingCard
                title={`Allow team members to add ${config.botName}`}
                description={`Any workspace member can invite the ${config.botName} to new channels and conversations`}
                checked={settings.allowAnyoneToAddBot}
                onChange={(checked) => updateSetting('allowAnyoneToAddBot', checked)}
                icon={
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100">
                    <svg className="h-4 w-4 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                  </div>
                }
              />

              {/* Forward unanswered questions */}
              <SettingCard
                title="Forward unanswered questions"
                description="When Docket cannot answer a question, forward it to designated team members for follow-up"
                checked={settings.forwardUnansweredQuestions}
                onChange={(checked) => updateSetting('forwardUnansweredQuestions', checked)}
                icon={
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100">
                    <svg className="h-4 w-4 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </div>
                }
              />
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
            {config.name} integration help
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
  icon,
  children 
}: { 
  title: string
  description: string
  checked: boolean
  onChange: (checked: boolean) => void
  icon?: React.ReactNode
  children?: React.ReactNode
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4">
        {icon && <div className="flex-shrink-0 mt-1">{icon}</div>}
        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <div>
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
      </div>
    </div>
  )
}

function ChannelScopeSelector({
  allChannels,
  onScopeChange,
  channels,
  selectedChannels,
  onChannelChange,
  label
}: {
  allChannels: boolean
  onScopeChange: (allChannels: boolean) => void
  channels: Channel[]
  selectedChannels: string[]
  onChannelChange: (channels: string[]) => void
  label: string
}) {
  const [searchQuery, setSearchQuery] = useState('')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  
  const selectedChannelObjects = channels.filter(c => selectedChannels.includes(c.id))
  const filteredChannels = channels.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const addChannel = (channelId: string) => {
    if (!selectedChannels.includes(channelId)) {
      onChannelChange([...selectedChannels, channelId])
    }
    setSearchQuery('')
    setIsDropdownOpen(false)
  }

  const removeChannel = (channelId: string) => {
    onChannelChange(selectedChannels.filter(id => id !== channelId))
  }

  return (
    <div className="space-y-4">
      <div className="text-sm font-medium text-gray-900">{label}</div>
      
      {/* Scope toggle */}
      <div className="flex rounded-lg bg-gray-100 p-1">
        <button
          onClick={() => onScopeChange(true)}
          className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-all ${
            allChannels
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          All channels
        </button>
        <button
          onClick={() => onScopeChange(false)}
          className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-all ${
            !allChannels
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Selected channels
        </button>
      </div>

      {/* Channel input when not all channels */}
      {!allChannels && (
        <div className="space-y-3">
          {/* Inline channel input with chips */}
          <div className="relative">
            <div className="flex flex-wrap gap-2 rounded-lg border border-gray-300 bg-white p-2 focus-within:border-gray-900 focus-within:ring-1 focus-within:ring-gray-900">
              {selectedChannelObjects.map((channel) => (
                <div key={channel.id} className="inline-flex items-center gap-1 rounded-md bg-gray-100 px-2 py-1 text-sm">
                  <span className="text-xs">{channel.isPrivate ? '🔒' : '#'}</span>
                  <span className="font-medium text-gray-900">{channel.name}</span>
                  <button
                    onClick={() => removeChannel(channel.id)}
                    className="text-gray-400 hover:text-gray-600 ml-1"
                  >
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
              <input
                type="text"
                placeholder="Type to search channels..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setIsDropdownOpen(e.target.value.length > 0)
                }}
                onFocus={() => setIsDropdownOpen(searchQuery.length > 0)}
                className="flex-1 min-w-[120px] border-0 bg-transparent p-1 text-sm focus:outline-none"
              />
            </div>
            
            {/* Dropdown results */}
            {isDropdownOpen && filteredChannels.length > 0 && (
              <div className="absolute z-10 mt-1 w-full rounded-lg bg-white border border-gray-200 shadow-lg max-h-48 overflow-y-auto">
                {filteredChannels.filter(c => !selectedChannels.includes(c.id)).map((channel) => (
                  <button
                    key={channel.id}
                    onClick={() => addChannel(channel.id)}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
                  >
                    <span className="text-sm">{channel.isPrivate ? '🔒' : '#'}</span>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900">{channel.name}</div>
                      <div className="text-xs text-gray-500">{channel.memberCount} members</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
