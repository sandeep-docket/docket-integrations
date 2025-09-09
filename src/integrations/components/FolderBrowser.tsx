
export type FolderStructure = {
  id: string
  name: string
  path: string
  children: (FolderStructure | DocumentItem)[]
  icon: string
}

export type DocumentItem = {
  id: string
  name: string
  type: 'file' | 'page' | 'database' | 'site' | 'list' | 'library' | 'folder'
  path: string
  size?: string
  lastModified: string
  isSelected: boolean
  icon: string
  url?: string
  accountId: string
  accountName: string
  parentId?: string
  hasChildren?: boolean
}

// Folder Tree Component
export function FolderTree({ 
  folders, 
  expandedFolders, 
  currentFolderId, 
  onFolderClick, 
  onToggleExpand 
}: {
  folders: FolderStructure[]
  expandedFolders: Set<string>
  currentFolderId: string | null
  onFolderClick: (id: string, name: string) => void
  onToggleExpand: (id: string) => void
}) {
  const renderFolder = (folder: FolderStructure, level: number = 0) => {
    const isExpanded = expandedFolders.has(folder.id)
    const isCurrent = currentFolderId === folder.id
    const hasChildren = folder.children.some(child => 'children' in child)
    
    return (
      <div key={folder.id}>
        <div 
          className={`flex items-center gap-2 p-2 cursor-pointer transition-colors ${
            isCurrent ? 'bg-gray-200 text-gray-900' : 'hover:bg-gray-100 text-gray-700'
          }`}
          style={{ paddingLeft: `${8 + level * 16}px` }}
          onClick={() => onFolderClick(folder.id, folder.name)}
        >
          {hasChildren && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                onToggleExpand(folder.id)
              }}
              className="p-0.5 hover:bg-gray-200 rounded"
            >
              <svg 
                className={`h-3 w-3 text-gray-500 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
          {!hasChildren && <div className="w-4" />}
          <span className="text-sm">{folder.icon}</span>
          <span className="text-sm font-medium truncate">{folder.name}</span>
        </div>
        
        {isExpanded && hasChildren && (
          <div>
            {folder.children.filter(child => 'children' in child).map(child => 
              renderFolder(child as FolderStructure, level + 1)
            )}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="p-2">
      {folders.map(folder => renderFolder(folder))}
    </div>
  )
}

// Folder Contents Component
export function FolderContents({ 
  folderId, 
  folderStructure, 
  selectedFiles, 
  onFileToggle, 
  onFolderNavigate 
}: {
  folderId: string | null
  folderStructure: FolderStructure[]
  selectedFiles: Set<string>
  onFileToggle: (fileId: string) => void
  onFolderNavigate: (id: string, name: string) => void
}) {
  // Get current folder contents
  const getCurrentFolderContents = () => {
    if (!folderId) {
      return folderStructure
    }
    
    const findFolder = (folders: FolderStructure[]): FolderStructure | null => {
      for (const folder of folders) {
        if (folder.id === folderId) {
          return folder
        }
        const found = findFolder(folder.children.filter(c => 'children' in c) as FolderStructure[])
        if (found) return found
      }
      return null
    }
    
    const currentFolder = findFolder(folderStructure)
    return currentFolder ? currentFolder.children : []
  }

  const contents = getCurrentFolderContents()
  const folders = contents.filter(item => 'children' in item) as FolderStructure[]
  const files = contents.filter(item => !('children' in item)) as DocumentItem[]

  if (contents.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-4xl mb-2">📁</div>
          <div className="text-gray-500">This folder is empty</div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {/* Folders */}
      {folders.map(folder => (
        <div
          key={folder.id}
          className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 bg-white hover:border-gray-300 cursor-pointer transition-all"
          onClick={() => onFolderNavigate(folder.id, folder.name)}
        >
          <span className="text-lg">{folder.icon}</span>
          <div className="flex-1">
            <div className="text-sm font-medium text-gray-900">{folder.name}</div>
            <div className="text-xs text-gray-500">{folder.children.length} items</div>
          </div>
          <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      ))}
      
      {/* Files */}
      {files.map(file => (
        <div
          key={file.id}
          className={`flex items-center gap-3 p-3 rounded-lg border transition-all cursor-pointer ${
            selectedFiles.has(file.id) 
              ? 'border-gray-900 bg-gray-50' 
              : 'border-gray-200 bg-white hover:border-gray-300'
          }`}
          onClick={() => onFileToggle(file.id)}
        >
          <span className="text-lg">{file.icon}</span>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-gray-900 truncate">{file.name}</div>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span>{file.size}</span>
              <span>•</span>
              <span>{file.lastModified}</span>
            </div>
          </div>
          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
            selectedFiles.has(file.id) ? 'border-gray-900 bg-gray-900' : 'border-gray-300'
          }`}>
            {selectedFiles.has(file.id) && (
              <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
