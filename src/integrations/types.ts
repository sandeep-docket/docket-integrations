export type IntegrationCategory =
  | 'CRM'
  | 'Communication'
  | 'Storage & Wiki'
  | 'Enablement'

export type IntegrationProvider = {
  id: string
  name: string
  description: string
  category: IntegrationCategory
  website?: string
  iconUrl?: string
  oauth?: boolean
  scopes?: string[]
}

export type ConnectedIntegration = {
  providerId: string
  status: 'connected' | 'disconnected' | 'error'
  addedAt: string
  accountLabel?: string
  settings?: Record<string, unknown>
}

export type IntegrationState = {
  providers: IntegrationProvider[]
  connections: Record<string, ConnectedIntegration>
}


