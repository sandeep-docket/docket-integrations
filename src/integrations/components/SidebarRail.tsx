import { BellIcon, Cog6ToothIcon, EnvelopeIcon, FolderIcon, HomeIcon } from '@heroicons/react/24/outline'

export function SidebarRail() {
  return (
    <aside className="box-content flex h-screen w-14 flex-col items-center justify-between border-r border-black/10 bg-white rounded-l-[10px]">
      <div className="mt-2 flex w-full flex-col items-center">
        <button className="flex h-14 w-14 items-center justify-center rounded-full">
          <div className="h-7 w-6 rounded-sm bg-black" />
        </button>
        <nav className="mt-2 flex w-full flex-col items-center gap-0">
          <IconBtn icon={<HomeIcon className="h-5 w-5" />} />
          <IconBtn icon={<svg viewBox="0 0 24 24" className="h-5 w-5"><path d="M3 20c4 0 6-6 9-6s5 6 9 6" stroke="currentColor" strokeWidth="1.5" fill="none"/></svg>} />
          <IconBtn icon={<EnvelopeIcon className="h-5 w-5" />} />
          <IconBtn icon={<FolderIcon className="h-5 w-5" />} />
          <IconBtn icon={<Cog6ToothIcon className="h-5 w-5" />} activeBg />
        </nav>
      </div>
      <div className="mb-2 flex w-full flex-col items-center gap-4">
        <div className="relative">
          <IconBtn icon={<BellIcon className="h-5 w-5" />} />
          <span className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-red-500" />
        </div>
        <div className="mb-2 h-8 w-8 rounded-full border border-[#EBEDF0] bg-[url('')] bg-cover bg-center" />
      </div>
    </aside>
  )
}

function IconBtn({ icon, activeBg = false }: { icon: React.ReactNode; activeBg?: boolean }) {
  return (
    <button className={`flex h-14 w-14 items-center justify-center rounded-full ${activeBg ? 'bg-[#E1E5EA]' : ''}`}>
      <div className="relative flex h-8 w-8 items-center justify-center rounded-full">
        {icon}
      </div>
    </button>
  )
}


