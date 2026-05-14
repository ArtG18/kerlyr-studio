import { SALON_INFO } from '../data/mockData'
import { TopBar } from '../components/UI'

function WaBubble({ title, children }) {
  return (
    <div className="mb-4">
      <p className="text-xs font-medium text-gray-500 mb-2">{title}</p>
      <div className="bg-emerald-50 rounded-2xl p-3.5 border border-emerald-100">
        <div className="flex items-center gap-2 mb-2.5">
          <i className="ti ti-brand-whatsapp text-emerald-600 text-base" />
          <span className="text-xs font-semibold text-emerald-800">Kerlyr Studio</span>
        </div>
        <div className="bg-white rounded-xl rounded-tl-sm px-3.5 py-2.5 text-xs text-gray-800 leading-relaxed max-w-[90%] shadow-sm">
          {children}
        </div>
        <p className="text-[10px] text-gray-400 text-right mt-1.5">✓✓</p>
      </div>
    </div>
  )
}

export default function WhatsApp() {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <TopBar title="WhatsApp Business">
        <span className="flex items-center gap-1.5 text-xs bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-full border border-emerald-100 font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Conectado · {SALON_INFO.phone}
        </span>
      </TopBar>

      <div className="flex-1 overflow-y-auto p-5">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <WaBubble title="Confirmación de cita">
              ¡Hola Catalina! 💅 Tu cita en <strong>Kerlyr Studio</strong> está confirmada.<br /><br />
              📅 Martes 12 de mayo<br />
              ⏰ 10:00 hrs<br />
              ✨ Extensión Acrílico<br /><br />
              Lun–Vie 10–19 · Sáb 10–14<br />
              ¡Te esperamos! 🌸
            </WaBubble>

            <WaBubble title="Recordatorio 24h antes">
              ¡Hola Catalina! 👋 Mañana tienes cita en <strong>Kerlyr Studio</strong> a las <strong>10:00 hrs</strong>.<br /><br />
              ¿Necesitas reagendar? Escríbenos con anticipación 💜<br />
              {SALON_INFO.phone}
            </WaBubble>
          </div>

          <div>
            <WaBubble title="Recordatorio de mantenimiento (3 semanas)">
              ¡Hola Catalina! 💅 Ya pasaron 3 semanas desde tu última visita — es hora de renovar ese look.<br /><br />
              ¿Agendamos? 👉 {SALON_INFO.phone}<br />
              Lun–Vie 10–19 · Sáb 10–14 🌸<br /><br />
              <a href={SALON_INFO.instagramUrl} className="text-emerald-600">{SALON_INFO.instagram}</a>
            </WaBubble>

            <WaBubble title="Solicitud de reseña (post-visita)">
              ¡Esperamos que hayas quedado encantada con el resultado! ✨<br /><br />
              ¿Nos dejas una reseña en Google? Nos ayuda un montón 🙏<br /><br />
              <a href={SALON_INFO.instagramUrl} className="text-emerald-600">{SALON_INFO.instagram}</a> también nos encuentra 💜
            </WaBubble>
          </div>
        </div>

        {/* Config notice */}
        <div className="mt-2 p-4 bg-blue-50 rounded-xl border border-blue-100">
          <p className="text-xs font-medium text-blue-700 mb-1">
            <i className="ti ti-settings mr-1.5" />
            Integración con Meta WhatsApp Cloud API
          </p>
          <p className="text-xs text-blue-600">
            Para activar el envío real de mensajes, agrega tu <strong>WHATSAPP_TOKEN</strong> en el archivo <code className="bg-blue-100 px-1 rounded">.env</code> del servidor
            y configura tu número en Meta Business Suite.
          </p>
        </div>
      </div>
    </div>
  )
}