import { useState } from 'react'
import { useIntegrationsStore } from '../store'

type JiraProject = {
  id: string
  name: string
  key: string
  description: string
  issueCount: number
  lastModified: string
  isSelected: boolean
}

export function JiraConfigPanel({ onClose }: { onClose: () => void }) {
  const { connections } = useIntegrationsStore()
  const isAlreadyConnected = Boolean(connections['jira'])
  
  const [isConnected, setIsConnected] = useState(isAlreadyConnected)
  const [isConnecting, setIsConnecting] = useState(false)
  
  const [projects, setProjects] = useState<JiraProject[]>([
    { id: 'p1', name: 'Product Development', key: 'PROD', description: 'Main product development and feature requests', issueCount: 234, lastModified: '2 hours ago', isSelected: true },
    { id: 'p2', name: 'Customer Support', key: 'SUP', description: 'Customer issues and bug reports', issueCount: 156, lastModified: '1 day ago', isSelected: true },
    { id: 'p3', name: 'Sales Engineering', key: 'SE', description: 'Technical sales support and integration requests', issueCount: 89, lastModified: '3 days ago', isSelected: false },
    { id: 'p4', name: 'Marketing Requests', key: 'MKT', description: 'Marketing campaigns and content requests', issueCount: 67, lastModified: '1 week ago', isSelected: false },
  ])

  const handleConnect = async () => {
    setIsConnecting(true)
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsConnected(true)
    setIsConnecting(false)
  }

  const toggleProject = (projectId: string) => {
    setProjects(prev => prev.map(project => 
      project.id === projectId ? { ...project, isSelected: !project.isSelected } : project
    ))
  }

  const save = () => {
    const { configure } = useIntegrationsStore.getState()
    configure('jira', { 
      selectedProjects: projects.filter(p => p.isSelected),
      lastUpdated: new Date().toISOString()
    })
    onClose()
  }

  if (!isConnected) {
    return (
      <div className="flex h-full flex-col bg-white rounded-xl overflow-hidden">
        <div className="border-b border-gray-200 px-6 py-6">
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-gray-800 to-gray-900">
              <span className="text-sm font-bold text-white">J</span>
            </div>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-gray-900">Connect Jira</h1>
              <p className="text-gray-600 mt-0.5 text-sm">Connect your Jira workspace</p>
            </div>
            <button onClick={onClose} className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center max-w-sm">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 mx-auto mb-6">
              <span className="text-3xl">🎫</span>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Connect your Jira workspace</h2>
            <p className="text-gray-600 mb-8">
              Access project issues and development insights to enhance Sales Knowledge Lake with technical context.
            </p>
            <button
              onClick={handleConnect}
              disabled={isConnecting}
              className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-6 py-3 text-sm font-semibold text-white hover:bg-gray-800 disabled:opacity-50 transition-colors min-w-[140px]"
            >
              {isConnecting ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>Connecting...</span>
                </>
              ) : (
                'Connect to Jira'
              )}
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col bg-white rounded-xl overflow-hidden">
      <div className="border-b border-gray-200 px-6 py-6">
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-gray-800 to-gray-900">
            <span className="text-sm font-bold text-white">J</span>
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-gray-900">Jira Configuration</h1>
            <p className="text-gray-600 mt-0.5 text-sm">Select projects for issue tracking insights</p>
          </div>
          <button onClick={onClose} className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-4">Select Projects</h3>
          <div className="space-y-3">
            {projects.map((project) => (
              <div 
                key={project.id}
                className={`rounded-lg border p-4 transition-all cursor-pointer ${
                  project.isSelected ? 'border-gray-900 bg-gray-50' : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
                onClick={() => toggleProject(project.id)}
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
                    <span className="text-lg">🎫</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="text-sm font-semibold text-gray-900">{project.name}</h4>
                      <span className="text-xs font-mono bg-gray-100 text-gray-700 px-2 py-1 rounded">{project.key}</span>
                      <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800">
                        {project.issueCount} issues
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{project.description}</p>
                    <div className="text-xs text-gray-500">Updated {project.lastModified}</div>
                  </div>
                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                    project.isSelected ? 'border-gray-900 bg-gray-900' : 'border-gray-300'
                  }`}>
                    {project.isSelected && (
                      <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 bg-gray-50 px-6 py-6">
        <div className="flex items-center justify-between">
          <button className="inline-flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900 font-medium">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Jira integration help
          </button>
          <div className="flex gap-3">
            <button onClick={onClose} className="rounded-xl border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              Cancel
            </button>
            <button onClick={save} className="rounded-xl bg-gray-900 hover:bg-gray-800 px-5 py-2.5 text-sm font-semibold text-white transition-colors">
              Save Configuration
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
