import { useState } from 'react'
import { useIntegrationsStore } from '../store'

type ZendeskTicket = {
  id: string
  subject: string
  description: string
  status: 'open' | 'pending' | 'solved' | 'closed'
  priority: 'low' | 'normal' | 'high' | 'urgent'
  requester: string
  assignee: string
  created: string
  tags: string[]
  isSelected: boolean
}

type ZendeskArticleCategory = {
  id: string
  name: string
  description: string
  articleCount: number
  lastModified: string
  isSelected: boolean
  subcategories?: string[]
}

export function ZendeskConfigPanel({ onClose }: { onClose: () => void }) {
  const { connections } = useIntegrationsStore()
  const isAlreadyConnected = Boolean(connections['zendesk'])
  
  const [isConnected, setIsConnected] = useState(isAlreadyConnected)
  const [isConnecting, setIsConnecting] = useState(false)
  const [activeTab, setActiveTab] = useState<'tickets' | 'articles'>('tickets')
  const [ticketSearchQuery, setTicketSearchQuery] = useState('')
  const [articleSearchQuery, setArticleSearchQuery] = useState('')
  
  const [tickets, setTickets] = useState<ZendeskTicket[]>([
    { id: 't1', subject: 'Product integration question', description: 'Customer asking about API integration capabilities', status: 'solved', priority: 'normal', requester: 'john@acmecorp.com', assignee: 'Sarah Chen', created: '2 days ago', tags: ['integration', 'api', 'technical'], isSelected: true },
    { id: 't2', subject: 'Pricing inquiry for Enterprise plan', description: 'Prospect requesting detailed pricing for 500+ users', status: 'solved', priority: 'high', requester: 'mary@techstartup.com', assignee: 'Mike Rodriguez', created: '1 week ago', tags: ['pricing', 'enterprise', 'sales'], isSelected: true },
    { id: 't3', subject: 'Feature request - Advanced reporting', description: 'Customer requesting enhanced analytics and reporting features', status: 'open', priority: 'normal', requester: 'david@bigcorp.com', assignee: 'Lisa Thompson', created: '3 days ago', tags: ['feature-request', 'analytics'], isSelected: false },
    { id: 't4', subject: 'Onboarding assistance needed', description: 'New customer needs help with initial setup and configuration', status: 'solved', priority: 'normal', requester: 'admin@newclient.com', assignee: 'Emily Johnson', created: '5 days ago', tags: ['onboarding', 'setup'], isSelected: true },
    { id: 't5', subject: 'Security compliance questions', description: 'Enterprise customer asking about SOC2 and GDPR compliance', status: 'solved', priority: 'high', requester: 'security@enterprise.com', assignee: 'James Wilson', created: '1 day ago', tags: ['security', 'compliance', 'enterprise'], isSelected: true },
  ])

  const [articleCategories, setArticleCategories] = useState<ZendeskArticleCategory[]>([
    { id: 'cat1', name: 'Getting Started', description: 'Onboarding guides and initial setup instructions', articleCount: 25, lastModified: '1 week ago', isSelected: true, subcategories: ['Account Setup', 'First Steps', 'Basic Configuration'] },
    { id: 'cat2', name: 'Product Features', description: 'Detailed feature explanations and how-to guides', articleCount: 67, lastModified: '3 days ago', isSelected: true, subcategories: ['Core Features', 'Advanced Features', 'Integrations'] },
    { id: 'cat3', name: 'Troubleshooting', description: 'Common issues and solutions', articleCount: 89, lastModified: '2 days ago', isSelected: false, subcategories: ['Technical Issues', 'Account Problems', 'Performance'] },
    { id: 'cat4', name: 'API Documentation', description: 'Developer resources and API guides', articleCount: 34, lastModified: '1 week ago', isSelected: true, subcategories: ['REST API', 'Webhooks', 'SDKs'] },
    { id: 'cat5', name: 'Best Practices', description: 'Recommended workflows and optimization tips', articleCount: 45, lastModified: '4 days ago', isSelected: false, subcategories: ['Workflow Optimization', 'Team Management', 'Reporting'] },
    { id: 'cat6', name: 'Security & Compliance', description: 'Security features and compliance information', articleCount: 18, lastModified: '1 day ago', isSelected: true, subcategories: ['Data Security', 'Privacy', 'Compliance'] },
  ])

  const handleConnect = async () => {
    setIsConnecting(true)
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsConnected(true)
    setIsConnecting(false)
  }

  const toggleTicket = (ticketId: string) => {
    setTickets(prev => prev.map(ticket => 
      ticket.id === ticketId ? { ...ticket, isSelected: !ticket.isSelected } : ticket
    ))
  }

  const toggleArticleCategory = (categoryId: string) => {
    setArticleCategories(prev => prev.map(category => 
      category.id === categoryId ? { ...category, isSelected: !category.isSelected } : category
    ))
  }

  const save = () => {
    const { configure } = useIntegrationsStore.getState()
    configure('zendesk', { 
      selectedTickets: tickets.filter(t => t.isSelected),
      selectedArticleCategories: articleCategories.filter(c => c.isSelected),
      lastUpdated: new Date().toISOString()
    })
    onClose()
  }

  const filteredTickets = tickets.filter(ticket => 
    ticket.subject.toLowerCase().includes(ticketSearchQuery.toLowerCase()) ||
    ticket.tags.some(tag => tag.toLowerCase().includes(ticketSearchQuery.toLowerCase())) ||
    ticket.requester.toLowerCase().includes(ticketSearchQuery.toLowerCase())
  )

  const filteredCategories = articleCategories.filter(category => 
    category.name.toLowerCase().includes(articleSearchQuery.toLowerCase()) ||
    category.description.toLowerCase().includes(articleSearchQuery.toLowerCase())
  )

  if (!isConnected) {
    return (
      <div className="flex h-full flex-col bg-white rounded-xl overflow-hidden">
        {/* Header */}
        <div className="border-b border-gray-200 px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 shadow-lg">
                <span className="text-sm font-bold text-white">Z</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Connect Zendesk</h1>
                <p className="text-gray-600 mt-0.5 text-sm">Connect your Zendesk account to Docket</p>
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
              <span className="text-3xl">📞</span>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Connect your Zendesk account</h2>
            <p className="text-gray-600 mb-8">
              Give Docket access to your support tickets and knowledge base to power the Sales Knowledge Lake with customer insights and solutions.
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
                  Connect to Zendesk
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    )
  }

  const selectedTickets = tickets.filter(t => t.isSelected)
  const selectedCategories = articleCategories.filter(c => c.isSelected)

  return (
    <div className="flex h-full flex-col bg-white rounded-xl overflow-hidden">
      {/* Header */}
      <div className="border-b border-gray-200 px-6 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 shadow-lg">
              <span className="text-sm font-bold text-white">Z</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Zendesk Configuration</h1>
              <p className="text-gray-600 mt-0.5 text-sm">Select tickets and knowledge base content for ingestion</p>
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

      {/* Tabs */}
      <div className="border-b border-gray-200 px-6">
        <div className="flex gap-8">
          <button
            onClick={() => setActiveTab('tickets')}
            className={`pb-4 pt-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'tickets'
                ? 'text-gray-900 border-gray-900'
                : 'text-gray-500 hover:text-gray-700 border-transparent'
            }`}
          >
            Support Tickets
          </button>
          <button
            onClick={() => setActiveTab('articles')}
            className={`pb-4 pt-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'articles'
                ? 'text-gray-900 border-gray-900'
                : 'text-gray-500 hover:text-gray-700 border-transparent'
            }`}
          >
            Knowledge Base
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {activeTab === 'tickets' ? (
          <div>
            <div className="mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Support Tickets</h3>
              <p className="text-gray-600">Select resolved tickets that contain valuable customer insights and solutions</p>
            </div>

            {/* Search */}
            <div className="relative mb-6">
              <svg className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search tickets by subject, tags, or requester..."
                value={ticketSearchQuery}
                onChange={(e) => setTicketSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white pl-10 pr-4 py-3 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
              />
            </div>

            <div className="mb-4 text-sm text-gray-600">
              {selectedTickets.length} of {tickets.length} tickets marked for ingestion
            </div>

            {/* Tickets List */}
            <div className="space-y-3">
              {filteredTickets.map((ticket) => (
                <TicketCard
                  key={ticket.id}
                  ticket={ticket}
                  onToggle={() => toggleTicket(ticket.id)}
                />
              ))}
            </div>

            {filteredTickets.length === 0 && ticketSearchQuery && (
              <div className="text-center py-12">
                <div className="text-gray-500">No tickets match "{ticketSearchQuery}"</div>
              </div>
            )}
          </div>
        ) : (
          <div>
            <div className="mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Knowledge Base Articles</h3>
              <p className="text-gray-600">Select article categories to ingest into Sales Knowledge Lake</p>
            </div>

            {/* Search */}
            <div className="relative mb-6">
              <svg className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search article categories..."
                value={articleSearchQuery}
                onChange={(e) => setArticleSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white pl-10 pr-4 py-3 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
              />
            </div>

            <div className="mb-4 text-sm text-gray-600">
              {selectedCategories.length} of {articleCategories.length} categories marked for ingestion
            </div>

            {/* Categories List */}
            <div className="space-y-3">
              {filteredCategories.map((category) => (
                <ArticleCategoryCard
                  key={category.id}
                  category={category}
                  onToggle={() => toggleArticleCategory(category.id)}
                />
              ))}
            </div>

            {filteredCategories.length === 0 && articleSearchQuery && (
              <div className="text-center py-12">
                <div className="text-gray-500">No categories match "{articleSearchQuery}"</div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Ingestion Notice */}
      {(selectedTickets.length > 0 || selectedCategories.length > 0) && (
        <div className="border-t border-gray-100 bg-blue-50 px-6 py-4">
          <div className="flex items-start gap-3">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600">
              <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-blue-900">Ready for Ingestion</p>
              <p className="text-xs text-blue-700 mt-1">
                {selectedTickets.length} tickets and {selectedCategories.length} article categories will be ingested into Sales Knowledge Lake.
                Customer insights and support solutions will enhance AI responses.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="border-t border-gray-200 bg-gray-50 px-6 py-6">
        <div className="flex items-center justify-between">
          <button className="inline-flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900 font-medium">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Zendesk integration help
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
              className="rounded-xl bg-gray-900 hover:bg-gray-800 px-5 py-2.5 text-sm font-semibold text-white transition-colors shadow-lg"
            >
              Save & Start Ingestion
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function TicketCard({ 
  ticket, 
  onToggle 
}: { 
  ticket: ZendeskTicket
  onToggle: () => void
}) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'solved': return 'bg-green-100 text-green-800'
      case 'open': return 'bg-blue-100 text-blue-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'closed': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800'
      case 'high': return 'bg-orange-100 text-orange-800'
      case 'normal': return 'bg-blue-100 text-blue-800'
      case 'low': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div 
      className={`group rounded-lg border p-4 transition-all cursor-pointer ${
        ticket.isSelected 
          ? 'border-gray-900 bg-gray-50 shadow-md' 
          : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
      }`}
      onClick={onToggle}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4 flex-1">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
            <svg className="h-5 w-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <h4 className="text-sm font-semibold text-gray-900 truncate">{ticket.subject}</h4>
              <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(ticket.status)}`}>
                {ticket.status}
              </span>
              <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                {ticket.priority}
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">{ticket.description}</p>
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span>From: {ticket.requester}</span>
              <span>Assigned: {ticket.assignee}</span>
              <span>Created: {ticket.created}</span>
            </div>
            <div className="flex gap-1 mt-2">
              {ticket.tags.map(tag => (
                <span key={tag} className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-xs">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
          ticket.isSelected ? 'border-gray-900 bg-gray-900' : 'border-gray-300 group-hover:border-gray-400'
        }`}>
          {ticket.isSelected && (
            <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          )}
        </div>
      </div>
      
      {ticket.isSelected && (
        <div className="mt-3 rounded-lg bg-green-50 border border-green-200 p-3">
          <div className="flex items-center gap-2 text-sm">
            <svg className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-green-800 font-medium">Marked for ingestion</span>
          </div>
        </div>
      )}
    </div>
  )
}

function ArticleCategoryCard({ 
  category, 
  onToggle 
}: { 
  category: ZendeskArticleCategory
  onToggle: () => void
}) {
  return (
    <div 
      className={`group rounded-lg border p-4 transition-all cursor-pointer ${
        category.isSelected 
          ? 'border-gray-900 bg-gray-50 shadow-md' 
          : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
      }`}
      onClick={onToggle}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4 flex-1">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-xl">
            📚
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <h4 className="text-base font-semibold text-gray-900">{category.name}</h4>
              <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800">
                {category.articleCount} articles
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-3">{category.description}</p>
            <div className="flex items-center gap-4 text-xs text-gray-500 mb-2">
              <span>Updated {category.lastModified}</span>
            </div>
            {category.subcategories && (
              <div className="flex flex-wrap gap-1">
                {category.subcategories.map(sub => (
                  <span key={sub} className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-xs">
                    {sub}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
          category.isSelected ? 'border-gray-900 bg-gray-900' : 'border-gray-300 group-hover:border-gray-400'
        }`}>
          {category.isSelected && (
            <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          )}
        </div>
      </div>
      
      {category.isSelected && (
        <div className="mt-3 rounded-lg bg-green-50 border border-green-200 p-3">
          <div className="flex items-center gap-2 text-sm">
            <svg className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-green-800 font-medium">Ready for ingestion</span>
          </div>
        </div>
      )}
    </div>
  )
}
