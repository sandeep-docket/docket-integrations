import type { DocumentItem, FolderStructure } from './FolderBrowser'

type SimpleFolderTreeProps = {
  folders: FolderStructure[]
  selectedFiles: Set<string>
  selectedFolders: Set<string>
  onFileToggle: (fileId: string) => void
  onFolderToggle: (folderId: string) => void
  onFolderSelect: (folderId: string) => void
  onSelectAll: () => void
  onDeleteSelected: () => void
  expandedFolders: Set<string>
}

const FolderIcon = () => (
  <svg className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
  </svg>
)

const FileIcon = () => (
  <svg className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
)


export function SimpleFolderTree({
  folders,
  selectedFiles,
  selectedFolders,
  onFileToggle,
  onFolderToggle,
  onFolderSelect,
  onSelectAll,
  onDeleteSelected,
  expandedFolders
}: SimpleFolderTreeProps) {
  
  const totalSelected = selectedFiles.size + selectedFolders.size
  const hasSelections = totalSelected > 0

  const renderFile = (file: DocumentItem, level: number) => (
    <div 
      key={file.id}
      className={`flex items-center gap-2 p-2 rounded cursor-pointer transition-all ${
        selectedFiles.has(file.id) ? 'bg-blue-50 border border-blue-200' : 'hover:bg-gray-50'
      }`}
      style={{ paddingLeft: `${level * 20 + 8}px` }}
      onClick={() => onFileToggle(file.id)}
    >
      <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
        selectedFiles.has(file.id) ? 'border-blue-600 bg-blue-600' : 'border-gray-300'
      }`}>
        {selectedFiles.has(file.id) && (
          <svg className="h-2.5 w-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        )}
      </div>
      <FileIcon />
      <div className="flex-1 min-w-0">
        <span className="text-sm text-gray-900 truncate">{file.name}</span>
        <div className="text-xs text-gray-500">{file.size} • {file.lastModified}</div>
      </div>
    </div>
  )

  const renderFolder = (folder: FolderStructure, level: number = 0) => {
    const isExpanded = expandedFolders.has(folder.id)
    const isSelected = selectedFolders.has(folder.id)
    const hasSubfolders = folder.children.some(child => 'children' in child)
    const files = folder.children.filter(child => !('children' in child)) as DocumentItem[]
    const subfolders = folder.children.filter(child => 'children' in child) as FolderStructure[]

    return (
      <div key={folder.id}>
        {/* Folder Header */}
        <div 
          className={`flex items-center gap-2 p-2 rounded cursor-pointer transition-all ${
            isSelected ? 'bg-blue-50 border border-blue-200' : 'hover:bg-gray-50'
          }`}
          style={{ paddingLeft: `${level * 20 + 8}px` }}
        >
          {/* Folder Selection Checkbox */}
          <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
            isSelected ? 'border-blue-600 bg-blue-600' : 'border-gray-300'
          }`}>
            {isSelected && (
              <svg className="h-2.5 w-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            )}
          </div>
          
          {/* Expand/Collapse Button */}
          {hasSubfolders && (
            <button
              onClick={() => onFolderToggle(folder.id)}
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
          
          {/* Folder Icon and Name */}
          <div className="flex items-center gap-2 flex-1" onClick={() => onFolderSelect(folder.id)}>
            <FolderIcon />
            <span className="text-sm font-medium text-gray-900">{folder.name}</span>
            <span className="text-xs text-gray-500">({folder.children.length} items)</span>
          </div>
        </div>

        {/* Files in this folder */}
        {files.length > 0 && (
          <div>
            {files.map(file => renderFile(file, level + 1))}
          </div>
        )}

        {/* Subfolders */}
        {isExpanded && subfolders.map(subfolder => renderFolder(subfolder, level + 1))}
      </div>
    )
  }

  return (
    <div className="space-y-1">
      {/* Global Actions */}
      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg mb-4">
        <div className="flex items-center gap-4">
          <button
            onClick={onSelectAll}
            className="text-sm text-gray-600 hover:text-gray-900 font-medium"
          >
            Select All
          </button>
          {hasSelections && (
            <span className="text-sm text-gray-600">
              {totalSelected} selected
            </span>
          )}
        </div>
        
        {hasSelections && (
          <button
            onClick={onDeleteSelected}
            className="px-3 py-1.5 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
          >
            Delete Selected
          </button>
        )}
      </div>

      {/* Tree Structure */}
      {folders.map(folder => renderFolder(folder))}
    </div>
  )
}