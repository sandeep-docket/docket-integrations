import { useState } from 'react'
import { useIntegrationsStore } from '../store'

type IntercomConversation = {
  id: string
  subject: string
  customerEmail: string
  status: 'open' | 'closed' | 'snoozed'
  priority: 'low' | 'normal' | 'high'
  assignee: string
  created: string
  tags: string[]
  messageCount: number
  isSelected: boolean
}

type IntercomArticle = {
  id: string
  title: string
  category: string
  views: number
  lastModified: string
  isPublished: boolean
  isSelected: boolean
}

export function IntercomConfigPanel({ onClose }: { onClose: () => void }) {
  const { connections } = useIntegrationsStore()
  const isAlreadyConnected = Boolean(connections['intercom'])
  
  const [isConnected, setIsConnected] = useState(isAlreadyConnected)
  const [isConnecting, setIsConnecting] = useState(false)
  const [activeTab, setActiveTab] = useState<'conversations' | 'articles'>('conversations')
  const [searchQuery, setSearchQuery] = useState('')
  
  const [conversations, setConversations] = useState<IntercomConversation[]>([
    { id: 'c1', subject: 'Integration setup help', customerEmail: 'john@acme.com', status: 'closed', priority: 'normal', assignee: 'Sarah Chen', created: '2 days ago', tags: ['integration', 'setup'], messageCount: 8, isSelected: true },
    { id: 'c2', subject: 'Pricing questions for team plan', customerEmail: 'mary@startup.com', status: 'closed', priority: 'high', assignee: 'Mike Rodriguez', created: '1 week ago', tags: ['pricing', 'sales'], messageCount: 12, isSelected: true },
    { id: 'c3', subject: 'Feature request - Analytics dashboard', customerEmail: 'david@corp.com', status: 'open', priority: 'normal', assignee: 'Lisa Thompson', created: '3 days ago', tags: ['feature-request'], messageCount: 5, isSelected: false },
    { id: 'c4', subject: 'Onboarding assistance', customerEmail: 'admin@client.com', status: 'closed', priority: 'normal', assignee: 'Emily Johnson', created: '5 days ago', tags: ['onboarding'], messageCount: 15, isSelected: true },
  ])

  const [articles, setArticles] = useState<IntercomArticle[]>([
    { id: 'a1', title: 'Getting Started Guide', category: 'Onboarding', views: 1250, lastModified: '1 week ago', isPublished: true, isSelected: true },
    { id: 'a2', title: 'API Integration Tutorial', category: 'Developer Resources', views: 890, lastModified: '3 days ago', isPublished: true, isSelected: true },
    { id: 'a3', title: 'Troubleshooting Common Issues', category: 'Support', views: 2100, lastModified: '2 days ago', isPublished: true, isSelected: false },
    { id: 'a4', title: 'Advanced Features Overview', category: 'Product Features', views: 567, lastModified: '1 day ago', isPublished: true, isSelected: true },
  ])

  const handleConnect = async () => {
    setIsConnecting(true)
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsConnected(true)
    setIsConnecting(false)
  }

  const toggleConversation = (id: string) => {
    setConversations(prev => prev.map(conv => 
      conv.id === id ? { ...conv, isSelected: !conv.isSelected } : conv
    ))
  }

  const toggleArticle = (id: string) => {
    setArticles(prev => prev.map(article => 
      article.id === id ? { ...article, isSelected: !article.isSelected } : article
    ))
  }

  const save = () => {
    const { configure } = useIntegrationsStore.getState()
    configure('intercom', { 
      selectedConversations: conversations.filter(c => c.isSelected),
      selectedArticles: articles.filter(a => a.isSelected),
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
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-gray-800 to-gray-900">
                <span className="text-sm font-bold text-white">I</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Connect Intercom</h1>
                <p className="text-gray-600 mt-0.5 text-sm">Connect your Intercom account to Docket</p>
              </div>
            </div>
            <button onClick={onClose} className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Connection Content */}
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center max-w-sm">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 mx-auto mb-6">
              <span className="text-3xl">💬</span>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Connect your Intercom account</h2>
            <p className="text-gray-600 mb-8">
              Give Docket access to customer conversations and support articles to enhance Sales Knowledge Lake with customer insights.
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
                <>
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.102m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                  Connect to Intercom
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    )
  }

  const selectedConversations = conversations.filter(c => c.isSelected)
  const selectedArticles = articles.filter(a => a.isSelected)

  return (
    <div className="flex h-full flex-col bg-white rounded-xl overflow-hidden">
      {/* Header */}
      <div className="border-b border-gray-200 px-6 py-6">
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-gray-800 to-gray-900">
            <span className="text-sm font-bold text-white">I</span>
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-gray-900">Intercom Configuration</h1>
            <p className="text-gray-600 mt-0.5 text-sm">Select conversations and articles for Knowledge Lake</p>
          </div>
          <button onClick={onClose} className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors">
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
            onClick={() => setActiveTab('conversations')}
            className={`pb-4 pt-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'conversations'
                ? 'text-gray-900 border-gray-900'
                : 'text-gray-500 hover:text-gray-700 border-transparent'
            }`}
          >
            Customer Conversations
          </button>
          <button
            onClick={() => setActiveTab('articles')}
            className={`pb-4 pt-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'articles'
                ? 'text-gray-900 border-gray-900'
                : 'text-gray-500 hover:text-gray-700 border-transparent'
            }`}
          >
            Help Articles
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {activeTab === 'conversations' ? (
          <div>
            <div className="mb-4">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Customer Conversations</h3>
              <p className="text-gray-600">Select valuable customer conversations to enhance AI responses</p>
            </div>

            {/* Search */}
            <div className="relative mb-4">
              <svg className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white pl-10 pr-4 py-2.5 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
              />
            </div>

            <div className="mb-4 text-sm text-gray-600">
              {selectedConversations.length} conversations selected for ingestion
            </div>

            <div className="space-y-3">
              {conversations.filter(c => 
                c.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                c.customerEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
                c.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
              ).map((conversation) => (
                <ConversationCard
                  key={conversation.id}
                  conversation={conversation}
                  onToggle={() => toggleConversation(conversation.id)}
                />
              ))}
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-4">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Help Articles</h3>
              <p className="text-gray-600">Select help articles to include in Sales Knowledge Lake</p>
            </div>

            <div className="mb-4 text-sm text-gray-600">
              {selectedArticles.length} articles selected for ingestion
            </div>

            <div className="space-y-3">
              {articles.filter(a => 
                a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                a.category.toLowerCase().includes(searchQuery.toLowerCase())
              ).map((article) => (
                <ArticleCard
                  key={article.id}
                  article={article}
                  onToggle={() => toggleArticle(article.id)}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 bg-gray-50 px-6 py-6">
        <div className="flex items-center justify-between">
          <button className="inline-flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900 font-medium">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Intercom integration help
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

function ConversationCard({ conversation, onToggle }: { conversation: IntercomConversation; onToggle: () => void }) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'closed': return 'bg-green-100 text-green-800'
      case 'open': return 'bg-blue-100 text-blue-800'
      case 'snoozed': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div 
      className={`rounded-lg border p-4 transition-all cursor-pointer ${
        conversation.isSelected ? 'border-gray-900 bg-gray-50' : 'border-gray-200 bg-white hover:border-gray-300'
      }`}
      onClick={onToggle}
    >
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
          <span className="text-lg">💬</span>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h4 className="text-sm font-semibold text-gray-900">{conversation.subject}</h4>
            <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(conversation.status)}`}>
              {conversation.status}
            </span>
          </div>
          <div className="text-xs text-gray-600 space-y-1">
            <div>Customer: {conversation.customerEmail}</div>
            <div>Assigned to: {conversation.assignee} • {conversation.messageCount} messages • {conversation.created}</div>
          </div>
          <div className="flex gap-1 mt-2">
            {conversation.tags.map(tag => (
              <span key={tag} className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-xs">{tag}</span>
            ))}
          </div>
        </div>
        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
          conversation.isSelected ? 'border-gray-900 bg-gray-900' : 'border-gray-300'
        }`}>
          {conversation.isSelected && (
            <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          )}
        </div>
      </div>
    </div>
  )
}

function ArticleCard({ article, onToggle }: { article: IntercomArticle; onToggle: () => void }) {
  return (
    <div 
      className={`rounded-lg border p-4 transition-all cursor-pointer ${
        article.isSelected ? 'border-gray-900 bg-gray-50' : 'border-gray-200 bg-white hover:border-gray-300'
      }`}
      onClick={onToggle}
    >
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
          <span className="text-lg">📄</span>
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-semibold text-gray-900 mb-1">{article.title}</h4>
          <div className="text-xs text-gray-600">
            {article.category} • {article.views} views • Updated {article.lastModified}
          </div>
        </div>
        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
          article.isSelected ? 'border-gray-900 bg-gray-900' : 'border-gray-300'
        }`}>
          {article.isSelected && (
            <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          )}
        </div>
      </div>
    </div>
  )
}
