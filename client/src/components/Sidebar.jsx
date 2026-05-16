import { NavLink } from 'react-router-dom'
import { SALON_INFO } from '../data/mockData'

const NAV = [
  {
    section: 'Salón',
    items: [
      { to: '/admin',           icon: 'ti-layout-dashboard', label: 'Resumen' },
      { to: '/admin/calendar',  icon: 'ti-calendar',         label: 'Calendario' },
      { to: '/admin/services',  icon: 'ti-list',             label: 'Servicios' },
      { to: '/admin/discounts', icon: 'ti-tag',              label: 'Descuentos' },
    ]
  },
  {
    section: 'Clientes',
    items: [
      { to: '/admin/clients',   icon: 'ti-users',          label: 'Historial' },
      { to: '/admin/portal',    icon: 'ti-device-mobile',  label: 'Portal cliente' },
    ]
  },
  {
    section: 'Automatización',
    items: [
      { to: '/admin/reminders', icon: 'ti-bell',           label: 'Recordatorios' },
      { to: '/admin/whatsapp',  icon: 'ti-brand-whatsapp', label: 'WhatsApp', badgeGreen: true },
    ]
  },
]

export default function Sidebar() {
  return (
    <aside className="w-56 bg-gray-50 border-r border-gray-100 flex flex-col flex-shrink-0 overflow-y-auto">
      <div className="px-4 py-5 border-b border-gray-100 text-center">
        <img
          src="/gallery/Logo.jpg"
          alt="Kerlyr Studio"
          className="w-20 h-20 rounded-full object-cover mx-auto mb-2"
        />
        <div className="text-sm font-medium text-gray-800">{SALON_INFO.name}</div>
        <div className="text-[10px] text-gray-400 tracking-widest uppercase mt-0.5">
          {SALON_INFO.tagline}
        </div>
        <div className="text-[10px] text-gray-400 mt-1.5 flex items-center justify-center gap-1">
          <i className="ti ti-clock text-xs" />
          Lun–Vie 10–19 · Sáb 10–14
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-4">
        {NAV.map(({ section, items }) => (
          <div key={section}>
            <p className="text-[9px] font-semibold text-gray-400 uppercase tracking-widest px-2 mb-1">
              {section}
            </p>
            <div className="space-y-0.5">
              {items.map(({ to, icon, label, badge, badgeGreen }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={to === '/admin'}
                  className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                >
                  <i className={`ti ${icon} text-base flex-shrink-0`} />
                  <span className="flex-1 text-sm">{label}</span>
                  {badge && (
                    <span className="text-[10px] bg-kr-rose text-white px-1.5 py-0.5 rounded-full">
                      {badge}
                    </span>
                  )}
                  {badgeGreen && (
                    <span className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" />
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div className="p-3 border-t border-gray-100">
        <a
          href={SALON_INFO.instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-[11px] text-gray-400 hover:text-pink-500 transition-colors px-2 py-1"
        >
          <i className="ti ti-brand-instagram text-sm" />
          {SALON_INFO.instagram}
        </a>
      </div>
    </aside>
  )
}