import { useState, useRef, useEffect } from 'react'

export type DropdownOption = {
  id: string
  label: string
  value: string
  subtitle?: string
  avatar?: string
  isSelected: boolean
}

type MultiSelectDropdownProps = {
  options: DropdownOption[]
  selectedValues: string[]
  onSelectionChange: (selectedValues: string[]) => void
  placeholder?: string
  label?: string
  className?: string
}

export function MultiSelectDropdown({
  options,
  selectedValues,
  onSelectionChange,
  placeholder = "Select options...",
  label,
  className = ""
}: MultiSelectDropdownProps) {
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

  const toggleOption = (value: string) => {
    const newSelection = selectedValues.includes(value)
      ? selectedValues.filter(v => v !== value)
      : [...selectedValues, value]
    onSelectionChange(newSelection)
  }

  const selectedOptions = options.filter(option => selectedValues.includes(option.value))
  const displayText = selectedOptions.length === 0 
    ? placeholder 
    : selectedOptions.length === 1 
      ? selectedOptions[0].label
      : `${selectedOptions.length} selected`

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
          {options.map((option) => (
            <div
              key={option.id}
              className="relative cursor-pointer select-none py-2 px-3 hover:bg-gray-50"
              onClick={() => toggleOption(option.value)}
            >
              <div className="flex items-center gap-3">
                {/* Checkbox */}
                <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                  selectedValues.includes(option.value) ? 'border-gray-900 bg-gray-900' : 'border-gray-300'
                }`}>
                  {selectedValues.includes(option.value) && (
                    <svg className="h-2.5 w-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900 truncate">{option.label}</div>
                  {option.subtitle && (
                    <div className="text-xs text-gray-500 truncate">{option.subtitle}</div>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {options.length === 0 && (
            <div className="py-2 px-3 text-sm text-gray-500">No options available</div>
          )}
        </div>
      )}

      {/* Selected Count */}
      {selectedValues.length > 0 && (
        <div className="mt-2 text-xs text-gray-600">
          {selectedValues.length} option{selectedValues.length !== 1 ? 's' : ''} selected
        </div>
      )}
    </div>
  )
}
