import { useState, useEffect } from 'react'
import api from '../../services/api'
import { Avatar, Badge, TopBar, EmptyState } from '../../components/UI'

const TAG_VARIANT = {
  VIP:       'vip',
  Frecuente: 'frecuente',
  Regular:   'regular',
  Nueva:     'nueva',
  Blacklist: 'cancelled',
}

const STARS = n => '★'.repeat(Math.min(n,5)) + '☆'.repeat(Math.max(0, 5-n))

export default function Clients() {
  const [clients,  setClients]  = useState([])
  const [loading,  setLoading]  = useState(true)
  const [search,   setSearch]   = useState('')
  const [filter,   setFilter]   = useState('all') // all | VIP | Blacklist | Nueva
  const [selected, setSelected] = useState(null)

  const fetchClients = async () => {
    try {
      setLoading(true)
      const { data } = await api.get('/clients')
      setClients(data)
    } catch {
      // silencioso
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchClients() }, [])

  const toggleBlacklist = async (client) => {
    const isBlacklist = client.tag === 'Blacklist'
    const msg = isBlacklist
      ? `¿Quitar a ${client.name} de la lista negra?`
      : `¿Agregar a ${client.name} a la lista negra?`
    if (!confirm(msg)) return
    try {
      await api.patch(`/clients/${client.id}/blacklist`, { blacklist: !isBlacklist })
      fetchClients()
      if (selected?.id === client.id) setSelected(null)
    } catch { alert('Error al actualizar') }
  }

  const deleteClient = async (id) => {
    if (!confirm('¿Eliminar esta clienta y todas sus citas? Esta acción no se puede deshacer.')) return
    try {
      await api.delete(`/clients/${id}`)
      setClients(prev => prev.filter(c => c.id !== id))
      if (selected?.id === id) setSelected(null)
    } catch { alert('Error al eliminar') }
  }

  const filtered = clients.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
                        c.phone?.includes(search)
    const matchFilter = filter === 'all' || c.tag === filter
    return matchSearch && matchFilter
  })

  const vipCount       = clients.filter(c => c.tag === 'VIP').length
  const blacklistCount = clients.filter(c => c.tag === 'Blacklist').length
  const newCount       = clients.filter(c => c.tag === 'Nueva').length

  // ── DETALLE DE CLIENTA ─────────────────────────────────────────────────
  if (selected) {
    const c = selected
    const initials = c.name.split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase()
    return (
      <div className="flex flex-col h-full overflow-hidden">
        <TopBar title={c.name}>
          <button className="btn-outline" onClick={() => setSelected(null)}>
            <i className="ti ti-arrow-left" /> Volver
          </button>
        </TopBar>
        <div className="flex-1 overflow-y-auto p-4 sm:p-5">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="card flex items-center gap-4">
                <Avatar initials={initials} size="lg" />
                <div className="flex-1">
                  <p className="text-base font-medium text-gray-900">{c.name}</p>
                  <p className="text-xs text-amber-500 mt-0.5">{STARS(Math.min(Math.ceil((c.totalVisits||0)/2), 5))}</p>
                  <Badge variant={TAG_VARIANT[c.tag] || 'rose'}>{c.tag}</Badge>
                </div>
              </div>

              <div className="card space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <i className="ti ti-phone text-gray-400" />
                  <span className="text-gray-600">{c.phone}</span>
                </div>
                {c.lastVisit && (
                  <div className="flex items-center gap-2 text-sm">
                    <i className="ti ti-calendar text-gray-400" />
                    <span className="text-gray-600">
                      Última visita: {new Date(c.lastVisit).toLocaleDateString('es-CL')}
                    </span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="card text-center">
                  <p className="text-xl font-semibold text-gray-900">{c.totalVisits || 0}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">Visitas</p>
                </div>
                <div className="card text-center">
                  <p className="text-xl font-semibold text-gray-900">${Math.round((c.totalSpent||0)/1000)}k</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">Total</p>
                </div>
                <div className="card text-center">
                  <p className="text-xl font-semibold text-red-400">{c.totalCancelled || 0}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">Canceladas</p>
                </div>
              </div>

              <div className="flex gap-2">
                <a href={`https://wa.me/${c.phone?.replace(/\s+/g,'').replace('+','')}`}
                  target="_blank" rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-emerald-50 text-emerald-700 text-sm rounded-xl border border-emerald-100 hover:bg-emerald-100 transition-colors">
                  <i className="ti ti-brand-whatsapp" /> WhatsApp
                </a>
                <button onClick={() => toggleBlacklist(c)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm rounded-xl border transition-colors
                    ${c.tag === 'Blacklist'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-100'
                      : 'bg-red-50 text-red-500 border-red-100 hover:bg-red-100'
                    }`}>
                  <i className={`ti ${c.tag === 'Blacklist' ? 'ti-circle-check' : 'ti-ban'}`} />
                  {c.tag === 'Blacklist' ? 'Quitar lista negra' : 'Lista negra'}
                </button>
              </div>

              <button onClick={() => deleteClient(c.id)}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-red-50 text-red-400 text-sm rounded-xl border border-red-100 hover:bg-red-100 transition-colors">
                <i className="ti ti-trash" /> Eliminar clienta
              </button>
            </div>

            {/* Historial */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">Historial de citas</h3>
              {!c.appointments || c.appointments.length === 0 ? (
                <EmptyState message="Sin historial de citas" />
              ) : (
                <div className="card divide-y divide-gray-50 max-h-96 overflow-y-auto">
                  {c.appointments.map((appt, i) => (
                    <div key={i} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0
                        ${appt.status === 'completed' ? 'bg-emerald-50 text-emerald-600' :
                          appt.status === 'cancelled' ? 'bg-red-50 text-red-400' : 'bg-amber-50 text-amber-600'}`}>
                        <i className={`ti text-sm ${
                          appt.status === 'completed' ? 'ti-check' :
                          appt.status === 'cancelled' ? 'ti-x' : 'ti-clock'}`} />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-medium text-gray-800">
                          {new Date(appt.date).toLocaleDateString('es-CL')} — {appt.timeSlot}
                        </p>
                        <p className="text-[10px] text-gray-400">{appt.service?.name}</p>
                      </div>
                      <Badge variant={appt.status === 'completed' ? 'confirmed' : appt.status === 'cancelled' ? 'cancelled' : 'pending'}>
                        {appt.status === 'completed' ? 'Completada' : appt.status === 'cancelled' ? 'Cancelada' : 'Pendiente'}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ── LISTA DE CLIENTAS ──────────────────────────────────────────────────
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <TopBar title="Historial de clientes">
        <span className="text-xs text-gray-400">{clients.length} clientes</span>
      </TopBar>

      <div className="flex-1 overflow-y-auto p-4 sm:p-5">
        {/* Stats rápidas */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
          <div className="card text-center cursor-pointer hover:border-purple-200" onClick={() => setFilter('VIP')}>
            <p className="text-xl font-semibold text-purple-600">{vipCount}</p>
            <p className="text-[10px] text-gray-400">VIP</p>
          </div>
          <div className="card text-center cursor-pointer hover:border-red-200" onClick={() => setFilter('Blacklist')}>
            <p className="text-xl font-semibold text-red-400">{blacklistCount}</p>
            <p className="text-[10px] text-gray-400">Lista negra</p>
          </div>
          <div className="card text-center cursor-pointer hover:border-blue-200" onClick={() => setFilter('Nueva')}>
            <p className="text-xl font-semibold text-blue-500">{newCount}</p>
            <p className="text-[10px] text-gray-400">Nuevas</p>
          </div>
          <div className="card text-center cursor-pointer hover:border-gray-300" onClick={() => setFilter('all')}>
            <p className="text-xl font-semibold text-gray-700">{clients.length}</p>
            <p className="text-[10px] text-gray-400">Total</p>
          </div>
        </div>

        {/* Filtros y búsqueda */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="flex items-center gap-2 flex-1 px-3 py-2 bg-gray-50 rounded-xl border border-gray-100">
            <i className="ti ti-search text-gray-400" />
            <input type="text" placeholder="Buscar por nombre o teléfono..."
              className="flex-1 bg-transparent text-sm text-gray-700 outline-none placeholder-gray-400"
              value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="flex gap-1 overflow-x-auto -mx-1 px-1 sm:mx-0 sm:px-0 sm:flex-wrap">
            {['all','VIP','Frecuente','Regular','Nueva','Blacklist'].map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className={`flex-shrink-0 text-xs px-3 py-2 rounded-xl border transition-all ${
                  filter === f ? 'bg-kr-rose-light text-kr-rose-dark border-kr-rose font-medium' : 'border-gray-200 text-gray-500 hover:border-gray-300'
                }`}>
                {f === 'all' ? 'Todas' : f}
              </button>
            ))}
          </div>
        </div>

        {/* Lista */}
        {loading ? (
          <div className="text-center py-12 text-gray-400">
            <i className="ti ti-loader-2 animate-spin text-3xl mb-2 block" />
            <p className="text-sm">Cargando clientes...</p>
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState message="No se encontraron clientes" />
        ) : (
          <div className="space-y-2">
            {filtered.map(c => {
              const initials = c.name.split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase()
              return (
                <button key={c.id} onClick={() => setSelected(c)}
                  className={`w-full card flex flex-wrap sm:flex-nowrap items-center gap-3 text-left hover:shadow-md transition-all
                    ${c.tag === 'Blacklist' ? 'border-red-100 bg-red-50/30' : ''}
                    ${c.tag === 'VIP' ? 'border-purple-100' : ''}`}>
                  <Avatar initials={initials} />
                  <div className="flex-1 min-w-[140px]">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-medium text-gray-900">{c.name}</p>
                      {c.tag === 'Blacklist' && <i className="ti ti-ban text-xs text-red-400" />}
                      {c.tag === 'VIP' && <i className="ti ti-crown text-xs text-purple-500" />}
                    </div>
                    <p className="text-xs text-gray-400">{c.phone} · {c.totalVisits || 0} visitas</p>
                    {c.totalCancelled >= 3 && (
                      <p className="text-[10px] text-amber-500 mt-0.5">
                        <i className="ti ti-alert-triangle text-xs" /> {c.totalCancelled} cancelaciones
                      </p>
                    )}
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-medium text-gray-900">${Math.round((c.totalSpent||0)/1000)}k</p>
                    <p className="text-xs text-gray-400">gastado</p>
                  </div>
                  <Badge variant={TAG_VARIANT[c.tag] || 'rose'}>{c.tag}</Badge>
                  <i className="ti ti-chevron-right text-gray-300 text-sm hidden sm:inline" />
                </button>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}