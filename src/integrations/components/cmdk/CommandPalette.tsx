import { Fragment, useEffect, useMemo, useState } from 'react'
import { CommandLineIcon } from '@heroicons/react/24/outline'
import { Dialog, Transition } from '@headlessui/react'
import { useIntegrationsStore } from '../../store'

export function CommandPalette() {
  const [open, setOpen] = useState(false)
  const providers = useIntegrationsStore((s) => s.providers)
  const connect = useIntegrationsStore((s) => s.connect)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setOpen((v) => !v)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const [q, setQ] = useState('')
  const results = useMemo(() => {
    const qq = q.toLowerCase().trim()
    return providers.filter((p) => p.name.toLowerCase().includes(qq) || p.category.toLowerCase().includes(qq)).slice(0, 8)
  }, [providers, q])

  return (
    <Transition show={open} as={Fragment}>
      <Dialog onClose={setOpen} className="relative z-50">
        <div className="fixed inset-0 bg-black/20" />
        <div className="fixed inset-0 flex items-start justify-center pt-24 px-4">
          <Dialog.Panel className="w-full max-w-xl overflow-hidden rounded-lg border bg-white shadow-2xl">
            <div className="flex items-center gap-2 border-b px-3 py-2">
              <CommandLineIcon className="h-5 w-5 text-gray-500" />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search actions or apps…" className="w-full border-0 p-2 text-sm focus:outline-none" />
              <kbd className="rounded bg-gray-100 px-1.5 py-1 text-[10px] text-gray-600">⌘K</kbd>
            </div>
            <ul className="max-h-80 overflow-y-auto divide-y">
              {results.map((p) => (
                <li key={p.id} className="cursor-pointer px-4 py-3 text-sm hover:bg-indigo-50" onClick={() => { connect(p.id, 'demo@company.com'); setOpen(false) }}>
                  Connect to {p.name} — {p.category}
                </li>
              ))}
              {results.length === 0 && (
                <li className="px-4 py-6 text-center text-sm text-gray-500">No results</li>
              )}
            </ul>
          </Dialog.Panel>
        </div>
      </Dialog>
    </Transition>
  )
}



