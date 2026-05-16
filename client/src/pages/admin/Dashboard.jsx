import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../services/api'
import { Badge, Avatar, StatCard, TopBar } from '../../components/UI'

const STATUS_MAP = {
  confirmed: { label: 'Confirmada', variant: 'confirmed' },
  pending:   { label: 'Pendiente',  variant: 'pending' },
  cancelled: { label: 'Cancelada',  variant: 'cancelled' },
  completed: { label: 'Completada', variant: 'confirmed' },
}

export default function Dashboard() {
  const navigate = useNavigate()
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [actionId, setActionId] = useState(null)

  const fetchToday = async () => {
    try {
      setLoading(true)
      const { data } = await api.get('/appointments/today')
      setAppointments(data)
    } catch {
      // fallback silencioso
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchToday() }, [])

  const changeStatus = async (id, status) => {
    setActionId(id)
    try {
      const { data } = await api.patch(`/appointments/${id}/status`, { status })
      setAppointments(prev => prev.map(a => a.id === id ? data : a))
    } catch (err) {
      alert(err.response?.data?.error || 'Error al actualizar')
    } finally {
      setActionId(null)
    }
  }

  const deleteAppt = async (id) => {
    if (!confirm('¿Eliminar esta cita del historial?')) return
    setActionId(id)
    try {
      await api.delete(`/appointments/${id}`)
      setAppointments(prev => prev.filter(a => a.id !== id))
    } catch {
      alert('Error al eliminar')
    } finally {
      setActionId(null)
    }
  }

  const confirmed  = appointments.filter(a => a.status === 'confirmed').length
  const pending    = appointments.filter(a => a.status === 'pending').length
  const completed  = appointments.filter(a => a.status === 'completed').length
  const revenue    = appointments
    .filter(a => a.status !== 'cancelled')
    .reduce((sum, a) => sum + (a.service?.price || 0), 0)

  const today = new Date().toLocaleDateString('es-CL', { weekday: 'long', day: 'numeric', month: 'long' })

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <TopBar title={`Resumen — ${today}`}>
        <button className="btn-primary" onClick={() => navigate('/admin/booking')}>
          <i className="ti ti-plus" /> Nueva cita
        </button>
      </TopBar>

      <div className="flex-1 overflow-y-auto p-5 space-y-5">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-3">
          <StatCard label="Citas hoy"    value={appointments.length} sub={loading ? '...' : 'Total del día'} />
          <StatCard label="Confirmadas"  value={confirmed}  sub="Listas"          subColor="text-emerald-600" />
          <StatCard label="Pendientes"   value={pending}    sub="Por confirmar"   subColor="text-amber-600" />
          <StatCard label="Ingresos hoy" value={`$${Math.round(revenue/1000)}k`}  sub="Estimado"  subColor="text-emerald-600" />
        </div>

        {/* Appointments */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">Citas del día</h3>

          {loading ? (
            <div className="text-center py-12 text-gray-400">
              <i className="ti ti-loader-2 animate-spin text-3xl mb-2 block" />
              <p className="text-sm">Cargando citas...</p>
            </div>
          ) : appointments.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <i className="ti ti-calendar-off text-4xl mb-3 block" />
              <p className="text-sm">No hay citas para hoy</p>
              <button onClick={() => navigate('/admin/booking')} className="btn-primary mx-auto mt-4">
                <i className="ti ti-plus" /> Agregar cita
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              {appointments.map(appt => {
                const st = STATUS_MAP[appt.status] || STATUS_MAP.pending
                const initials = appt.client?.name?.split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase() || '?'
                const isLoading = actionId === appt.id

                return (
                  <div key={appt.id} className="card flex items-center gap-3 py-3">
                    <Avatar initials={initials} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-gray-900 truncate">{appt.client?.name}</p>
                        {appt.client?.tag === 'VIP' && (
                          <span className="text-[10px] bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded-full font-medium">VIP</span>
                        )}
                        {appt.client?.tag === 'Blacklist' && (
                          <span className="text-[10px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full font-medium">⚠ Lista negra</span>
                        )}
                      </div>
                      <p className="text-xs text-gray-400 truncate">
                        {appt.service?.name} · {appt.worker?.name?.split(' ')[0]}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0 mr-2">
                      <p className="text-xs text-gray-400 mb-1">{appt.timeSlot}</p>
                      <p className="text-xs font-medium text-gray-600">${appt.service?.price?.toLocaleString('es-CL')}</p>
                    </div>
                    <Badge variant={st.variant}>{st.label}</Badge>

                    {/* Acciones */}
                    <div className="flex items-center gap-1 ml-2">
                      {appt.status === 'pending' && (
                        <button
                          onClick={() => changeStatus(appt.id, 'confirmed')}
                          disabled={isLoading}
                          title="Confirmar"
                          className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 flex items-center justify-center transition-colors"
                        >
                          <i className="ti ti-check text-sm" />
                        </button>
                      )}
                      {appt.status === 'confirmed' && (
                        <button
                          onClick={() => changeStatus(appt.id, 'completed')}
                          disabled={isLoading}
                          title="Marcar completada"
                          className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 flex items-center justify-center transition-colors"
                        >
                          <i className="ti ti-circle-check text-sm" />
                        </button>
                      )}
                      {appt.status !== 'cancelled' && (
                        <button
                          onClick={() => changeStatus(appt.id, 'cancelled')}
                          disabled={isLoading}
                          title="Cancelar"
                          className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-100 flex items-center justify-center transition-colors"
                        >
                          <i className="ti ti-x text-sm" />
                        </button>
                      )}
                      <button
                        onClick={() => deleteAppt(appt.id)}
                        disabled={isLoading}
                        title="Eliminar del historial"
                        className="w-7 h-7 rounded-lg bg-red-50 text-red-400 hover:bg-red-100 flex items-center justify-center transition-colors"
                      >
                        <i className="ti ti-trash text-sm" />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: 'ti-calendar', label: 'Ver calendario', to: '/admin/calendar', color: 'bg-kr-rose-light text-kr-rose-dark' },
            { icon: 'ti-users',    label: 'Ver clientes',   to: '/admin/clients',  color: 'bg-emerald-50 text-emerald-700' },
            { icon: 'ti-tag',      label: 'Descuentos',     to: '/admin/discounts', color: 'bg-amber-50 text-amber-700' },
          ].map(({ icon, label, to, color }) => (
            <button key={to} onClick={() => navigate(to)}
              className={`${color} rounded-xl p-3 flex items-center gap-2 text-sm font-medium hover:opacity-80 transition-opacity`}>
              <i className={`ti ${icon} text-base`} />
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}