import { IntegrationAvatar } from './IntegrationAvatar'

type ConfigurationHeaderProps = {
  providerId?: string
  providerName?: string
  icon?: string // Fallback if providerId not provided
  title: string
  subtitle: string
  onClose: () => void
  connected?: boolean
  connectedAs?: string
}

export function ConfigurationHeader({
  providerId,
  providerName,
  icon,
  title,
  subtitle,
  onClose,
  connected = false,
  connectedAs
}: ConfigurationHeaderProps) {
  return (
    <div className="border-b border-gray-200 px-6 py-6">
      <div className="flex items-center gap-4">
        {providerId && providerName ? (
          <IntegrationAvatar 
            providerId={providerId}
            providerName={providerName}
            size="md"
          />
        ) : (
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-gray-800 to-gray-900">
            <span className="text-sm font-bold text-white">{icon}</span>
          </div>
        )}
        <div className="flex-1">
          <h1 className="text-xl font-bold text-gray-900">{title}</h1>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-gray-600 text-sm">{subtitle}</p>
            {connected && connectedAs && (
              <span className="text-xs text-gray-500">• Connected as {connectedAs}</span>
            )}
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
  )
}
