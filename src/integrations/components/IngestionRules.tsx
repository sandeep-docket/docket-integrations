import { useState } from 'react'
import { MultiSelectDropdown } from './MultiSelectDropdown'
import { UserMultiSelectDropdown } from './UserMultiSelectDropdown'

export type IngestionRule = {
  id: string
  name: string
  callType: 'external' | 'internal' | 'all'
  selectedUsers?: string[]
  meetingTitleKeywords: string[]
  dealStages?: string[]
  isActive: boolean
}

export type User = {
  id: string
  name: string
  email: string
  role: string
  department?: string
  avatar?: string
}

type IngestionRulesProps = {
  rules: IngestionRule[]
  users: User[]
  onRuleCreate: (rule: Omit<IngestionRule, 'id' | 'isActive'>) => void
  onRuleUpdate: (ruleId: string, rule: Omit<IngestionRule, 'id' | 'isActive'>) => void
  onRuleToggle: (ruleId: string) => void
  onRuleDelete: (ruleId: string) => void
  title?: string
  callTypeLabel?: string // e.g., "Meeting Type" for calendar, "Call Type" for calls
}

export function IngestionRules({
  rules,
  users,
  onRuleCreate,
  onRuleUpdate,
  onRuleToggle,
  onRuleDelete,
  title = "Ingestion Rules",
  callTypeLabel = "Call Type"
}: IngestionRulesProps) {
  const [showCreateForm, setShowCreateForm] = useState(false)

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900">{title}</h3>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="inline-flex items-center gap-2 rounded-lg bg-gray-900 px-3 py-2 text-sm font-medium text-white hover:bg-gray-800 transition-colors"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          {showCreateForm ? 'Cancel' : 'Add Rule'}
        </button>
      </div>

      {/* Rules List */}
      <div className="space-y-2">
        {rules.map((rule) => (
          <RuleCard
            key={rule.id}
            rule={rule}
            users={users}
            onUpdate={(updatedRule) => onRuleUpdate(rule.id, updatedRule)}
            onToggle={() => onRuleToggle(rule.id)}
            onDelete={() => onRuleDelete(rule.id)}
            callTypeLabel={callTypeLabel}
          />
        ))}
        
        {/* Inline Create Form */}
        {showCreateForm && (
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
            <h4 className="text-sm font-semibold text-gray-900 mb-4">Create New Rule</h4>
            <RuleForm
              users={users}
              onSave={(rule) => {
                onRuleCreate(rule)
                setShowCreateForm(false)
              }}
              onCancel={() => setShowCreateForm(false)}
              callTypeLabel={callTypeLabel}
            />
          </div>
        )}
      </div>
    </div>
  )
}

function RuleCard({
  rule,
  users,
  onUpdate,
  onToggle,
  onDelete,
  callTypeLabel
}: {
  rule: IngestionRule
  users: User[]
  onUpdate: (rule: Omit<IngestionRule, 'id' | 'isActive'>) => void
  onToggle: () => void
  onDelete: () => void
  callTypeLabel: string
}) {
  const [isEditing, setIsEditing] = useState(false)

  if (isEditing) {
    return (
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
        <h4 className="text-sm font-semibold text-gray-900 mb-4">Edit Rule</h4>
        <RuleForm
          users={users}
          initialRule={rule}
          onSave={(updatedRule) => {
            onUpdate(updatedRule)
            setIsEditing(false)
          }}
          onCancel={() => setIsEditing(false)}
          callTypeLabel={callTypeLabel}
        />
      </div>
    )
  }

  return (
    <div className="group rounded-lg border border-gray-200 bg-white p-3 hover:border-gray-300 transition-all">
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-1">
            <h4 className="text-sm font-semibold text-gray-900">{rule.name}</h4>
            <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
              rule.callType === 'external' ? 'bg-green-100 text-green-800' :
              rule.callType === 'internal' ? 'bg-blue-100 text-blue-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {rule.callType} {callTypeLabel.toLowerCase()}
            </span>
          </div>
          
          <div className="text-xs text-gray-600 space-y-1">
            <div>
              <span className="font-medium">Keywords:</span> {rule.meetingTitleKeywords.join(', ') || 'None'}
            </div>
            {rule.dealStages && rule.dealStages.length > 0 && (
              <div>
                <span className="font-medium">Deal Stages:</span> {rule.dealStages.join(', ')}
              </div>
            )}
            <div>
              <span className="font-medium">Users:</span> {rule.selectedUsers?.length || 0} selected
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsEditing(true)}
            className="opacity-0 group-hover:opacity-100 p-1.5 text-gray-400 hover:text-gray-600 rounded transition-all"
            title="Edit rule"
          >
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          
          <button
            onClick={onToggle}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              rule.isActive ? 'bg-gray-900' : 'bg-gray-300'
            }`}
          >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              rule.isActive ? 'translate-x-6' : 'translate-x-1'
            }`} />
          </button>
          
          <button
            onClick={onDelete}
            className="opacity-0 group-hover:opacity-100 p-1.5 text-gray-400 hover:text-red-600 rounded transition-all"
            title="Delete rule"
          >
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

function RuleForm({
  users,
  onSave,
  onCancel,
  initialRule,
  callTypeLabel
}: {
  users: User[]
  onSave: (rule: Omit<IngestionRule, 'id' | 'isActive'>) => void
  onCancel: () => void
  initialRule?: IngestionRule
  callTypeLabel: string
}) {
  const [ruleName, setRuleName] = useState(initialRule?.name || '')
  const [callType, setCallType] = useState<'external' | 'internal' | 'all'>(initialRule?.callType || 'external')
  const [selectedUsers, setSelectedUsers] = useState<string[]>(initialRule?.selectedUsers || [])
  const [meetingTitleKeywords, setMeetingTitleKeywords] = useState<string[]>(initialRule?.meetingTitleKeywords || [])
  const [dealStages, setDealStages] = useState<string[]>(initialRule?.dealStages || [])
  const [keywordInput, setKeywordInput] = useState('')

  const addKeyword = () => {
    const keyword = keywordInput.trim().toLowerCase()
    if (keyword && !meetingTitleKeywords.includes(keyword)) {
      setMeetingTitleKeywords(prev => [...prev, keyword])
      setKeywordInput('')
    }
  }

  const removeKeyword = (keyword: string) => {
    setMeetingTitleKeywords(prev => prev.filter(k => k !== keyword))
  }

  const handleSave = () => {
    if (ruleName.trim()) {
      onSave({
        name: ruleName,
        callType,
        selectedUsers: selectedUsers.length > 0 ? selectedUsers : undefined,
        meetingTitleKeywords,
        dealStages: dealStages.length > 0 ? dealStages : undefined
      })
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Rule Name</label>
        <input
          type="text"
          value={ruleName}
          onChange={(e) => setRuleName(e.target.value)}
          placeholder="e.g., Customer meetings"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
        />
      </div>

      {/* Call Type - Tab Switch */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">{callTypeLabel}</label>
        <div className="flex rounded-lg bg-gray-100 p-1">
          {[
            { value: 'external', label: 'External' },
            { value: 'internal', label: 'Internal' },
            { value: 'all', label: 'All' }
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => setCallType(option.value as any)}
              className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-all ${
                callType === option.value
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Users - Enhanced Multi-select Dropdown */}
      <UserMultiSelectDropdown
        users={users.map(user => ({
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          department: user.department,
          avatar: user.avatar,
          isSelected: selectedUsers.includes(user.id)
        }))}
        selectedUserIds={selectedUsers}
        onSelectionChange={setSelectedUsers}
        label="Select Users (optional)"
        placeholder="Choose users..."
      />

      {/* Deal Stages - Enhanced Multi-select Dropdown */}
      <MultiSelectDropdown
        options={['Discovery', 'Qualification', 'Proposal', 'Negotiation', 'Closed Won', 'Closed Lost'].map(stage => ({
          id: stage,
          label: stage,
          value: stage,
          isSelected: dealStages.includes(stage)
        }))}
        selectedValues={dealStages}
        onSelectionChange={setDealStages}
        label="Deal Stages (optional)"
        placeholder="Choose deal stages..."
      />

      {/* Meeting Title Keywords */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Meeting Title Keywords</label>
        <div className="space-y-2">
          {/* Selected Keywords */}
          {meetingTitleKeywords.length > 0 && (
            <div className="flex flex-wrap gap-2 p-2 bg-gray-50 rounded-lg border border-gray-200">
              {meetingTitleKeywords.map((keyword) => (
                <span
                  key={keyword}
                  className="inline-flex items-center gap-1 bg-white text-gray-800 px-2 py-1 rounded-md text-xs border border-gray-200"
                >
                  {keyword}
                  <button
                    onClick={() => removeKeyword(keyword)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
          
          {/* Keyword Input */}
          <div className="flex gap-2">
            <input
              type="text"
              value={keywordInput}
              onChange={(e) => setKeywordInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addKeyword()}
              placeholder="Add keyword..."
              className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
            />
            <button
              onClick={addKeyword}
              className="px-3 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
            >
              Add
            </button>
          </div>
        </div>
      </div>
      
      <div className="flex gap-3 pt-2">
        <button
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={!ruleName.trim()}
          className="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 disabled:opacity-50 transition-colors"
        >
          {initialRule ? 'Update Rule' : 'Create Rule'}
        </button>
      </div>
    </div>
  )
}
