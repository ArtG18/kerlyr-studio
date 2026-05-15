import { Outlet } from 'react-router-dom'
import { SALON_INFO } from '../../data/mockData'

export default function PortalLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-display italic text-2xl text-kr-rose">KR</span>
            <div>
              <p className="text-sm font-medium text-gray-800">{SALON_INFO.name}</p>
              <p className="text-[10px] text-gray-400 tracking-widest uppercase">{SALON_INFO.tagline}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <a
              href={SALON_INFO.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-pink-400 hover:text-pink-500 transition-colors"
            >
              <i className="ti ti-brand-instagram text-xl" />
            </a>
            <a
              href={`https://wa.me/${SALON_INFO.phone.replace(/\s+/g,'').replace('+','')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-500 hover:text-emerald-600 transition-colors"
            >
              <i className="ti ti-brand-whatsapp text-xl" />
            </a>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-2xl mx-auto px-4 py-6">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 bg-white mt-8">
        <div className="max-w-2xl mx-auto px-4 py-4 text-center text-xs text-gray-400 space-y-1">
          <p>{SALON_INFO.hours.weekdays} · {SALON_INFO.hours.saturday}</p>
          <p>{SALON_INFO.instagram} · {SALON_INFO.phone}</p>
        </div>
      </footer>
    </div>
  )
}