import { useState } from 'react'
import { useIntegrationsStore } from '../store'

type Document360Article = {
  id: string
  title: string
  category: string
  subcategory?: string
  views: number
  lastModified: string
  isPublished: boolean
  isSelected: boolean
  tags: string[]
}

type Document360Category = {
  id: string
  name: string
  description: string
  articleCount: number
  subcategories: string[]
  isSelected: boolean
}

export function Document360ConfigPanel({ onClose }: { onClose: () => void }) {
  const { connections } = useIntegrationsStore()
  const isAlreadyConnected = Boolean(connections['document360'])
  
  const [isConnected, setIsConnected] = useState(isAlreadyConnected)
  const [isConnecting, setIsConnecting] = useState(false)
  const [activeTab, setActiveTab] = useState<'categories' | 'articles'>('categories')
  const [searchQuery, setSearchQuery] = useState('')
  
  const [categories, setCategories] = useState<Document360Category[]>([
    { id: 'cat1', name: 'Getting Started', description: 'Onboarding and initial setup guides', articleCount: 25, subcategories: ['Account Setup', 'First Steps'], isSelected: true },
    { id: 'cat2', name: 'Product Features', description: 'Feature documentation and how-to guides', articleCount: 67, subcategories: ['Core Features', 'Advanced Features'], isSelected: true },
    { id: 'cat3', name: 'API Documentation', description: 'Developer resources and API guides', articleCount: 34, subcategories: ['REST API', 'SDKs'], isSelected: false },
    { id: 'cat4', name: 'Troubleshooting', description: 'Common issues and solutions', articleCount: 89, subcategories: ['Technical Issues', 'Account Problems'], isSelected: true },
    { id: 'cat5', name: 'Best Practices', description: 'Recommended workflows and tips', articleCount: 45, subcategories: ['Optimization', 'Security'], isSelected: false },
  ])

  const [articles, setArticles] = useState<Document360Article[]>([
    { id: 'a1', title: 'Quick Start Guide', category: 'Getting Started', views: 1250, lastModified: '1 week ago', isPublished: true, isSelected: true, tags: ['onboarding', 'setup'] },
    { id: 'a2', title: 'API Authentication', category: 'API Documentation', views: 890, lastModified: '3 days ago', isPublished: true, isSelected: true, tags: ['api', 'auth'] },
    { id: 'a3', title: 'Common Error Codes', category: 'Troubleshooting', views: 2100, lastModified: '2 days ago', isPublished: true, isSelected: false, tags: ['errors', 'debugging'] },
    { id: 'a4', title: 'Advanced Configuration', category: 'Product Features', views: 567, lastModified: '1 day ago', isPublished: true, isSelected: true, tags: ['advanced', 'config'] },
  ])

  const handleConnect = async () => {
    setIsConnecting(true)
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsConnected(true)
    setIsConnecting(false)
  }

  const toggleCategory = (categoryId: string) => {
    setCategories(prev => prev.map(category => 
      category.id === categoryId ? { ...category, isSelected: !category.isSelected } : category
    ))
  }

  const toggleArticle = (articleId: string) => {
    setArticles(prev => prev.map(article => 
      article.id === articleId ? { ...article, isSelected: !article.isSelected } : article
    ))
  }

  const save = () => {
    const { configure } = useIntegrationsStore.getState()
    configure('document360', { 
      selectedCategories: categories.filter(c => c.isSelected),
      selectedArticles: articles.filter(a => a.isSelected),
      lastUpdated: new Date().toISOString()
    })
    onClose()
  }

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredArticles = articles.filter(article =>
    article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  if (!isConnected) {
    return (
      <div className="flex h-full flex-col bg-white rounded-xl overflow-hidden">
        <div className="border-b border-gray-200 px-6 py-6">
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-gray-800 to-gray-900">
              <span className="text-sm font-bold text-white">D360</span>
            </div>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-gray-900">Connect Document360</h1>
              <p className="text-gray-600 mt-0.5 text-sm">Connect your knowledge base</p>
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
              <span className="text-3xl">📚</span>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Connect Document360</h2>
            <p className="text-gray-600 mb-8">
              Access your knowledge base articles to enhance Sales Knowledge Lake with documentation and guides.
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
                'Connect to Document360'
              )}
            </button>
          </div>
        </div>
      </div>
    )
  }

  const selectedCategories = categories.filter(c => c.isSelected)
  const selectedArticles = articles.filter(a => a.isSelected)

  return (
    <div className="flex h-full flex-col bg-white rounded-xl overflow-hidden">
      <div className="border-b border-gray-200 px-6 py-6">
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-gray-800 to-gray-900">
            <span className="text-sm font-bold text-white">D360</span>
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-gray-900">Document360 Configuration</h1>
            <p className="text-gray-600 mt-0.5 text-sm">Select content for knowledge ingestion</p>
          </div>
          <button onClick={onClose} className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Tabs */}
        <div className="border-b border-gray-200 px-6">
          <div className="flex space-x-8">
            {[
              { id: 'categories', label: 'Categories', count: selectedCategories.length },
              { id: 'articles', label: 'Articles', count: selectedArticles.length }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`border-b-2 py-4 px-1 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'border-gray-900 text-gray-900'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label} {tab.count > 0 && `(${tab.count})`}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6">
          {/* Search */}
          <div className="relative mb-4">
            <svg className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder={`Search ${activeTab}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white pl-10 pr-4 py-2.5 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
            />
          </div>

          {/* Status */}
          <div className="mb-4 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              {activeTab === 'categories' 
                ? `${selectedCategories.length} of ${categories.length} categories selected`
                : `${selectedArticles.length} of ${articles.length} articles selected`
              }
            </div>
            {(selectedCategories.length > 0 || selectedArticles.length > 0) && (
              <div className="text-xs text-green-700 bg-green-50 px-2 py-1 rounded-full">
                ✓ Ready for ingestion
              </div>
            )}
          </div>

          {activeTab === 'categories' ? (
            /* Categories Table */
            <div>
              {/* Table Header */}
              <div className="mb-3 grid grid-cols-12 gap-4 px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wide">
                <div className="col-span-5">Category</div>
                <div className="col-span-3">Subcategories</div>
                <div className="col-span-2">Articles</div>
                <div className="col-span-1">Select</div>
              </div>

              {/* Categories List */}
              <div className="space-y-1">
                {filteredCategories.map((category) => (
                  <div 
                    key={category.id}
                    className={`grid grid-cols-12 gap-4 items-center p-3 rounded-lg border transition-all cursor-pointer ${
                      category.isSelected ? 'border-gray-900 bg-gray-50' : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                    onClick={() => toggleCategory(category.id)}
                  >
                    <div className="col-span-5 flex items-center gap-2">
                      <span className="text-sm">📚</span>
                      <div className="min-w-0">
                        <div className="text-sm font-medium text-gray-900 truncate">{category.name}</div>
                        <div className="text-xs text-gray-500 truncate">{category.description}</div>
                      </div>
                    </div>
                    <div className="col-span-3">
                      <div className="text-xs text-gray-600">
                        {category.subcategories.slice(0, 2).join(', ')}
                        {category.subcategories.length > 2 && ` +${category.subcategories.length - 2}`}
                      </div>
                    </div>
                    <div className="col-span-2">
                      <span className="text-sm text-gray-600">{category.articleCount}</span>
                    </div>
                    <div className="col-span-1 flex justify-center">
                      <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                        category.isSelected ? 'border-gray-900 bg-gray-900' : 'border-gray-300'
                      }`}>
                        {category.isSelected && (
                          <svg className="h-2.5 w-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {filteredCategories.length === 0 && searchQuery && (
                <div className="text-center py-12">
                  <div className="text-gray-500">No categories match "{searchQuery}"</div>
                </div>
              )}
            </div>
          ) : (
            /* Articles Table */
            <div>
              {/* Table Header */}
              <div className="mb-3 grid grid-cols-12 gap-4 px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wide">
                <div className="col-span-5">Article</div>
                <div className="col-span-3">Category</div>
                <div className="col-span-2">Views</div>
                <div className="col-span-1">Updated</div>
                <div className="col-span-1">Select</div>
              </div>

              {/* Articles List */}
              <div className="space-y-1">
                {filteredArticles.map((article) => (
                  <div 
                    key={article.id}
                    className={`grid grid-cols-12 gap-4 items-center p-3 rounded-lg border transition-all cursor-pointer ${
                      article.isSelected ? 'border-gray-900 bg-gray-50' : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                    onClick={() => toggleArticle(article.id)}
                  >
                    <div className="col-span-5 flex items-center gap-2">
                      <span className="text-sm">📄</span>
                      <span className="text-sm font-medium text-gray-900 truncate">{article.title}</span>
                    </div>
                    <div className="col-span-3">
                      <span className="text-sm text-gray-600 truncate">{article.category}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-sm text-gray-600">{article.views}</span>
                    </div>
                    <div className="col-span-1">
                      <span className="text-xs text-gray-500">{article.lastModified}</span>
                    </div>
                    <div className="col-span-1 flex justify-center">
                      <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                        article.isSelected ? 'border-gray-900 bg-gray-900' : 'border-gray-300'
                      }`}>
                        {article.isSelected && (
                          <svg className="h-2.5 w-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {filteredArticles.length === 0 && searchQuery && (
                <div className="text-center py-12">
                  <div className="text-gray-500">No articles match "{searchQuery}"</div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-gray-200 bg-gray-50 px-6 py-6">
        <div className="flex items-center justify-between">
          <button className="inline-flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900 font-medium">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Document360 integration help
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
