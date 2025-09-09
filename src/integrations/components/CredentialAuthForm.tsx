import { useState } from 'react'
import { IntegrationAvatar } from './IntegrationAvatar'

export type CredentialField = {
  key: string
  label: string
  type: 'email' | 'password' | 'text' | 'url'
  placeholder: string
  required?: boolean
}

type CredentialAuthFormProps = {
  providerId: string
  providerName: string
  title: string
  description: string
  fields: CredentialField[]
  onConnect: (credentials: Record<string, string>) => void
  onClose: () => void
  isConnecting?: boolean
}

export function CredentialAuthForm({
  providerId,
  providerName,
  title,
  description,
  fields,
  onConnect,
  onClose,
  isConnecting = false
}: CredentialAuthFormProps) {
  const [credentials, setCredentials] = useState<Record<string, string>>(
    fields.reduce((acc, field) => ({ ...acc, [field.key]: '' }), {})
  )

  const updateCredential = (key: string, value: string) => {
    setCredentials(prev => ({ ...prev, [key]: value }))
  }

  const isValid = fields
    .filter(field => field.required !== false)
    .every(field => credentials[field.key]?.trim())

  const handleSubmit = () => {
    if (isValid) {
      onConnect(credentials)
    }
  }

  return (
    <div className="flex h-full flex-col bg-white rounded-xl overflow-hidden">
      <div className="border-b border-gray-200 px-6 py-6">
        <div className="flex items-center gap-4">
          <IntegrationAvatar 
            providerId={providerId}
            providerName={providerName}
            size="md"
          />
          <div className="flex-1">
            <h1 className="text-xl font-bold text-gray-900">{title}</h1>
            <p className="text-gray-600 mt-0.5 text-sm">{description}</p>
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

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <div className="text-center mb-6">
            <div className="mx-auto mb-4">
              <IntegrationAvatar 
                providerId={providerId}
                providerName={providerName}
                size="lg"
                className="h-16 w-16 mx-auto"
              />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">{title}</h2>
            <p className="text-gray-600 mb-6">{description}</p>
          </div>

          <div className="space-y-4">
            {fields.map((field) => (
              <div key={field.key}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {field.label}
                  {field.required !== false && <span className="text-red-500 ml-1">*</span>}
                </label>
                <input
                  type={field.type}
                  value={credentials[field.key] || ''}
                  onChange={(e) => updateCredential(field.key, e.target.value)}
                  placeholder={field.placeholder}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
                />
              </div>
            ))}
            
            <button
              onClick={handleSubmit}
              disabled={!isValid || isConnecting}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gray-900 px-6 py-3 text-sm font-semibold text-white hover:bg-gray-800 disabled:opacity-50 transition-colors"
            >
              {isConnecting ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>Connecting...</span>
                </>
              ) : (
                `Connect to ${providerName}`
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
