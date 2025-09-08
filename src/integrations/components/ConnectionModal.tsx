import { Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import type { IntegrationProvider } from '../types'

type ConnectionModalProps = {
  provider: IntegrationProvider
  open: boolean
  onClose: () => void
  onConfirm: () => void
}

export function ConnectionModal({ provider, open, onClose, onConfirm }: ConnectionModalProps) {
  const [isConnecting, setIsConnecting] = useState(false)

  const getProviderPermissions = (providerId: string) => {
    const permissions: Record<string, string[]> = {
      'salesforce': [
        'Connect your Salesforce account to Docket',
        'Sync leads, contacts, and opportunities automatically',
        'Enable AI-powered insights from your CRM data',
        'Access account and contact information for Sales Knowledge Lake'
      ],
      'hubspot': [
        'Connect your HubSpot account to Docket',
        'Sync contacts, companies, and deals',
        'Access marketing and sales pipeline data',
        'Enable automated lead scoring and insights'
      ],
      'slack': [
        'Connect your Slack workspace to Docket',
        'Send AI-generated insights to relevant channels',
        'Access channel information for context'
      ],
      'google-drive': [
        'Connect your Google Drive to Docket',
        'Access sales collateral and documents',
        'Sync files for Sales Knowledge Lake'
      ],
      'notion': [
        'Connect your Notion workspace to Docket',
        'Access knowledge base and documentation',
        'Sync pages for enhanced AI responses'
      ]
    }
    return permissions[providerId] || ['Connect your account to Docket', 'Enable data synchronization']
  }

  const getProviderIcon = (name: string) => {
    const icons: Record<string, string> = {
      'Salesforce': '⚡',
      'HubSpot': '🟠', 
      'Slack': '💬',
      'Google Drive': '📁',
      'Notion': '📝',
      'Microsoft Teams': '🔷',
      'Zendesk': '📞',
      'Intercom': '💬'
    }
    return icons[name] || '🔗'
  }

  const handleConnect = async () => {
    setIsConnecting(true)
    // Simulate OAuth flow
    await new Promise(resolve => setTimeout(resolve, 1500))
    onConfirm()
    setIsConnecting(false)
  }

  const permissions = getProviderPermissions(provider.id)

  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="relative w-full max-w-md transform overflow-hidden rounded-xl border border-gray-200 bg-white shadow-2xl transition-all">
                {/* Decorative gradient bar */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 opacity-60 blur-sm" />
                
                {/* Content */}
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-lg text-2xl">
                      {getProviderIcon(provider.name)}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{provider.name}</h3>
                      <p className="text-sm text-gray-500">{provider.category} integration</p>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-gray-200 mb-6" />

                  {/* Connection Benefits */}
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Connecting {provider.name} will enable:</h4>
                    <div className="space-y-3">
                      {permissions.map((permission, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-100 mt-0.5 flex-shrink-0">
                            <svg className="h-3 w-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <span className="text-sm text-gray-700 leading-relaxed">{permission}</span>
                        </div>
                      ))}
                    </div>
                    
                    {/* Docket-specific context */}
                    <div className="mt-4 rounded-lg bg-gray-50 p-4">
                      <div className="flex items-start gap-3">
                        <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-gray-900">
                          <span className="text-xs font-bold text-white">D</span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">Sales Knowledge Lake™</p>
                          <p className="text-xs text-gray-600 mt-1">
                            This integration will contribute to your centralized go-to-market knowledge, 
                            enabling AI agents to provide instant, sourced answers.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="border-t border-gray-200 bg-gray-50 px-6 py-4">
                  <div className="flex justify-end gap-3">
                    <button
                      onClick={onClose}
                      disabled={isConnecting}
                      className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleConnect}
                      disabled={isConnecting}
                      className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800 disabled:opacity-50 transition-colors shadow-lg min-w-[80px]"
                    >
                      {isConnecting ? (
                        <div className="flex items-center gap-2">
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                          <span>Connecting...</span>
                        </div>
                      ) : (
                        'Connect'
                      )}
                    </button>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}
