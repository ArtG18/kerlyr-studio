import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { Avatar, Badge, TopBar, EmptyState } from '../../components/UI'

const TAG_VARIANT = { VIP: 'vip', Frecuente: 'frecuente', Regular: 'regular', Nueva: 'nueva' }
const STARS = n => '★'.repeat(n) + '☆'.repeat(5 - n)

const CLIENT_HISTORY = [
  { date: '12 mayo 2026', service: 'Cita agendada', status: 'pending' },
  { date: '28 abril 2026', service: 'Extensión Acrílico + diseño', status: 'confirmed' },
  { date: '7 abril 2026',  service: 'Esmaltado perm. completo + pedi spa', status: 'confirmed' },
  { date: '17 marzo 2026', service: 'Kapping Polygel', status: 'confirmed' },
]

export default function Clients() {
  const { clients } = useApp()
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(null)

  const filtered = clients.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.includes(search)
  )

  if (selected) {
    const c = selected
    return (
      <div className="flex flex-col h-full overflow-hidden">
        <TopBar title={c.name}>
          <button className="btn-outline" onClick={() => setSelected(null)}>
            <i className="ti ti-arrow-left" /> Volver
          </button>
        </TopBar>

        <div className="flex-1 overflow-y-auto p-5">
          <div className="grid grid-cols-2 gap-6">
            {/* Client profile */}
            <div className="space-y-4">
              <div className="card flex items-center gap-4">
                <Avatar initials={c.initials} color={c.color} textColor={c.textColor} size="lg" />
                <div>
                  <p className="text-base font-medium text-gray-900">{c.name}</p>
                  <p className="text-xs text-amber-500 mt-0.5">{STARS(c.rating)}</p>
                  <Badge variant={TAG_VARIANT[c.tag] || 'rose'}>{c.tag}</Badge>
                </div>
              </div>

              <div className="card space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <i className="ti ti-phone text-gray-400" />
                  <span className="text-gray-600">{c.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <i className="ti ti-calendar text-gray-400" />
                  <span className="text-gray-600">Última visita: {c.lastVisit}</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Visitas', value: c.visits },
                  { label: 'Total', value: `$${Math.round(c.total / 1000)}k` },
                  { label: 'Favorito', value: c.favService, small: true },
                ].map(({ label, value, small }) => (
                  <div key={label} className="card text-center">
                    <p className={`font-semibold text-gray-900 ${small ? 'text-xs' : 'text-xl'}`}>{value}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">{label}</p>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <a
                  href={`https://wa.me/${c.phone.replace(/\s+/g, '').replace('+', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-emerald-50 text-emerald-700 text-sm rounded-xl border border-emerald-100 hover:bg-emerald-100 transition-colors"
                >
                  <i className="ti ti-brand-whatsapp" /> WhatsApp
                </a>
              </div>
            </div>

            {/* History */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">Historial de visitas</h3>
              <div className="card divide-y divide-gray-50">
                {CLIENT_HISTORY.map((h, i) => (
                  <div key={i} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${h.status === 'confirmed' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                      <i className={`ti ${h.status === 'confirmed' ? 'ti-check' : 'ti-clock'} text-sm`} />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-medium text-gray-800">{h.date}</p>
                      <p className="text-[10px] text-gray-400">{h.service}</p>
                    </div>
                    <Badge variant={h.status === 'confirmed' ? 'confirmed' : 'pending'}>
                      {h.status === 'confirmed' ? 'Completada' : 'Pendiente'}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <TopBar title="Historial de clientes">
        <span className="text-xs text-gray-400">{clients.length} clientes</span>
      </TopBar>

      <div className="flex-1 overflow-y-auto p-5">
        {/* Search */}
        <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-xl border border-gray-100 mb-4">
          <i className="ti ti-search text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nombre o teléfono..."
            className="flex-1 bg-transparent text-sm text-gray-700 outline-none placeholder-gray-400"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {/* List */}
        {filtered.length === 0 ? (
          <EmptyState message="No se encontraron clientes" />
        ) : (
          <div className="space-y-2">
            {filtered.map(c => (
              <button
                key={c.id}
                onClick={() => setSelected(c)}
                className="w-full card flex items-center gap-3 text-left hover:shadow-md transition-all"
              >
                <Avatar initials={c.initials} color={c.color} textColor={c.textColor} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{c.name}</p>
                  <p className="text-xs text-gray-400">{c.phone} · Última: {c.lastVisit}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-medium text-gray-900">{c.visits} visitas</p>
                  <p className="text-xs text-gray-400">${(c.total / 1000).toFixed(0)}k total</p>
                </div>
                <Badge variant={TAG_VARIANT[c.tag] || 'rose'}>{c.tag}</Badge>
                <i className="ti ti-chevron-right text-gray-300 text-sm" />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}