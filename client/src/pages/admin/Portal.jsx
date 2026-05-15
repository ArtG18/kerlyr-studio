import { useState } from 'react'
import { SERVICES, SALON_INFO } from '../../data/mockData'
import { TopBar } from '../../components/UI'
import { useApp } from '../../context/AppContext'

const PORTAL_SERVICES = SERVICES.slice(0, 6)
const SLOTS = [
  { time: '10:00', busy: true },
  { time: '11:00', busy: false },
  { time: '13:00', busy: false },
  { time: '14:00', busy: false },
  { time: '15:00', busy: true },
  { time: '16:00', busy: false },
]

export default function Portal() {
  const { applyDiscount } = useApp()
  const [selService, setSelService] = useState(PORTAL_SERVICES[0])
  const [selSlot, setSelSlot] = useState('11:00')
  const [booked, setBooked] = useState(false)

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <TopBar title="Portal de autoagendamiento">
        <button
          className="btn-outline"
          onClick={() => navigator.clipboard.writeText(window.location.href)}
        >
          <i className="ti ti-link" /> Copiar link
        </button>
      </TopBar>

      <div className="flex-1 overflow-y-auto p-5">
        <div className="flex gap-8 items-start">

          {/* Phone mockup */}
          <div className="flex-shrink-0">
            <div className="bg-gray-100 rounded-[28px] p-3 w-60 border border-gray-200 shadow-sm">
              <div className="text-center mb-2">
                <div className="w-10 h-1 bg-gray-300 rounded mx-auto" />
              </div>
              <div className="bg-white rounded-[18px] overflow-hidden border border-gray-100">
                {/* Portal top bar */}
                <div className="bg-kr-rose px-4 py-3">
                  <p className="text-white text-sm font-medium font-display italic">KR · Kerlyr Studio</p>
                  <p className="text-white/75 text-[10px]">Agenda tu cita — {SALON_INFO.phone}</p>
                </div>
                <div className="p-3 space-y-3">
                  {/* Service picker */}
                  <div>
                    <p className="text-[10px] font-medium text-gray-400 mb-1.5">Elige tu servicio</p>
                    <div className="space-y-1.5">
                      {PORTAL_SERVICES.slice(0, 3).map(svc => {
                        const disc = applyDiscount(svc.price)
                        return (
                          <button
                            key={svc.id}
                            onClick={() => setSelService(svc)}
                            className={`w-full flex items-center gap-2 p-2 rounded-lg border text-left transition-all ${selService.id === svc.id ? 'border-kr-rose bg-kr-rose-light' : 'border-gray-100 hover:border-gray-200'}`}
                          >
                            <i className="ti ti-sparkles text-kr-rose text-xs" />
                            <div className="flex-1 min-w-0">
                              <p className="text-[11px] font-medium text-gray-800 truncate">{svc.name}</p>
                              <p className="text-[9px] text-gray-400">
                                {disc !== svc.price
                                  ? <><span className="line-through">${svc.price.toLocaleString('es-CL')}</span> <span className="text-emerald-600">${disc.toLocaleString('es-CL')}</span></>
                                  : `$${svc.price.toLocaleString('es-CL')}`
                                }
                              </p>
                            </div>
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* Time slots */}
                  <div>
                    <p className="text-[10px] font-medium text-gray-400 mb-1.5">Horario disponible</p>
                    <div className="grid grid-cols-3 gap-1">
                      {SLOTS.map(s => (
                        <button
                          key={s.time}
                          disabled={s.busy}
                          onClick={() => !s.busy && setSelSlot(s.time)}
                          className={`py-1.5 rounded-md text-[10px] text-center transition-all border
                            ${s.busy ? 'bg-gray-50 text-gray-300 cursor-default border-transparent' : ''}
                            ${!s.busy && selSlot === s.time ? 'bg-kr-rose text-white border-kr-rose' : ''}
                            ${!s.busy && selSlot !== s.time ? 'border-gray-200 text-gray-700 hover:border-kr-rose' : ''}
                          `}
                        >
                          {s.time}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Name/phone */}
                  <div className="space-y-1">
                    <p className="text-[10px] font-medium text-gray-400">Tus datos</p>
                    <input className="w-full text-[10px] px-2 py-1.5 border border-gray-200 rounded-lg outline-none focus:border-kr-rose" placeholder="Tu nombre" />
                    <input className="w-full text-[10px] px-2 py-1.5 border border-gray-200 rounded-lg outline-none focus:border-kr-rose" placeholder="+56 9 ..." />
                  </div>

                  {booked ? (
                    <div className="bg-emerald-50 rounded-lg p-2 text-center">
                      <i className="ti ti-check text-emerald-600 text-lg" />
                      <p className="text-[10px] text-emerald-700 font-medium">¡Cita reservada!</p>
                    </div>
                  ) : (
                    <button
                      onClick={() => setBooked(true)}
                      className="w-full bg-kr-rose text-white text-[11px] font-medium py-2 rounded-lg"
                    >
                      Reservar <i className="ti ti-arrow-right text-xs" />
                    </button>
                  )}
                </div>
              </div>
              <div className="text-center mt-2">
                <div className="w-6 h-6 rounded-full border-2 border-gray-300 mx-auto" />
              </div>
            </div>
          </div>

          {/* How it works */}
          <div className="flex-1 space-y-6">
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">Cómo funciona para tus clientas</h3>
              <div className="space-y-3">
                {[
                  { n: 1, title: 'Comparte el link', desc: 'En tu bio de Instagram o directamente por WhatsApp', color: 'bg-kr-rose-light text-kr-rose-dark' },
                  { n: 2, title: 'Eligen servicio, fecha y hora', desc: 'Solo ven los horarios que tú tienes disponibles', color: 'bg-emerald-50 text-emerald-700' },
                  { n: 3, title: 'Se registra automáticamente', desc: 'Aparece en tu calendario y ambas reciben confirmación por WhatsApp', color: 'bg-blue-50 text-blue-700' },
                  { n: 4, title: 'Sin llamadas, sin idas y vueltas', desc: 'Ellas agendan solas. Tú solo recibes la notificación.', color: 'bg-amber-50 text-amber-700' },
                ].map(({ n, title, desc, color }) => (
                  <div key={n} className="flex items-start gap-3">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0 ${color}`}>{n}</div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">{title}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Hours shown to clients */}
            <div className="card bg-gray-50 border-gray-100">
              <p className="text-xs font-medium text-gray-600 mb-2">Horario visible para clientes</p>
              <p className="text-xs text-gray-500">{SALON_INFO.hours.weekdays}</p>
              <p className="text-xs text-gray-500">{SALON_INFO.hours.saturday}</p>
              <p className="text-xs text-gray-400">{SALON_INFO.hours.sunday}</p>
            </div>

            {/* Instagram link */}
            <a
              href={SALON_INFO.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-pink-500 hover:text-pink-600 transition-colors"
            >
              <i className="ti ti-brand-instagram text-base" />
              {SALON_INFO.instagram}
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}