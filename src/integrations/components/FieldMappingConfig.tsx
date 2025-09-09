import { useState } from 'react'
import { useIntegrationsStore } from '../store'
import type { IntegrationProvider } from '../types'

type FieldMapping = {
  id: string
  docketField: string
  providerField: string
  skipIfSourceEmpty?: boolean
  skipIfDestinationHasValue?: boolean
}

type ObjectPermissions = {
  canRead: boolean
  canWrite: boolean
}

type ObjectConfig = {
  name: string
  description: string
  permissions: ObjectPermissions
  mappings: FieldMapping[]
  required?: string[]
}

// Configuration data for different providers
const getProviderConfig = (providerId: string): { 
  name: string
  icon: string
  color: string
  objects: ObjectConfig[]
} => {
  switch (providerId) {
    case 'salesforce':
      return {
        name: 'Salesforce',
        icon: 'SF',
        color: 'blue',
        objects: [
          {
            name: 'Leads',
            description: 'Import existing Leads and create new ones from AI Seller conversations',
            permissions: { canRead: true, canWrite: true },
            required: ['Email'],
            mappings: [
              { id: '1', docketField: 'Email', providerField: 'Email' },
              { id: '2', docketField: 'Name', providerField: 'First name, Last name' },
              { id: '3', docketField: 'Company name', providerField: 'Company' },
              { id: '4', docketField: 'Country', providerField: 'Country' },
            ]
          },
          {
            name: 'Contacts',
            description: 'Update existing Contacts when matched',
            permissions: { canRead: true, canWrite: true },
            mappings: [
              { id: 'c1', docketField: 'Email', providerField: 'Email' },
              { id: 'c2', docketField: 'Name', providerField: 'First name, Last name' },
            ]
          }
        ]
      }
    case 'hubspot':
      return {
        name: 'HubSpot',
        icon: 'HS',
        color: 'orange',
        objects: [
          {
            name: 'Company',
            description: 'Sync using the same object connections',
            permissions: { canRead: true, canWrite: true },
            mappings: [
              { id: 'comp1', docketField: 'Company Name', providerField: 'Company Name' },
              { id: 'comp2', docketField: 'Description', providerField: 'Description' },
              { id: 'comp3', docketField: 'Company Domain Name', providerField: 'Company Domain Name' },
              { id: 'comp4', docketField: 'Industry', providerField: 'Industry' },
              { id: 'comp5', docketField: 'Number Of Employees', providerField: 'Number Of Employees' },
              { id: 'comp6', docketField: 'Annual Revenue', providerField: 'Annual Revenue' },
            ]
          },
          {
            name: 'Deal',
            description: 'Sync deal and opportunity data',
            permissions: { canRead: true, canWrite: true },
            mappings: [
              { id: 'deal1', docketField: 'Deal Name', providerField: 'Deal Name' },
              { id: 'deal2', docketField: 'Amount', providerField: 'Amount' },
              { id: 'deal3', docketField: 'Close Date', providerField: 'Close Date' },
              { id: 'deal4', docketField: 'Deal Stage', providerField: 'Deal Stage' },
              { id: 'deal5', docketField: 'Deal Owner', providerField: 'Deal Owner' },
            ]
          },
          {
            name: 'Contact',
            description: 'Sync contact information and interactions',
            permissions: { canRead: true, canWrite: true },
            mappings: [
              { id: 'cont1', docketField: 'Email', providerField: 'Email' },
              { id: 'cont2', docketField: 'First Name', providerField: 'First Name' },
              { id: 'cont3', docketField: 'Last Name', providerField: 'Last Name' },
              { id: 'cont4', docketField: 'Job Title', providerField: 'Job Title' },
              { id: 'cont5', docketField: 'Company Name', providerField: 'Company Name' },
            ]
          }
        ]
      }
    default:
      return {
        name: 'Integration',
        icon: 'INT',
        color: 'gray',
        objects: []
      }
  }
}

export function FieldMappingConfigPanel({ provider, onClose }: { provider: IntegrationProvider; onClose: () => void }) {
  const configure = useIntegrationsStore((s) => s.configure)
  const config = getProviderConfig(provider.id)
  
  const [objectConfigs, setObjectConfigs] = useState<ObjectConfig[]>(config.objects)
  const [activeObject, setActiveObject] = useState<string>(config.objects[0]?.name || '')

  const activeConfig = objectConfigs.find(obj => obj.name === activeObject)

  const updateObjectPermissions = (permissions: ObjectPermissions) => {
    setObjectConfigs(prev => prev.map(obj => 
      obj.name === activeObject ? { ...obj, permissions } : obj
    ))
  }

  const removeMapping = (mappingId: string) => {
    setObjectConfigs(prev => prev.map(obj => 
      obj.name === activeObject 
        ? { ...obj, mappings: obj.mappings.filter(m => m.id !== mappingId) }
        : obj
    ))
  }

  const save = () => {
    configure(provider.id, {
      objectConfigs,
      lastUpdated: new Date().toISOString()
    })
    onClose()
  }

  // Use consistent black/gray theming for all providers
  const colors = {
    gradient: 'from-gray-900/5 via-gray-900/3 to-transparent',
    icon: 'bg-gradient-to-br from-gray-800 to-gray-900',
    button: 'bg-gray-900 hover:bg-gray-800 shadow-lg shadow-gray-900/25',
    text: 'text-gray-900 hover:text-gray-700',
    accent: 'border-gray-200 bg-gray-50',
    tab: 'text-gray-900 border-gray-900'
  }

  return (
    <div className="flex h-full flex-col bg-white rounded-xl overflow-hidden">
      {/* Clean Header */}
      <div className="border-b border-gray-200 px-6 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${colors.icon} shadow-lg`}>
              <span className="text-sm font-bold text-white">{config.icon}</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">{config.name} Configuration</h1>
              <p className="text-gray-600 mt-0.5 text-sm">Field mapping and sync settings</p>
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

      {/* Object Tabs - Crunchbase Style */}
      <div className="border-b border-gray-200 bg-white px-6">
        <div className="flex gap-8">
          {objectConfigs.map((obj) => (
            <button
              key={obj.name}
              onClick={() => setActiveObject(obj.name)}
              className={`pb-4 pt-6 text-sm font-medium border-b-2 transition-colors ${
                activeObject === obj.name
                  ? 'text-gray-900 border-gray-900'
                  : 'text-gray-500 hover:text-gray-700 border-transparent'
              }`}
            >
              {obj.name} Fields
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {activeConfig && (
          <div className="p-6">
            {/* Sync Mode Toggle */}
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{activeConfig.name} Field Mapping</h3>
                <p className="text-sm text-gray-600 mt-1">{activeConfig.description}</p>
              </div>
              <div className="flex rounded-lg bg-gray-100 p-1">
                {/* Push only - Arrow pointing right */}
                <button
                  onClick={() => updateObjectPermissions({ canRead: false, canWrite: true })}
                  className={`group relative rounded-md p-2 transition-all ${
                    !activeConfig.permissions.canRead && activeConfig.permissions.canWrite
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                  title="Push only - Data flows from Docket to CRM"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-900 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                    Push only
                  </div>
                </button>
                
                {/* Pull only - Arrow pointing left */}
                <button
                  onClick={() => updateObjectPermissions({ canRead: true, canWrite: false })}
                  className={`group relative rounded-md p-2 transition-all ${
                    activeConfig.permissions.canRead && !activeConfig.permissions.canWrite
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                  title="Pull only - Data flows from CRM to Docket"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
                  </svg>
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-900 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                    Pull only
                  </div>
                </button>
                
                {/* Bidirectional - Double arrow */}
                <button
                  onClick={() => updateObjectPermissions({ canRead: true, canWrite: true })}
                  className={`group relative rounded-md p-2 transition-all ${
                    activeConfig.permissions.canRead && activeConfig.permissions.canWrite
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                  title="Bidirectional - Data flows both ways"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-900 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                    Bidirectional
                  </div>
                </button>
              </div>
            </div>

            {/* Table Header */}
            <div className="mb-4 grid grid-cols-3 gap-6 border-b border-gray-200 pb-3">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <div className="h-4 w-4 rounded-full bg-gray-100 flex items-center justify-center">
                  <span className="text-xs font-bold text-gray-700">D</span>
                </div>
                Docket Field
              </div>
              <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <div className="h-4 w-4 rounded-full bg-gray-800 flex items-center justify-center">
                  <span className="text-xs font-bold text-white">{config.icon[0]}</span>
                </div>
                {config.name} Field
              </div>
              <div className="text-sm font-medium text-gray-700">Example</div>
            </div>

            {/* Field Mappings Table */}
            <div className="space-y-1">
              {activeConfig.mappings.map((mapping) => (
                <CrunchbaseFieldRow
                  key={mapping.id}
                  mapping={mapping}
                  providerName={config.name}
                  isRequired={activeConfig.required?.includes(mapping.providerField)}
                  onUpdate={(updates) => {
                    setObjectConfigs(prev => prev.map(obj => 
                      obj.name === activeObject 
                        ? { ...obj, mappings: obj.mappings.map(m => m.id === mapping.id ? { ...m, ...updates } : m) }
                        : obj
                    ))
                  }}
                  onRemove={() => removeMapping(mapping.id)}
                />
              ))}
            </div>

            {/* Add New Field Button */}
            <button 
              onClick={() => {
                const newMapping = {
                  docketField: '',
                  providerField: '',
                  id: `new-${Date.now()}`
                }
                setObjectConfigs(prev => prev.map(obj => 
                  obj.name === activeObject 
                    ? { ...obj, mappings: [...obj.mappings, newMapping] }
                    : obj
                ))
              }}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-gray-300 py-3 text-sm font-medium text-gray-600 hover:border-gray-400 hover:bg-gray-50 transition-all"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add field mapping
            </button>

            {/* Required fields notice */}
            {activeConfig.required && activeConfig.required.length > 0 && (
              <div className="mt-6 rounded-lg bg-amber-50 border border-amber-200 p-4">
                <div className="flex items-start gap-3">
                  <svg className="h-5 w-5 text-amber-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-amber-800">Required fields</p>
                    <p className="text-xs text-amber-700 mt-1">
                      Fields marked with * are required for {activeConfig.name.toLowerCase()} creation
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Clean Footer */}
      <div className="border-t border-gray-200 bg-gray-50 px-6 py-6">
        <div className="flex items-center justify-between">
          <button className="inline-flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900 font-medium">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Help & Documentation
          </button>
          <div className="flex gap-3">
            <button 
              onClick={onClose}
              className="rounded-xl border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={save}
              className="rounded-xl bg-gray-900 hover:bg-gray-800 px-5 py-2.5 text-sm font-semibold text-white transition-colors shadow-lg"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}



function CrunchbaseFieldRow({ 
  mapping, 
  providerName,
  isRequired,
  onUpdate,
  onRemove 
}: { 
  mapping: FieldMapping; 
  providerName: string;
  isRequired?: boolean;
  onUpdate: (updates: Partial<FieldMapping>) => void;
  onRemove: () => void;
}) {
  const getExampleValue = (fieldName: string) => {
    const examples: Record<string, string> = {
      'Email': 'john.doe@company.com',
      'Company Name': 'Acme Corporation',
      'Name': 'John Doe',
      'First name, Last name': 'John Doe',
      'Company': 'Acme Corp.',
      'Country': 'United States',
      'Phone': '+1 (555) 123-4567',
      'Job Title': 'VP of Sales',
      'Amount': '$50,000',
      'Close Date': '2024-03-15',
      'Deal Stage': 'Proposal',
      'Industry': 'Technology'
    }
    return examples[fieldName] || 'Sample data...'
  }

  const isNewRow = !mapping.docketField && !mapping.providerField

  return (
    <div className={`grid grid-cols-3 gap-6 py-3 border-b border-gray-100 group transition-colors ${
      isNewRow ? 'bg-gray-100/50' : 'hover:bg-gray-50'
    }`}>
      <div>
        <input
          type="text"
          value={mapping.docketField}
          onChange={(e) => onUpdate({ docketField: e.target.value })}
          className={`w-full border-0 bg-transparent p-2 text-sm text-gray-900 focus:bg-white focus:ring-2 focus:ring-gray-900 rounded-md transition-all ${
            isNewRow ? 'bg-white ring-2 ring-gray-900' : ''
          }`}
          placeholder="Enter Docket field name"
          autoFocus={isNewRow}
        />
      </div>
      <div className="flex items-center gap-2">
        {isRequired && <span className="text-red-500 text-sm">*</span>}
        <input
          type="text"
          value={mapping.providerField}
          onChange={(e) => onUpdate({ providerField: e.target.value })}
          className={`w-full border-0 bg-transparent p-2 text-sm text-gray-900 focus:bg-white focus:ring-2 focus:ring-gray-900 rounded-md transition-all ${
            isNewRow ? 'bg-white ring-2 ring-gray-900' : ''
          }`}
          placeholder={`Enter ${providerName} field name`}
        />
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-500">{getExampleValue(mapping.providerField)}</span>
        <button 
          onClick={onRemove}
          className={`p-1 text-gray-400 hover:text-red-600 rounded transition-all ${
            isNewRow ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
          }`}
          title={isNewRow ? "Cancel" : "Remove mapping"}
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  )
}


