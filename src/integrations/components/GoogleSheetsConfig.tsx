import { useState } from 'react'
import { useIntegrationsStore } from '../store'

type GoogleSheet = {
  id: string
  name: string
  url: string
  tabName: string
  lastModified: string
  rowCount: number
  isValid: boolean
}

export function GoogleSheetsConfigPanel({ onClose }: { onClose: () => void }) {
  const { connections } = useIntegrationsStore()
  const isAlreadyConnected = Boolean(connections['google-sheets'])
  
  const [isConnected, setIsConnected] = useState(isAlreadyConnected)
  const [isConnecting, setIsConnecting] = useState(false)
  const [newSheetUrl, setNewSheetUrl] = useState('')
  const [isAddingSheet, setIsAddingSheet] = useState(false)
  
  const [sheets, setSheets] = useState<GoogleSheet[]>([
    { 
      id: 'sheet1', 
      name: 'Sales Pipeline Q1 2024', 
      url: 'https://docs.google.com/spreadsheets/d/1abc123/edit#gid=0', 
      tabName: 'Pipeline Data', 
      lastModified: '2 hours ago', 
      rowCount: 156, 
      isValid: true 
    },
    { 
      id: 'sheet2', 
      name: 'Customer Contact Database', 
      url: 'https://docs.google.com/spreadsheets/d/1def456/edit#gid=987654321', 
      tabName: 'Contacts', 
      lastModified: '1 day ago', 
      rowCount: 423, 
      isValid: true 
    },
    { 
      id: 'sheet3', 
      name: 'Product Pricing Matrix', 
      url: 'https://docs.google.com/spreadsheets/d/1ghi789/edit#gid=555666777', 
      tabName: 'Pricing Tiers', 
      lastModified: '3 days ago', 
      rowCount: 89, 
      isValid: true 
    },
  ])

  const handleConnect = async () => {
    setIsConnecting(true)
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsConnected(true)
    setIsConnecting(false)
  }

  const validateSheetUrl = (url: string): { isValid: boolean; sheetName?: string; tabName?: string } => {
    const sheetRegex = /https:\/\/docs\.google\.com\/spreadsheets\/d\/([a-zA-Z0-9-_]+)\/edit#gid=(\d+)/
    const match = url.match(sheetRegex)
    
    if (match) {
      // In a real app, you'd fetch the sheet name from the Google Sheets API
      return {
        isValid: true,
        sheetName: 'New Sheet', // Would be fetched from API
        tabName: 'Tab ' + Math.floor(Math.random() * 10) // Would be fetched from API
      }
    }
    
    return { isValid: false }
  }

  const addSheet = async () => {
    if (!newSheetUrl.trim()) return
    
    setIsAddingSheet(true)
    await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
    
    const validation = validateSheetUrl(newSheetUrl)
    
    if (validation.isValid) {
      const newSheet: GoogleSheet = {
        id: `sheet-${Date.now()}`,
        name: validation.sheetName || 'New Sheet',
        url: newSheetUrl,
        tabName: validation.tabName || 'Sheet1',
        lastModified: 'Just added',
        rowCount: Math.floor(Math.random() * 200) + 50,
        isValid: true
      }
      
      setSheets(prev => [...prev, newSheet])
      setNewSheetUrl('')
    }
    
    setIsAddingSheet(false)
  }

  const removeSheet = (sheetId: string) => {
    setSheets(prev => prev.filter(sheet => sheet.id !== sheetId))
  }

  const save = () => {
    const { configure } = useIntegrationsStore.getState()
    configure('google-sheets', { 
      sheets: sheets,
      lastUpdated: new Date().toISOString()
    })
    onClose()
  }

  if (!isConnected) {
    return (
      <div className="flex h-full flex-col bg-white rounded-xl overflow-hidden">
        {/* Header */}
        <div className="border-b border-gray-200 px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 shadow-lg">
                <span className="text-sm font-bold text-white">GS</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Connect Google Sheets</h1>
                <p className="text-gray-600 mt-0.5 text-sm">Connect your Google Sheets to Docket</p>
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

        {/* Connection Content */}
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center max-w-sm">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 mx-auto mb-6">
              <span className="text-3xl">📊</span>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Connect your Google Sheets</h2>
            <p className="text-gray-600 mb-8">
              Give Docket access to your spreadsheets to power the Sales Knowledge Lake with structured data and insights.
            </p>
            <button
              onClick={handleConnect}
              disabled={isConnecting}
              className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-6 py-3 text-sm font-semibold text-white hover:bg-gray-800 disabled:opacity-50 transition-colors shadow-lg min-w-[140px]"
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
                  Connect to Google Sheets
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
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 shadow-lg">
              <span className="text-sm font-bold text-white">GS</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Google Sheets Configuration</h1>
              <p className="text-gray-600 mt-0.5 text-sm">Add specific sheet tabs to sync with Sales Knowledge Lake</p>
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

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="space-y-6">
          {/* Add New Sheet */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Add Sheet Tab</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sheet tab URL <span className="text-red-500">*</span>
                </label>
                <input
                  type="url"
                  value={newSheetUrl}
                  onChange={(e) => setNewSheetUrl(e.target.value)}
                  placeholder="https://docs.google.com/spreadsheets/d/your-sheet-id/edit#gid=123456789"
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
                />
                <p className="mt-2 text-xs text-gray-600">
                  Paste the link to the specific tab in Google Sheets you want to sync. 
                  Make sure the URL includes the #gid= parameter for the specific tab.
                </p>
              </div>
              
              <button
                onClick={addSheet}
                disabled={!newSheetUrl.trim() || isAddingSheet}
                className="inline-flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-gray-800 disabled:opacity-50 transition-colors"
              >
                {isAddingSheet ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    <span>Adding...</span>
                  </>
                ) : (
                  <>
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Sheet Tab
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Connected Sheets */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Connected Sheet Tabs</h3>
              <div className="text-sm text-gray-600">
                {sheets.length} tab{sheets.length !== 1 ? 's' : ''} syncing to Knowledge Lake
              </div>
            </div>

            {sheets.length > 0 ? (
              <div className="space-y-3">
                {sheets.map((sheet) => (
                  <SheetCard
                    key={sheet.id}
                    sheet={sheet}
                    onRemove={() => removeSheet(sheet.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 rounded-lg border border-dashed border-gray-300 bg-gray-50">
                <div className="text-gray-500 mb-2">No sheet tabs added yet</div>
                <p className="text-xs text-gray-600">Add your first sheet tab using the form above</p>
              </div>
            )}
          </div>

          {/* Info Section */}
          <div className="rounded-lg bg-blue-50 border border-blue-200 p-4">
            <div className="flex items-start gap-3">
              <svg className="h-5 w-5 text-blue-600 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h4 className="text-sm font-semibold text-blue-900">How to get the correct URL</h4>
                <ol className="text-xs text-blue-700 mt-2 space-y-1 list-decimal list-inside">
                  <li>Open your Google Sheet and navigate to the specific tab you want to sync</li>
                  <li>Copy the URL from your browser's address bar</li>
                  <li>Make sure the URL includes #gid= followed by numbers (the tab ID)</li>
                  <li>Paste the complete URL in the field above</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 bg-gray-50 px-6 py-6">
        <div className="flex items-center justify-between">
          <button className="inline-flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900 font-medium">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Google Sheets integration help
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
              disabled={sheets.length === 0}
              className="rounded-xl bg-gray-900 hover:bg-gray-800 px-5 py-2.5 text-sm font-semibold text-white transition-colors shadow-lg disabled:opacity-50"
            >
              Save Configuration
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function SheetCard({ 
  sheet, 
  onRemove 
}: { 
  sheet: GoogleSheet
  onRemove: () => void
}) {
  return (
    <div className="group rounded-lg border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition-all">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4 flex-1">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-xl">
            📊
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="text-base font-semibold text-gray-900 truncate">{sheet.name}</h4>
              {sheet.isValid ? (
                <div className="h-2 w-2 rounded-full bg-green-500" title="Valid connection" />
              ) : (
                <div className="h-2 w-2 rounded-full bg-red-500" title="Invalid URL" />
              )}
            </div>
            <div className="text-sm text-gray-600 mb-2">Tab: {sheet.tabName}</div>
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2h2a2 2 0 002-2z" />
                </svg>
                {sheet.rowCount} rows
              </span>
              <span>Updated {sheet.lastModified}</span>
              <button 
                onClick={() => window.open(sheet.url, '_blank')}
                className="opacity-0 group-hover:opacity-100 text-blue-600 hover:text-blue-800 transition-all"
              >
                Open in Sheets
              </button>
            </div>
          </div>
        </div>
        <button 
          onClick={onRemove}
          className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-600 rounded transition-all"
          title="Remove sheet tab"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  )
}
