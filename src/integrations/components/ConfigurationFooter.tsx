type ConfigurationFooterProps = {
  onClose: () => void
  onSave?: () => void
  helpText?: string
  helpIcon?: React.ReactNode
  cancelText?: string
  saveText?: string
  saveDisabled?: boolean
  saveVariant?: 'primary' | 'blue'
}

export function ConfigurationFooter({
  onClose,
  onSave,
  helpText = "integration help",
  cancelText = "Cancel",
  saveText = "Save Configuration",
  saveDisabled = false,
  saveVariant = 'primary'
}: ConfigurationFooterProps) {
  return (
    <div className="border-t border-gray-200 bg-gray-50 px-6 py-6">
      <div className="flex items-center justify-between">
        <button className="inline-flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900 font-medium">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {helpText}
        </button>
        <div className="flex gap-3">
          <button 
            onClick={onClose}
            className="rounded-xl border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            {cancelText}
          </button>
          {onSave && (
            <button 
              onClick={onSave}
              disabled={saveDisabled}
              className={`rounded-xl px-5 py-2.5 text-sm font-semibold transition-colors disabled:opacity-50 ${
                saveVariant === 'blue'
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-gray-900 hover:bg-gray-800 text-white'
              }`}
            >
              {saveText}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
