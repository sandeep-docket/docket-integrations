import { useState, useRef, useEffect } from 'react'

export type UserOption = {
  id: string
  name: string
  email: string
  role: string
  department?: string
  avatar?: string
  isSelected: boolean
}

type UserMultiSelectDropdownProps = {
  users: UserOption[]
  selectedUserIds: string[]
  onSelectionChange: (selectedIds: string[]) => void
  placeholder?: string
  label?: string
  className?: string
}

export function UserMultiSelectDropdown({
  users,
  selectedUserIds,
  onSelectionChange,
  placeholder = "Select users...",
  label,
  className = ""
}: UserMultiSelectDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const toggleUser = (userId: string) => {
    const newSelection = selectedUserIds.includes(userId)
      ? selectedUserIds.filter(id => id !== userId)
      : [...selectedUserIds, userId]
    onSelectionChange(newSelection)
  }

  const selectedUsers = users.filter(user => selectedUserIds.includes(user.id))
  const displayText = selectedUsers.length === 0 
    ? placeholder 
    : selectedUsers.length === 1 
      ? selectedUsers[0].name
      : `${selectedUsers.length} users selected`

  const getUserMonogram = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      )}
      
      {/* Dropdown Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-full cursor-pointer rounded-lg border border-gray-300 bg-white py-2.5 pl-3 pr-10 text-left focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 text-sm"
      >
        <span className="block truncate text-gray-900">{displayText}</span>
        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
          <svg
            className={`h-5 w-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-lg bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none border border-gray-200">
          {users.map((user) => (
            <div
              key={user.id}
              className="relative cursor-pointer select-none py-3 px-3 hover:bg-gray-50"
              onClick={() => toggleUser(user.id)}
            >
              <div className="flex items-center gap-3">
                {/* Checkbox */}
                <div className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                  selectedUserIds.includes(user.id) ? 'border-gray-900 bg-gray-900' : 'border-gray-300'
                }`}>
                  {selectedUserIds.includes(user.id) && (
                    <svg className="h-2.5 w-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>

                {/* Avatar */}
                <div className="flex-shrink-0">
                  {user.avatar ? (
                    <img 
                      src={user.avatar} 
                      alt={user.name}
                      className="h-8 w-8 rounded-full"
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                      <span className="text-xs font-semibold text-gray-700">{getUserMonogram(user.name)}</span>
                    </div>
                  )}
                </div>

                {/* User Info */}
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900 truncate">{user.name}</div>
                  <div className="text-xs text-gray-500 truncate">
                    {user.role}{user.department && ` • ${user.department}`}
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {users.length === 0 && (
            <div className="py-2 px-3 text-sm text-gray-500">No users available</div>
          )}
        </div>
      )}

      {/* Selected Count */}
      {selectedUserIds.length > 0 && (
        <div className="mt-2 text-xs text-gray-600">
          {selectedUserIds.length} user{selectedUserIds.length !== 1 ? 's' : ''} selected
        </div>
      )}
    </div>
  )
}
