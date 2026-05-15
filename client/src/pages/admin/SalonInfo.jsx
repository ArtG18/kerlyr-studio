import { SALON_INFO } from '../data/mockData'
import { TopBar } from '../components/UI'

export default function SalonInfo() {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <TopBar title="Info del salón" />

      <div className="flex-1 overflow-y-auto p-5">
        <div className="grid grid-cols-2 gap-6">

          {/* Left — brand + contact */}
          <div className="space-y-4">
            {/* Brand card */}
            <div className="rounded-2xl bg-kr-rose-light border border-kr-rose-mid p-6 text-center">
              <p className="font-display italic text-4xl text-kr-rose leading-none">KR</p>
              <p className="text-base font-medium text-gray-800 mt-2">{SALON_INFO.name}</p>
              <p className="text-xs text-gray-400 tracking-widest uppercase mt-1">{SALON_INFO.tagline}</p>
            </div>

            {/* Contact */}
            <div className="card space-y-3">
              {[
                {
                  icon: 'ti-brand-whatsapp', iconBg: 'bg-emerald-50 text-emerald-600',
                  label: 'WhatsApp Business',
                  value: SALON_INFO.phone,
                  href: `https://wa.me/${SALON_INFO.phone.replace(/\s+/g,'').replace('+','')}`,
                },
                {
                  icon: 'ti-brand-instagram', iconBg: 'bg-pink-50 text-pink-500',
                  label: 'Instagram',
                  value: SALON_INFO.instagram,
                  href: SALON_INFO.instagramUrl,
                },
                {
                  icon: 'ti-clock', iconBg: 'bg-kr-rose-light text-kr-rose',
                  label: 'Horario',
                  value: `${SALON_INFO.hours.weekdays} · ${SALON_INFO.hours.saturday}`,
                },
                {
                  icon: 'ti-credit-card', iconBg: 'bg-amber-50 text-amber-600',
                  label: 'Pago',
                  value: SALON_INFO.payment,
                },
                {
                  icon: 'ti-rotate-clockwise', iconBg: 'bg-gray-50 text-gray-500',
                  label: 'Retiro',
                  value: SALON_INFO.note,
                },
              ].map(({ icon, iconBg, label, value, href }) => (
                <div key={label} className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${iconBg}`}>
                    <i className={`ti ${icon} text-sm`} />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 mb-0.5">{label}</p>
                    {href ? (
                      <a href={href} target="_blank" rel="noopener noreferrer" className="text-xs font-medium text-gray-800 hover:text-kr-rose transition-colors">
                        {value}
                      </a>
                    ) : (
                      <p className="text-xs font-medium text-gray-800">{value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — map */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">Ubicación</h3>
            <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
              <iframe
                src={SALON_INFO.mapsEmbed}
                width="100%"
                height="320"
                style={{ border: 0, display: 'block' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Kerlyr Nails Studio — Google Maps"
              />
            </div>
            <a
              href={SALON_INFO.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-xs text-kr-rose hover:text-kr-rose-dark mt-2.5 transition-colors"
            >
              <i className="ti ti-map-pin text-sm" />
              Ver en Google Maps
              <i className="ti ti-external-link text-xs" />
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}