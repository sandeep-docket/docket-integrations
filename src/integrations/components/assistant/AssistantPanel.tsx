import { useState } from 'react'
import { PaperAirplaneIcon } from '@heroicons/react/24/outline'

const canned = [
  'Which apps should I connect first to power Sales Knowledge Lake?',
  'How does Docket use permissions from Google Drive and SharePoint?',
  'Can I connect multiple CRMs at once?',
]

export function AssistantPanel() {
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([
    { role: 'assistant', content: 'Hi! I can help you decide which integrations to connect and how to configure them securely.' },
  ])
  const [input, setInput] = useState('')

  const send = (text: string) => {
    if (!text.trim()) return
    setMessages((m) => [...m, { role: 'user', content: text }, { role: 'assistant', content: fakeAnswer(text) }])
    setInput('')
  }

  return (
    <div className="flex h-full flex-col">
      <div className="border-b p-4">
        <h2 className="text-sm font-semibold">Ask Docket</h2>
        <p className="mt-1 text-xs text-gray-600">Get guidance on integrations, security, and best practices.</p>
      </div>
      <div className="flex-1 space-y-3 overflow-y-auto p-4 text-sm">
        {messages.map((m, i) => (
          <div key={i} className={m.role === 'assistant' ? 'text-gray-800' : 'text-indigo-700'}>
            {m.content}
          </div>
        ))}
        <div className="mt-2 space-y-2">
          {canned.map((q) => (
            <button key={q} onClick={() => send(q)} className="block w-full rounded-md border bg-white px-3 py-2 text-left text-xs hover:bg-gray-50">
              {q}
            </button>
          ))}
        </div>
      </div>
      <div className="border-t p-3">
        <div className="flex items-center gap-2">
          <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask about integrations…" className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          <button onClick={() => send(input)} className="inline-flex items-center gap-1 rounded-md bg-indigo-600 px-3 py-2 text-xs font-medium text-white">
            <PaperAirplaneIcon className="h-4 w-4" />
            Send
          </button>
        </div>
      </div>
    </div>
  )
}

function fakeAnswer(q: string): string {
  if (q.toLowerCase().includes('permissions')) {
    return 'Docket never broadens access. We mirror your RBAC across sources. When users ask questions, retrieval is scoped to their underlying permissions in Google Drive, SharePoint, etc.'
  }
  if (q.toLowerCase().includes('first')) {
    return 'Start with your CRM (Salesforce/HubSpot) plus one content source (Drive, SharePoint, or Confluence). This enables answers with live account context + relevant collateral.'
  }
  return 'For this workspace, we recommend connecting CRM, Slack/Teams, and a primary content source. You can later add enablement and call intelligence to enrich answers.'
}



