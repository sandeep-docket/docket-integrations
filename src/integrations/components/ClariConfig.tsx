import { useState } from 'react'
import { useIntegrationsStore } from '../store'
import { IngestionRules } from './IngestionRules'
import type { IngestionRule, User } from './IngestionRules'
import { SubjectMatterExperts } from './SubjectMatterExperts'
import type { SubjectMatterExpert } from './SubjectMatterExperts'


export function ClariConfigPanel({ onClose }: { onClose: () => void }) {
  const { connections } = useIntegrationsStore()
  const isAlreadyConnected = Boolean(connections['clari'])
  
  const [isConnected, setIsConnected] = useState(isAlreadyConnected)
  const [isConnecting, setIsConnecting] = useState(false)
  
  const [experts, setExperts] = useState<SubjectMatterExpert[]>([
    { id: 'e1', name: 'Sarah Chen', email: 'sarah.chen@company.com', role: 'Senior Sales Director', department: 'Sales', callCount: 287, isSelected: true },
    { id: 'e2', name: 'Michael Rodriguez', email: 'michael.r@company.com', role: 'Sales Engineer', department: 'Sales', callCount: 156, isSelected: true },
    { id: 'e3', name: 'Emily Johnson', email: 'emily.j@company.com', role: 'VP of Sales', department: 'Leadership', callCount: 198, isSelected: true },
    { id: 'e4', name: 'David Park', email: 'david.park@company.com', role: 'Account Executive', department: 'Sales', callCount: 234, isSelected: false },
    { id: 'e5', name: 'Lisa Thompson', email: 'lisa.t@company.com', role: 'Customer Success Manager', department: 'Sales', callCount: 124, isSelected: false },
  ])

  const [learningRules, setLearningRules] = useState<IngestionRule[]>([
    {
      id: '1',
      name: 'Enterprise prospect calls',
      callType: 'external',
      selectedUsers: ['e1', 'e2', 'e3'],
      meetingTitleKeywords: ['enterprise', 'executive', 'strategic'],
      dealStages: ['Discovery', 'Proposal', 'Negotiation'],
      isActive: true
    }
  ])

  // Convert experts to User format for unified component
  const users: User[] = experts.map(expert => ({
    id: expert.id,
    name: expert.name,
    email: expert.email,
    role: expert.role,
    department: expert.department
  }))

  const handleConnect = async () => {
    setIsConnecting(true)
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsConnected(true)
    setIsConnecting(false)
  }

  const toggleExpert = (expertId: string) => {
    setExperts(prev => prev.map(expert => 
      expert.id === expertId ? { ...expert, isSelected: !expert.isSelected } : expert
    ))
  }

  const save = () => {
    const { configure } = useIntegrationsStore.getState()
    configure('clari', { 
      selectedExperts: experts.filter(e => e.isSelected),
      learningRules: learningRules.filter(r => r.isActive),
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
              <span className="text-sm font-bold text-white">C</span>
            </div>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-gray-900">Connect Clari</h1>
              <p className="text-gray-600 mt-0.5 text-sm">Connect your Clari account to Docket</p>
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
              <span className="text-3xl">📊</span>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Connect your Clari account</h2>
            <p className="text-gray-600 mb-8">
              Give Docket access to revenue operations insights from your top sales experts to enhance the Sales Knowledge Lake.
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
                'Connect to Clari'
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
            <span className="text-sm font-bold text-white">C</span>
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-gray-900">Clari Configuration</h1>
            <p className="text-gray-600 mt-0.5 text-sm">Configure revenue operations insights</p>
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
          {/* Subject Matter Experts - Unified Component */}
          <SubjectMatterExperts
            experts={experts}
            onExpertToggle={toggleExpert}
          />

          {/* Ingestion Rules - Unified Component */}
          <IngestionRules
            rules={learningRules}
            users={users}
            onRuleCreate={(rule) => {
              const newRule: IngestionRule = {
                ...rule,
                id: Date.now().toString(),
                isActive: true
              }
              setLearningRules(prev => [...prev, newRule])
            }}
            onRuleUpdate={(ruleId, updatedRule) => {
              setLearningRules(prev => prev.map(rule => 
                rule.id === ruleId ? { ...updatedRule, id: rule.id, isActive: rule.isActive } : rule
              ))
            }}
            onRuleToggle={(ruleId) => {
              setLearningRules(prev => prev.map(rule => 
                rule.id === ruleId ? { ...rule, isActive: !rule.isActive } : rule
              ))
            }}
            onRuleDelete={(ruleId) => {
              setLearningRules(prev => prev.filter(rule => rule.id !== ruleId))
            }}
            callTypeLabel="Call Type"
          />
        </div>
      </div>


      <div className="border-t border-gray-200 bg-gray-50 px-6 py-6">
        <div className="flex items-center justify-between">
          <button className="inline-flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900 font-medium">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Clari integration help
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
