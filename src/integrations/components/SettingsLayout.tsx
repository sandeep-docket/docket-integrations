import type { ReactNode, ComponentType } from 'react'
import { Cog6ToothIcon, LinkIcon, ShieldCheckIcon, CreditCardIcon, UserGroupIcon } from '@heroicons/react/24/outline'

type NavItem = { name: string; icon: ComponentType<React.SVGProps<SVGSVGElement>>; current?: boolean }

const NAV: NavItem[] = [
  { name: 'Workspace', icon: Cog6ToothIcon },
  { name: 'Integrations', icon: LinkIcon, current: true },
  { name: 'Security', icon: ShieldCheckIcon },
  { name: 'Billing', icon: CreditCardIcon },
  { name: 'Members', icon: UserGroupIcon },
]

export function SettingsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="grid grid-cols-12 gap-6">
          <aside className="col-span-12 lg:col-span-3">
            <div className="rounded-lg border bg-white p-2">
              <h2 className="px-2 py-3 text-sm font-semibold">Settings</h2>
              <nav className="space-y-1">
                {NAV.map((item) => (
                  <a
                    key={item.name}
                    className={`flex items-center gap-2 rounded-md px-2 py-2 text-sm ${item.current ? 'bg-indigo-50 text-indigo-700' : 'hover:bg-gray-50'}`}
                    href="#"
                  >
                    <item.icon className="h-5 w-5" />
                    {item.name}
                  </a>
                ))}
              </nav>
            </div>
          </aside>
          <section className="col-span-12 lg:col-span-9">
            <div className="rounded-lg border bg-white">
              {children}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}


