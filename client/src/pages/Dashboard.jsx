import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { StatCard, Avatar, Badge, TopBar } from '../components/UI'

const STATUS_MAP = {
  confirmed: { label: 'Confirmada', variant: 'confirmed' },
  pending:   { label: 'Pendiente',  variant: 'pending' },
  cancelled: { label: 'Cancelada',  variant: 'cancelled' },
}

export default function Dashboard() {
  const { appointments, applyDiscount } = useApp()
  const navigate = useNavigate()

  const confirmed = appointments.filter(a => a.status === 'confirmed').length
  const pending   = appointments.filter(a => a.status === 'pending').length
  const revenue   = appointments.reduce((sum, a) => sum + (applyDiscount(a.price) || 0), 0)

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <TopBar title="Resumen del día — martes 12 mayo">
        <button className="btn-primary" onClick={() => navigate('/booking')}>
          <i className="ti ti-plus" /> Nueva cita
        </button>
      </TopBar>

      <div className="flex-1 overflow-y-auto p-5 space-y-5">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-3">
          <StatCard
            label="Citas hoy"
            value={appointments.length}
            sub="↑ +2 vs ayer"
          />
          <StatCard
            label="Confirmadas"
            value={confirmed}
            sub="Listas"
            subColor="text-emerald-600"
          />
          <StatCard
            label="Pendientes"
            value={pending}
            sub="Por confirmar"
            subColor="text-amber-600"
          />
          <StatCard
            label="Ingresos hoy"
            value={`$${Math.round(revenue / 1000)}k`}
            sub="↑ buen día"
            subColor="text-emerald-600"
          />
        </div>

        {/* Appointments list */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">Citas del día</h3>
          <div className="space-y-2">
            {appointments.map(appt => {
              const st = STATUS_MAP[appt.status] || STATUS_MAP.pending
              const discounted = applyDiscount(appt.price)
              return (
                <div key={appt.id} className="card flex items-center gap-3 py-3">
                  <Avatar
                    initials={appt.initials}
                    color={appt.color}
                    textColor={appt.textColor}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{appt.clientName}</p>
                    <p className="text-xs text-gray-400 truncate">{appt.service}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs text-gray-400 mb-1">{appt.time} — {appt.endTime}</p>
                    <div className="flex items-center gap-2 justify-end">
                      {discounted !== appt.price ? (
                        <span className="text-xs">
                          <span className="line-through text-gray-300 mr-1">${appt.price.toLocaleString('es-CL')}</span>
                          <span className="text-emerald-600 font-medium">${discounted.toLocaleString('es-CL')}</span>
                        </span>
                      ) : (
                        <span className="text-xs text-gray-500">${appt.price.toLocaleString('es-CL')}</span>
                      )}
                      <Badge variant={st.variant}>{st.label}</Badge>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: 'ti-calendar', label: 'Ver calendario', to: '/calendar', color: 'bg-kr-rose-light text-kr-rose-dark' },
            { icon: 'ti-users',    label: 'Ver clientes',   to: '/clients',  color: 'bg-emerald-50 text-emerald-700' },
            { icon: 'ti-tag',      label: 'Descuentos',     to: '/discounts', color: 'bg-amber-50 text-amber-700' },
          ].map(({ icon, label, to, color }) => (
            <button
              key={to}
              onClick={() => navigate(to)}
              className={`${color} rounded-xl p-3 flex items-center gap-2 text-sm font-medium hover:opacity-80 transition-opacity`}
            >
              <i className={`ti ${icon} text-base`} />
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}