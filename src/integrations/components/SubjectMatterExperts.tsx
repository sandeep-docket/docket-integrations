import { useState } from 'react'

export type SubjectMatterExpert = {
  id: string
  name: string
  email: string
  role: string
  department?: string
  callCount?: number
  isSelected: boolean
}

type SubjectMatterExpertsProps = {
  experts: SubjectMatterExpert[]
  onExpertToggle: (expertId: string) => void
  title?: string
  searchPlaceholder?: string
}

export function SubjectMatterExperts({
  experts,
  onExpertToggle,
  title = "Subject Matter Experts",
  searchPlaceholder = "Search experts..."
}: SubjectMatterExpertsProps) {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredExperts = experts.filter(expert => 
    expert.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    expert.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    expert.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (expert.department && expert.department.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  const selectedExperts = experts.filter(e => e.isSelected)

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900">{title}</h3>
        <div className="text-sm text-gray-600">{selectedExperts.length} experts selected</div>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <svg className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          placeholder={searchPlaceholder}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-lg border border-gray-300 bg-white pl-10 pr-4 py-2.5 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
        />
      </div>

      {/* Table Header */}
      <div className="mb-3 grid grid-cols-12 gap-4 px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wide">
        <div className="col-span-4">Name</div>
        <div className="col-span-3">Role</div>
        <div className="col-span-2">Department</div>
        <div className="col-span-2">Details</div>
        <div className="col-span-1">Select</div>
      </div>

      {/* Experts Table */}
      <div className="space-y-1">
        {filteredExperts.map((expert) => (
          <div 
            key={expert.id}
            className={`grid grid-cols-12 gap-4 items-center p-3 rounded-lg border transition-all cursor-pointer ${
              expert.isSelected ? 'border-gray-900 bg-gray-50' : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
            onClick={() => onExpertToggle(expert.id)}
          >
            <div className="col-span-4">
              <div className="text-sm font-medium text-gray-900 truncate">{expert.name}</div>
              <div className="text-xs text-gray-500 truncate">{expert.email}</div>
            </div>
            <div className="col-span-3">
              <span className="text-sm text-gray-600 truncate">{expert.role}</span>
            </div>
            <div className="col-span-2">
              <span className="text-sm text-gray-600">{expert.department || 'N/A'}</span>
            </div>
            <div className="col-span-2">
              <span className="text-xs text-gray-500">
                {expert.callCount ? `${expert.callCount} calls` : 'Active'}
              </span>
            </div>
            <div className="col-span-1 flex justify-center">
              <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                expert.isSelected ? 'border-gray-900 bg-gray-900' : 'border-gray-300'
              }`}>
                {expert.isSelected && (
                  <svg className="h-2.5 w-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredExperts.length === 0 && searchQuery && (
        <div className="text-center py-12">
          <div className="text-gray-500">No experts match "{searchQuery}"</div>
        </div>
      )}

      {filteredExperts.length === 0 && !searchQuery && (
        <div className="text-center py-12">
          <div className="text-gray-500">No experts available</div>
        </div>
      )}
    </div>
  )
}
