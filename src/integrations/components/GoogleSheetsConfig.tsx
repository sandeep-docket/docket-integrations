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
  const [showAddForm, setShowAddForm] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  
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
      setShowAddForm(false)
    }
    
    setIsAddingSheet(false)
  }

  const filteredSheets = sheets.filter(sheet =>
    sheet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sheet.tabName.toLowerCase().includes(searchQuery.toLowerCase())
  )

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
          {/* Connected Sheets */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Sheet Tabs</h3>
              <div className="flex items-center gap-3">
                {sheets.length > 0 && (
                  <div className="text-xs text-green-700 bg-green-50 px-2 py-1 rounded-full">
                    ✓ {sheets.length} tabs synced
                  </div>
                )}
                <button
                  onClick={() => setShowAddForm(!showAddForm)}
                  className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <span className="text-sm">📊</span>
                  {showAddForm ? 'Cancel' : 'Add Sheet'}
                </button>
              </div>
            </div>

            {/* Search */}
            {sheets.length > 0 && (
              <div className="relative mb-4">
                <svg className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search sheets..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-white pl-10 pr-4 py-2.5 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
                />
              </div>
            )}

            {/* Inline Add Form */}
            {showAddForm && (
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 mb-4">
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Add New Sheet Tab</h4>
                <div className="space-y-3">
                  <input
                    type="url"
                    value={newSheetUrl}
                    onChange={(e) => setNewSheetUrl(e.target.value)}
                    placeholder="https://docs.google.com/spreadsheets/d/your-sheet-id/edit#gid=123456789"
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
                  />
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowAddForm(false)}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={addSheet}
                      disabled={!newSheetUrl.trim() || isAddingSheet}
                      className="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 disabled:opacity-50 transition-colors"
                    >
                      {isAddingSheet ? 'Adding...' : 'Add Sheet'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {filteredSheets.length > 0 ? (
              <div className="space-y-2">
                {filteredSheets.map((sheet) => (
                  <SheetCard
                    key={sheet.id}
                    sheet={sheet}
                    onRemove={() => removeSheet(sheet.id)}
                  />
                ))}
              </div>
            ) : sheets.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-4xl mb-4">📊</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No sheet tabs connected</h3>
                <p className="text-gray-600 mb-6">Add specific Google Sheets tabs to sync with Sales Knowledge Lake</p>
                <button
                  onClick={() => setShowAddForm(true)}
                  className="inline-flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-gray-800 transition-colors"
                >
                  <span className="text-sm">📊</span>
                  Add Sheet Tab
                </button>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-500">No sheets match "{searchQuery}"</div>
              </div>
            )}
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
    <div className="group rounded-lg border border-gray-200 bg-white p-3 hover:border-gray-300 transition-all">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="flex h-6 w-6 items-center justify-center rounded bg-green-100 flex-shrink-0">
            <span className="text-sm">📊</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-medium text-gray-900 truncate">{sheet.name}</h4>
              {sheet.isValid ? (
                <div className="h-2 w-2 rounded-full bg-green-500" title="Valid connection" />
              ) : (
                <div className="h-2 w-2 rounded-full bg-red-500" title="Invalid URL" />
              )}
            </div>
            <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
              <span>Tab: {sheet.tabName}</span>
              <span>•</span>
              <span>{sheet.rowCount} rows</span>
              <span>•</span>
              <span>{sheet.lastModified}</span>
              <button 
                onClick={(e) => {
                  e.stopPropagation()
                  window.open(sheet.url, '_blank')
                }}
                className="opacity-0 group-hover:opacity-100 text-blue-600 hover:text-blue-800 transition-all"
              >
                Open →
              </button>
            </div>
          </div>
        </div>
        <button
          onClick={onRemove}
          className="opacity-0 group-hover:opacity-100 rounded p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600 transition-all"
          title="Remove sheet"
        >
          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  )
}
