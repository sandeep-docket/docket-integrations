import { useState } from 'react'
import { useIntegrationsStore } from '../store'

type AttributeMapping = {
  id: string
  intercomAttribute: string
  salesforceField: string
  skipIfSourceEmpty?: boolean
  skipIfDestinationHasValue?: boolean
}

type ObjectPermissions = {
  canRead: boolean
  canWrite: boolean
}

export function SalesforceConfigPanel({ onClose }: { onClose: () => void }) {
  const configure = useIntegrationsStore((s) => s.configure)
  const [activeTab, setActiveTab] = useState<'Leads' | 'Contacts'>('Leads')
  const [showAddForm, setShowAddForm] = useState(false)

  // Object-level permissions
  const [leadPermissions, setLeadPermissions] = useState<ObjectPermissions>({ canRead: true, canWrite: true })
  const [contactPermissions, setContactPermissions] = useState<ObjectPermissions>({ canRead: true, canWrite: true })

  const [leadMappings, setLeadMappings] = useState<AttributeMapping[]>([
    { id: '1', intercomAttribute: 'Email', salesforceField: 'Email' },
    { id: '2', intercomAttribute: 'Name', salesforceField: 'First name, Last name' },
    { id: '3', intercomAttribute: 'Company name', salesforceField: 'Company' },
    { id: '4', intercomAttribute: 'Continent code', salesforceField: 'string_cda_1' },
    { id: '5', intercomAttribute: 'Country', salesforceField: 'Country' },
    { id: '6', intercomAttribute: 'Unsubscribed from Emails', salesforceField: 'Email Opt Out' },
  ])

  const [contactMappings, setContactMappings] = useState<AttributeMapping[]>([
    { id: 'c1', intercomAttribute: 'Email', salesforceField: 'Email' },
    { id: 'c2', intercomAttribute: 'Name', salesforceField: 'First name, Last name' },
  ])

  const currentMappings = activeTab === 'Leads' ? leadMappings : contactMappings
  const setCurrentMappings = activeTab === 'Leads' ? setLeadMappings : setContactMappings
  const currentPermissions = activeTab === 'Leads' ? leadPermissions : contactPermissions
  const setCurrentPermissions = activeTab === 'Leads' ? setLeadPermissions : setContactPermissions

  const removeMapping = (id: string) => {
    setCurrentMappings(prev => prev.filter(m => m.id !== id))
  }

  const save = () => {
    configure('salesforce', { 
      leadMappings, 
      contactMappings,
      leadPermissions,
      contactPermissions,
      lastUpdated: new Date().toISOString()
    })
    onClose()
  }

  return (
    <div className="flex h-full flex-col bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 shadow-lg">
              <span className="text-sm font-bold text-white">SF</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Salesforce Field Mapping</h2>
              <p className="text-sm text-gray-600 mt-1">Configure how data syncs between Docket and Salesforce</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 font-medium">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              Learn more
            </button>
            <button 
              onClick={onClose} 
              className="rounded-lg p-2 text-gray-400 hover:bg-white/50 hover:text-gray-600 transition-colors"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 px-6">
        <div className="flex items-center justify-between">
          <div className="flex gap-8">
            {(['Leads', 'Contacts'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 pt-4 text-sm font-medium border-b-2 ${
                  activeTab === tab
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          
          {/* Object-level Permissions */}
          <div className="flex items-center gap-6 pb-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={currentPermissions.canRead}
                onChange={(e) => setCurrentPermissions(prev => ({ ...prev, canRead: e.target.checked }))}
                className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
              />
              <div className="flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-md bg-green-100">
                  <svg className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-gray-700">Read from Salesforce</span>
              </div>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={currentPermissions.canWrite}
                onChange={(e) => setCurrentPermissions(prev => ({ ...prev, canWrite: e.target.checked }))}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <div className="flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-md bg-blue-100">
                  <svg className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-gray-700">Write to Salesforce</span>
              </div>
            </label>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
        <p className="text-sm text-gray-700">
          Map attributes between leads or users in Docket and leads in Salesforce. By default, 
          we show the fields required by Salesforce to create a new lead record.
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        {/* Column Headers */}
        <div className="mb-4 grid grid-cols-2 gap-4 text-sm font-medium text-gray-500">
          <div>Docket attribute</div>
          <div>Salesforce field</div>
        </div>

        {/* Mapping Rows */}
        <div className="space-y-3">
          {currentMappings.map((mapping) => (
            <AttributeMappingRow
              key={mapping.id}
              mapping={mapping}
              permissions={currentPermissions}
              onRemove={() => removeMapping(mapping.id)}
              onEdit={() => {/* TODO: Open edit form */}}
            />
          ))}
        </div>

        {/* Add New Mapping Button/Form */}
        {!showAddForm ? (
          <button 
            onClick={() => setShowAddForm(true)}
            className="mt-6 flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-800"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Map new attribute
          </button>
        ) : (
          <AddAttributeForm 
            activeTab={activeTab}
            onCancel={() => setShowAddForm(false)}
            onAdd={(mapping) => {
              setCurrentMappings(prev => [...prev, { ...mapping, id: Date.now().toString() }])
              setShowAddForm(false)
            }}
          />
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 bg-gray-50 px-6 py-6">
        <div className="flex items-center justify-between">
          <button className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 font-medium">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            See examples and tutorials
          </button>
          <div className="flex gap-3">
            <button 
              onClick={onClose}
              className="rounded-lg border border-gray-300 bg-white px-6 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
            >
              Cancel
            </button>
            <button 
              onClick={save}
              className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/25"
            >
              Save Configuration
            </button>
          </div>
        </div>
      </div>


    </div>
  )
}

function AttributeMappingRow({ 
  mapping, 
  permissions,
  onRemove, 
  onEdit
}: { 
  mapping: AttributeMapping; 
  permissions: ObjectPermissions;
  onRemove: () => void; 
  onEdit: () => void;
}) {
  const getDirectionIcon = () => {
    if (permissions.canRead && permissions.canWrite) {
      return (
        <div className="flex items-center gap-1 text-purple-600" title="Bidirectional sync">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
        </div>
      )
    } else if (permissions.canWrite) {
      return (
        <div className="flex items-center gap-1 text-blue-600" title="Write to Salesforce">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </div>
      )
    } else if (permissions.canRead) {
      return (
        <div className="flex items-center gap-1 text-green-600" title="Read from Salesforce">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
          </svg>
        </div>
      )
    } else {
      return (
        <div className="flex items-center gap-1 text-gray-400" title="No sync">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636" />
          </svg>
        </div>
      )
    }
  }

  return (
    <div className="grid grid-cols-2 gap-4 items-center py-3 border-b border-gray-100 group">
      {/* Docket Attribute with Direction Icon */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-900">{mapping.intercomAttribute}</span>
        {getDirectionIcon()}
      </div>
      
      {/* Salesforce Field with Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-900">{mapping.salesforceField}</span>
          <div className="h-4 w-4 rounded-full bg-gray-400 flex items-center justify-center">
            <span className="text-xs text-white font-bold">?</span>
          </div>
        </div>
        <div className="opacity-0 group-hover:opacity-100 flex items-center gap-2">
          <button 
            onClick={onEdit}
            className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded"
            title="Edit mapping"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button 
            onClick={onRemove}
            className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded text-xs font-medium"
            title="Remove mapping"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  )
}

function AddAttributeForm({ 
  activeTab,
  onCancel, 
  onAdd 
}: { 
  activeTab: 'Leads' | 'Contacts';
  onCancel: () => void; 
  onAdd: (mapping: Omit<AttributeMapping, 'id'>) => void 
}) {
  const [intercomAttribute, setIntercomAttribute] = useState('Job title')
  const [salesforceField, setSalesforceField] = useState('Intercom job...')
  const [skipIfSourceEmpty, setSkipIfSourceEmpty] = useState(true)
  const [skipIfDestinationHasValue, setSkipIfDestinationHasValue] = useState(false)

  const handleAdd = () => {
    onAdd({
      intercomAttribute,
      salesforceField,
      skipIfSourceEmpty,
      skipIfDestinationHasValue
    })
  }

  return (
    <div className="mt-6 rounded-lg border border-gray-200 bg-gray-50 p-4">
      <h4 className="text-sm font-semibold text-gray-900 mb-4">Map new attribute for {activeTab.toLowerCase()}</h4>
      
      {/* Platform Headers */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded bg-purple-100 flex items-center justify-center">
            <span className="text-xs font-bold text-purple-600">D</span>
          </div>
          <span className="text-xs font-medium text-gray-700">Docket</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded bg-blue-100 flex items-center justify-center">
            <span className="text-xs font-bold text-blue-600">SF</span>
          </div>
          <span className="text-xs font-medium text-gray-700">Salesforce</span>
        </div>
      </div>

      {/* Field Mapping */}
      <div className="mb-4 flex items-center gap-4">
        <div className="flex-1">
          <select 
            value={intercomAttribute}
            onChange={(e) => setIntercomAttribute(e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm"
          >
            <option value="Job title">Job title (Text)</option>
            <option value="Phone">Phone (Text)</option>
            <option value="Location">Location (Text)</option>
          </select>
        </div>
        
        <div className="flex items-center">
          <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </div>
        
        <div className="flex-1">
          <select 
            value={salesforceField}
            onChange={(e) => setSalesforceField(e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="Intercom job...">Intercom job... (String)</option>
            <option value="Title">Title (String)</option>
            <option value="Phone">Phone (String)</option>
          </select>
        </div>
      </div>

      {/* Note about object-level permissions */}
      <div className="mb-4 rounded-lg bg-blue-50 border border-blue-200 p-3">
        <p className="text-xs text-blue-800">
          <strong>Note:</strong> Sync permissions are set at the {activeTab} object level above. 
          This form only maps which fields correspond to each other.
        </p>
      </div>

      {/* Sync Options */}
      <div className="mb-4 space-y-3">
        <label className="flex items-start gap-3">
          <input 
            type="checkbox" 
            checked={skipIfSourceEmpty}
            onChange={(e) => setSkipIfSourceEmpty(e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-sm text-gray-900">Don't sync if the source is empty</span>
        </label>
        
        <label className="flex items-start gap-3">
          <input 
            type="checkbox" 
            checked={skipIfDestinationHasValue}
            onChange={(e) => setSkipIfDestinationHasValue(e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-sm text-gray-900">Don't sync if the destination already has a value</span>
        </label>
      </div>

      {/* Form Footer */}
      <div className="flex justify-end gap-3">
        <button 
          onClick={onCancel}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button 
          onClick={handleAdd}
          className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Add
        </button>
      </div>
    </div>
  )
}
