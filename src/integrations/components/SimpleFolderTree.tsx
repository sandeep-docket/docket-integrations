import type { FolderStructure } from './FolderBrowser'

type SimpleFolderTreeProps = {
  folders: FolderStructure[]
  selectedFiles: Set<string>
  onFileToggle: (fileId: string) => void
  onFolderToggle: (folderId: string) => void
  expandedFolders: Set<string>
}

export function SimpleFolderTree({
  folders,
  selectedFiles,
  onFileToggle,
  onFolderToggle,
  expandedFolders
}: SimpleFolderTreeProps) {
  
  const renderFolder = (folder: FolderStructure, level: number = 0) => {
    const isExpanded = expandedFolders.has(folder.id)
    const hasSubfolders = folder.children.some(child => 'children' in child)
    const files = folder.children.filter(child => !('children' in child))
    const subfolders = folder.children.filter(child => 'children' in child) as FolderStructure[]

    return (
      <div key={folder.id}>
        {/* Folder Header */}
        <div 
          className="flex items-center gap-2 p-2 hover:bg-gray-50 cursor-pointer rounded"
          style={{ paddingLeft: `${level * 20 + 8}px` }}
          onClick={() => hasSubfolders && onFolderToggle(folder.id)}
        >
          {hasSubfolders ? (
            <svg 
              className={`h-4 w-4 text-gray-500 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          ) : (
            <div className="w-4" />
          )}
          <span className="text-base mr-2">{folder.icon}</span>
          <span className="text-sm font-medium text-gray-900">{folder.name}</span>
          <span className="text-xs text-gray-500 ml-2">({folder.children.length} items)</span>
        </div>

        {/* Files in this folder */}
        {files.length > 0 && (
          <div style={{ paddingLeft: `${level * 20 + 32}px` }}>
            {files.map((file: any) => (
              <div 
                key={file.id}
                className={`flex items-center gap-2 p-2 rounded cursor-pointer transition-all ${
                  selectedFiles.has(file.id) ? 'bg-blue-50 border border-blue-200' : 'hover:bg-gray-50'
                }`}
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
                <span className="text-base mr-2">{file.icon}</span>
                <div className="flex-1 min-w-0">
                  <span className="text-sm text-gray-900 truncate">{file.name}</span>
                  <div className="text-xs text-gray-500">{file.size} • {file.lastModified}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Subfolders */}
        {isExpanded && subfolders.map(subfolder => renderFolder(subfolder, level + 1))}
      </div>
    )
  }

  return (
    <div className="space-y-1">
      {folders.map(folder => renderFolder(folder))}
    </div>
  )
}
