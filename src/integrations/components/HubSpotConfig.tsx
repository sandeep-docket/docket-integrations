import { useState } from 'react'
import { useIntegrationsStore } from '../store'

type FieldMapping = {
  id: string
  docketField: string
  hubspotField: string
}

type ObjectPermissions = {
  canRead: boolean
  canWrite: boolean
}

export function HubSpotConfigPanel({ onClose }: { onClose: () => void }) {
  const configure = useIntegrationsStore((s) => s.configure)

  // Object permissions
  const [companyPermissions, setCompanyPermissions] = useState<ObjectPermissions>({ canRead: true, canWrite: true })
  const [dealPermissions, setDealPermissions] = useState<ObjectPermissions>({ canRead: true, canWrite: true })
  const [contactPermissions, setContactPermissions] = useState<ObjectPermissions>({ canRead: true, canWrite: true })

  // Field mappings for each object
  const [companyMappings] = useState<FieldMapping[]>([
    { id: 'comp1', docketField: 'Company Name', hubspotField: 'Company Name' },
    { id: 'comp2', docketField: 'Description', hubspotField: 'Description' },
    { id: 'comp3', docketField: 'Company Domain Name', hubspotField: 'Company Domain Name' },
    { id: 'comp4', docketField: 'Industry', hubspotField: 'Industry' },
    { id: 'comp5', docketField: 'Number Of Employees', hubspotField: 'Number Of Employees' },
    { id: 'comp6', docketField: 'City', hubspotField: 'City' },
    { id: 'comp7', docketField: 'Record Source', hubspotField: 'Record Source' },
    { id: 'comp8', docketField: 'Annual Revenue', hubspotField: 'Annual Revenue' },
    { id: 'comp9', docketField: 'Last Activity Date', hubspotField: 'Last Activity Date' },
    { id: 'comp10', docketField: 'Owner', hubspotField: 'Owner' },
    { id: 'comp11', docketField: 'Type', hubspotField: 'Type' },
    { id: 'comp12', docketField: 'Year Founded', hubspotField: 'Year Founded' },
  ])

  const [dealMappings] = useState<FieldMapping[]>([
    { id: 'deal1', docketField: 'Deal', hubspotField: 'Deal' },
    { id: 'deal2', docketField: 'Primary Associated Company', hubspotField: 'Primary Associated Company' },
    { id: 'deal3', docketField: 'Create/Edit', hubspotField: 'Create Date' },
    { id: 'deal4', docketField: 'Amount', hubspotField: 'Amount' },
    { id: 'deal5', docketField: 'Close Date', hubspotField: 'Close Date' },
    { id: 'deal6', docketField: 'Number Of Associated Contacts', hubspotField: 'Number Of Associated Contacts' },
    { id: 'deal7', docketField: 'Deal Description', hubspotField: 'Deal Description' },
    { id: 'deal8', docketField: 'Weighted Amount', hubspotField: 'Weighted Amount' },
    { id: 'deal9', docketField: 'Deal Activity Date', hubspotField: 'Deal Activity Date' },
    { id: 'deal10', docketField: 'Forecast Category', hubspotField: 'Forecast Category' },
    { id: 'deal11', docketField: 'Last Activity Date', hubspotField: 'Last Activity Date' },
    { id: 'deal12', docketField: 'Date Entered Current Stage', hubspotField: 'Date Entered Current Stage' },
    { id: 'deal13', docketField: 'Total Notes', hubspotField: 'Total Notes' },
    { id: 'deal14', docketField: 'Next Step', hubspotField: 'Next Step' },
    { id: 'deal15', docketField: 'Deal Owner', hubspotField: 'Deal Owner' },
    { id: 'deal16', docketField: 'Deal Probability', hubspotField: 'Deal Probability' },
    { id: 'deal17', docketField: 'Deal Stage', hubspotField: 'Deal Stage' },
    { id: 'deal18', docketField: 'Deal Type', hubspotField: 'Deal Type' },
  ])

  const [contactMappings] = useState<FieldMapping[]>([
    { id: 'cont1', docketField: 'Contact', hubspotField: 'Contact' },
    { id: 'cont2', docketField: 'Company Name', hubspotField: 'Company Name' },
    { id: 'cont3', docketField: 'Email', hubspotField: 'Email' },
    { id: 'cont4', docketField: 'Salutation', hubspotField: 'Salutation' },
    { id: 'cont5', docketField: 'Contact Priority', hubspotField: 'Contact Priority' },
    { id: 'cont6', docketField: 'First Activity Date', hubspotField: 'First Activity Date' },
    { id: 'cont7', docketField: 'First Name', hubspotField: 'First Name' },
    { id: 'cont8', docketField: 'Last Name', hubspotField: 'Last Name' },
    { id: 'cont9', docketField: 'Contact Owner', hubspotField: 'Contact Owner' },
    { id: 'cont10', docketField: 'Job Title', hubspotField: 'Job Title' },
    { id: 'cont11', docketField: 'Lifecycle Stage', hubspotField: 'Lifecycle Stage' },
    { id: 'cont12', docketField: 'Lead Status', hubspotField: 'Lead Status' },
    { id: 'cont13', docketField: 'HubSpot Score', hubspotField: 'HubSpot Score' },
  ])

  const save = () => {
    configure('hubspot', {
      companyPermissions,
      dealPermissions, 
      contactPermissions,
      companyMappings,
      dealMappings,
      contactMappings,
      lastUpdated: new Date().toISOString()
    })
    onClose()
  }

  return (
    <div className="flex h-full flex-col bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 bg-gradient-to-r from-orange-50 to-red-50 px-6 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-600 shadow-lg">
              <span className="text-sm font-bold text-white">HS</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">HubSpot Field Mapping</h2>
              <p className="text-sm text-gray-600 mt-1">Configure how data syncs between Docket and HubSpot</p>
            </div>
          </div>
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

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        {/* Company Section */}
        <ObjectSection
          title="Company"
          description="Sync using the same object connections."
          permissions={companyPermissions}
          onPermissionsChange={setCompanyPermissions}
          mappings={companyMappings}
        />

        {/* Deal Section */}
        <ObjectSection
          title="Deal"
          description="Sync using the same object connections."
          permissions={dealPermissions}
          onPermissionsChange={setDealPermissions}
          mappings={dealMappings}
        />

        {/* Contact Section */}
        <ObjectSection
          title="Contact"
          description="Sync using the same object connections."
          permissions={contactPermissions}
          onPermissionsChange={setContactPermissions}
          mappings={contactMappings}
        />
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 bg-gray-50 px-6 py-6">
        <div className="flex items-center justify-between">
          <button className="inline-flex items-center gap-2 text-sm text-orange-600 hover:text-orange-800 font-medium">
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
              className="rounded-lg bg-orange-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-orange-700 transition-colors shadow-lg shadow-orange-600/25"
            >
              Save Configuration
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function ObjectSection({ 
  title, 
  description, 
  permissions, 
  onPermissionsChange, 
  mappings 
}: {
  title: string
  description: string
  permissions: ObjectPermissions
  onPermissionsChange: (permissions: ObjectPermissions) => void
  mappings: FieldMapping[]
}) {
  const [isExpanded, setIsExpanded] = useState(false)

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
        <div className="flex items-center gap-1 text-blue-600" title="Write to HubSpot">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </div>
      )
    } else if (permissions.canRead) {
      return (
        <div className="flex items-center gap-1 text-green-600" title="Read from HubSpot">
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
    <div className="mb-6 rounded-xl border border-gray-200 bg-white shadow-sm">
      {/* Section Header */}
      <div className="border-b border-gray-100 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-2 text-left"
            >
              <svg 
                className={`h-4 w-4 text-gray-400 transition-transform ${isExpanded ? 'rotate-90' : ''}`} 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                <p className="text-sm text-gray-600">{description}</p>
              </div>
            </button>
            {getDirectionIcon()}
          </div>
          
          {/* Read/Write toggles */}
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={permissions.canRead}
                onChange={(e) => onPermissionsChange({ ...permissions, canRead: e.target.checked })}
                className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
              />
              <div className="flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-md bg-green-100">
                  <svg className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-gray-700">Read</span>
              </div>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={permissions.canWrite}
                onChange={(e) => onPermissionsChange({ ...permissions, canWrite: e.target.checked })}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <div className="flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-md bg-blue-100">
                  <svg className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-gray-700">Write</span>
              </div>
            </label>
          </div>
        </div>
      </div>

      {/* Expandable Field Mappings */}
      {isExpanded && (
        <div className="px-6 py-4">
          <div className="space-y-2">
            {mappings.map((mapping) => (
              <div key={mapping.id} className="grid grid-cols-2 gap-4 py-2 text-sm">
                <div className="text-gray-900">{mapping.docketField}</div>
                <div className="text-gray-700">{mapping.hubspotField}</div>
              </div>
            ))}
          </div>
          <div className="mt-4 text-xs text-gray-600">
            ✓ Sync and sync required by "{title}" as a custom field
          </div>
        </div>
      )}
    </div>
  )
}
