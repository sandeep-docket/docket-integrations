import { useState } from 'react'
import { useIntegrationsStore } from '../store'

type ZapierWorkflow = {
  id: string
  name: string
  trigger: string
  action: string
  lastRun: string
  runCount: number
  isSelected: boolean
}

export function ZapierConfigPanel({ onClose }: { onClose: () => void }) {
  const { connections } = useIntegrationsStore()
  const isAlreadyConnected = Boolean(connections['zapier'])
  
  const [isConnected, setIsConnected] = useState(isAlreadyConnected)
  const [isConnecting, setIsConnecting] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  
  const [workflows, setWorkflows] = useState<ZapierWorkflow[]>([
    { id: 'z1', name: 'New Lead from Website → Salesforce', trigger: 'Webhook', action: 'Create Salesforce Lead', lastRun: '2 hours ago', runCount: 156, isSelected: true },
    { id: 'z2', name: 'Slack Mention → Create Zendesk Ticket', trigger: 'Slack Mention', action: 'Create Zendesk Ticket', lastRun: '1 day ago', runCount: 45, isSelected: true },
    { id: 'z3', name: 'New Deal → Notify Team in Slack', trigger: 'HubSpot Deal', action: 'Send Slack Message', lastRun: '3 hours ago', runCount: 89, isSelected: false },
    { id: 'z4', name: 'Form Submission → Add to Mailchimp', trigger: 'Form Submit', action: 'Add Mailchimp Contact', lastRun: '1 week ago', runCount: 234, isSelected: false },
    { id: 'z5', name: 'Support Ticket → Create Notion Page', trigger: 'Zendesk Ticket', action: 'Create Notion Page', lastRun: '5 hours ago', runCount: 67, isSelected: true },
  ])

  const handleConnect = async () => {
    setIsConnecting(true)
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsConnected(true)
    setIsConnecting(false)
  }

  const toggleWorkflow = (workflowId: string) => {
    setWorkflows(prev => prev.map(workflow => 
      workflow.id === workflowId ? { ...workflow, isSelected: !workflow.isSelected } : workflow
    ))
  }

  const save = () => {
    const { configure } = useIntegrationsStore.getState()
    configure('zapier', { 
      selectedWorkflows: workflows.filter(w => w.isSelected),
      lastUpdated: new Date().toISOString()
    })
    onClose()
  }

  const filteredWorkflows = workflows.filter(workflow =>
    workflow.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    workflow.trigger.toLowerCase().includes(searchQuery.toLowerCase()) ||
    workflow.action.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (!isConnected) {
    return (
      <div className="flex h-full flex-col bg-white rounded-xl overflow-hidden">
        {/* Header */}
        <div className="border-b border-gray-200 px-6 py-6">
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-gray-800 to-gray-900">
              <span className="text-sm font-bold text-white">Z</span>
            </div>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-gray-900">Connect Zapier</h1>
              <p className="text-gray-600 mt-0.5 text-sm">Connect your Zapier account to Docket</p>
            </div>
            <button onClick={onClose} className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Connection Content */}
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center max-w-sm">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 mx-auto mb-6">
              <span className="text-3xl">⚡</span>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Connect your Zapier account</h2>
            <p className="text-gray-600 mb-8">
              Give Docket access to your automation workflows to understand data flows and enhance Sales Knowledge Lake with workflow insights.
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
                <>
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.102m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                  Connect to Zapier
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
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-gray-800 to-gray-900">
            <span className="text-sm font-bold text-white">Z</span>
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-gray-900">Zapier Configuration</h1>
            <p className="text-gray-600 mt-0.5 text-sm">Select automation workflows to track and analyze</p>
          </div>
          <button onClick={onClose} className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">Automation Workflows</h3>
            <div className="flex items-center gap-3">
              {workflows.filter(w => w.isSelected).length > 0 && (
                <div className="text-xs text-green-700 bg-green-50 px-2 py-1 rounded-full">
                  ✓ {workflows.filter(w => w.isSelected).length} workflows selected
                </div>
              )}
            </div>
          </div>

          {/* Search */}
          <div className="relative mb-4">
            <svg className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search workflows..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white pl-10 pr-4 py-2.5 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
            />
          </div>

          {/* Table Header */}
          <div className="mb-3 grid grid-cols-12 gap-4 px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wide">
            <div className="col-span-5">Workflow</div>
            <div className="col-span-3">Trigger → Action</div>
            <div className="col-span-2">Runs</div>
            <div className="col-span-1">Updated</div>
            <div className="col-span-1">Select</div>
          </div>

          {/* Workflows Table */}
          <div className="space-y-1">
            {filteredWorkflows.map((workflow) => (
              <div 
                key={workflow.id}
                className={`grid grid-cols-12 gap-4 items-center p-3 rounded-lg border transition-all cursor-pointer ${
                  workflow.isSelected ? 'border-gray-900 bg-gray-50' : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
                onClick={() => toggleWorkflow(workflow.id)}
              >
                <div className="col-span-5">
                  <span className="text-sm font-medium text-gray-900 truncate">{workflow.name}</span>
                </div>
                <div className="col-span-3">
                  <span className="text-xs text-gray-600 truncate">{workflow.trigger} → {workflow.action}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-sm text-gray-600">{workflow.runCount}</span>
                </div>
                <div className="col-span-1">
                  <span className="text-xs text-gray-500">{workflow.lastRun}</span>
                </div>
                <div className="col-span-1 flex justify-center">
                  <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                    workflow.isSelected ? 'border-gray-900 bg-gray-900' : 'border-gray-300'
                  }`}>
                    {workflow.isSelected && (
                      <svg className="h-2.5 w-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredWorkflows.length === 0 && searchQuery && (
            <div className="text-center py-12">
              <div className="text-gray-500">No workflows match "{searchQuery}"</div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 bg-gray-50 px-6 py-6">
        <div className="flex items-center justify-between">
          <button className="inline-flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900 font-medium">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Zapier integration help
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

