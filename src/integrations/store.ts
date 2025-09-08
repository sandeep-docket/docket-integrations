import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { PROVIDERS } from './data'
import type { ConnectedIntegration, IntegrationProvider, IntegrationState } from './types'

type Actions = {
  connect: (providerId: string, accountLabel?: string) => void
  disconnect: (providerId: string) => void
  configure: (providerId: string, settings: Record<string, unknown>) => void
}

type Store = IntegrationState & Actions

export const useIntegrationsStore = create<Store>()(
  persist(
    (set, get) => ({
      providers: PROVIDERS as IntegrationProvider[],
      connections: {},
      connect: (providerId, accountLabel) => {
        const connection: ConnectedIntegration = {
          providerId,
          status: 'connected',
          addedAt: new Date().toISOString(),
          accountLabel,
        }
        set((s) => ({ connections: { ...s.connections, [providerId]: connection } }))
      },
      disconnect: (providerId) => {
        set((s) => {
          const copy = { ...s.connections }
          delete copy[providerId]
          return { connections: copy }
        })
      },
      configure: (providerId, settings) => {
        const current = get().connections[providerId]
        if (!current) return
        set((s) => ({
          connections: {
            ...s.connections,
            [providerId]: { ...current, settings },
          },
        }))
      },
    }),
    { name: 'docket-integrations' },
  ),
)

