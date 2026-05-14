import { useState } from 'react'
import { Toggle, TopBar } from '../components/UI'

const DEFAULT_REMINDERS = [
  { id: 1, icon: 'ti-brand-whatsapp', iconColor: 'text-emerald-600', title: 'Confirmación automática al agendar', desc: '"¡Tu cita en Kerlyr Studio está confirmada!"', on: true },
  { id: 2, icon: 'ti-clock', iconColor: 'text-kr-rose', title: 'Recordatorio 24h antes', desc: 'Mensaje automático el día anterior a la cita', on: true },
  { id: 3, icon: 'ti-clock', iconColor: 'text-amber-500', title: 'Recordatorio 2h antes', desc: 'Recordatorio dos horas antes', on: true },
  { id: 4, icon: 'ti-star', iconColor: 'text-yellow-500', title: 'Solicitar reseña post-visita', desc: '2 horas después de la cita — pide calificación en Google', on: false },
  { id: 5, icon: 'ti-gift', iconColor: 'text-pink-500', title: 'Recordatorio de mantenimiento', desc: 'Aviso automático 3 semanas después para reagendar', on: false },
  { id: 6, icon: 'ti-x', iconColor: 'text-red-400', title: 'Aviso por cancelación', desc: 'Notifica al salón cuando una clienta cancela', on: true },
]

export default function Reminders() {
  const [reminders, setReminders] = useState(DEFAULT_REMINDERS)

  const toggle = (id) => {
    setReminders(r => r.map(rem => rem.id === id ? { ...rem, on: !rem.on } : rem))
  }

  const activeCount = reminders.filter(r => r.on).length

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <TopBar title="Recordatorios automáticos">
        <span className="text-xs text-gray-400">{activeCount} de {reminders.length} activos</span>
      </TopBar>

      <div className="flex-1 overflow-y-auto p-5 space-y-3">
        {reminders.map(rem => (
          <div key={rem.id} className="card flex items-center gap-4">
            <div className={`w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center flex-shrink-0 ${rem.iconColor}`}>
              <i className={`ti ${rem.icon} text-lg`} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-800">{rem.title}</p>
              <p className="text-xs text-gray-400 mt-0.5">{rem.desc}</p>
            </div>
            <Toggle value={rem.on} onChange={() => toggle(rem.id)} />
          </div>
        ))}

        <div className="mt-2 p-3.5 bg-gray-50 rounded-xl border border-gray-100 flex items-start gap-2.5">
          <i className="ti ti-info-circle text-gray-400 text-base flex-shrink-0 mt-0.5" />
          <p className="text-xs text-gray-500">
            Los mensajes se envían automáticamente por WhatsApp Business al número registrado del cliente.
            Para activar la integración real, configura tu token en la sección de WhatsApp.
          </p>
        </div>
      </div>
    </div>
  )
}