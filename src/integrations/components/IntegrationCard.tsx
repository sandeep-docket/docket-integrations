import { useState } from 'react'
import { Cog6ToothIcon, CheckIcon } from '@heroicons/react/24/outline'
import { PlusIcon } from '@heroicons/react/20/solid'
import { useIntegrationsStore } from '../store'
import type { IntegrationProvider } from '../types'
import toast from 'react-hot-toast'
import { ConfigureDrawer } from './ConfigureDrawer'

export function IntegrationCard({ provider, connected }: { provider: IntegrationProvider; connected: boolean }) {
  const { connect } = useIntegrationsStore()
  const [loading, setLoading] = useState<null | 'connect' | 'disconnect'>(null)
  const [open, setOpen] = useState(false)

  const onConnect = async () => {
    setLoading('connect')
    await new Promise((r) => setTimeout(r, 700))
    connect(provider.id, 'demo@company.com')
    toast.success(`${provider.name} connected`)
    setLoading(null)
  }



  return (
    <div className="w-[316px] rounded-lg border border-[#E7E7E9] bg-white">
      {/* Main content */}
      <div className="flex items-center gap-4 p-4">
        {/* Icon */}
        <div className="h-12 w-12 rounded-[9.6px] border border-black/10 bg-white flex items-center justify-center">
          <div className="text-lg font-bold text-gray-600">{provider.name[0]}</div>
        </div>
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold leading-[17px] text-[#242424]">{provider.name}</div>
          <div className="text-sm leading-[17px] text-[#616161]">{provider.category}</div>
        </div>

        {/* Configure button for connected apps */}
        {connected && (
          <button 
            onClick={() => setOpen(true)}
            className="h-10 w-10 rounded-lg border border-gray-300/50 flex items-center justify-center hover:bg-gray-50"
          >
            <Cog6ToothIcon className="h-5 w-5 text-gray-500" />
          </button>
        )}
      </div>

      {/* Bottom action bar */}
      {!connected ? (
        <div className="border-t border-[#E7E7E9] bg-[#F2F8FF] border-[rgba(178,221,255,0.2)] h-11 flex items-center justify-center gap-2 text-[#358EF5]">
          <PlusIcon className="h-5 w-5" />
          <button 
            onClick={onConnect} 
            disabled={loading === 'connect'}
            className="text-sm font-medium"
          >
            {loading === 'connect' ? 'Connecting...' : 'Connect'}
          </button>
        </div>
      ) : (
        <div className="border-t border-[#E7E7E9] h-11 flex items-center justify-center gap-2 text-[#242424]">
          <CheckIcon className="h-5 w-5 text-[#13A10E]" />
          <span className="text-sm">Connected</span>
        </div>
      )}

      <ConfigureDrawer provider={provider} open={open} onClose={() => setOpen(false)} />
    </div>
  )
}