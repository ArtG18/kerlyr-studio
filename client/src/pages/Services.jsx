import { SERVICES, CATEGORY_LABELS } from '../data/mockData'
import { useApp } from '../context/AppContext'
import { PriceDisplay, TopBar } from '../components/UI'

const ICONS = {
  manicure:    'ti-sparkles',
  kapping:     'ti-diamond',
  extensiones: 'ti-stars',
  pedicure:    'ti-droplet',
  pestanas:    'ti-eye',
  cejas:       'ti-brush',
  depilacion:  'ti-scissors',
}

const ICON_COLORS = {
  manicure:    'bg-pink-50 text-pink-600',
  kapping:     'bg-purple-50 text-purple-600',
  extensiones: 'bg-amber-50 text-amber-600',
  pedicure:    'bg-blue-50 text-blue-600',
  pestanas:    'bg-emerald-50 text-emerald-600',
  cejas:       'bg-kr-rose-light text-kr-rose-dark',
  depilacion:  'bg-gray-50 text-gray-500',
}

export default function Services() {
  const { applyDiscount, discount } = useApp()

  const grouped = Object.keys(CATEGORY_LABELS).reduce((acc, cat) => {
    acc[cat] = SERVICES.filter(s => s.category === cat)
    return acc
  }, {})

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <TopBar title="Servicios y precios">
        {discount.active && (
          <span className="flex items-center gap-1.5 text-xs bg-amber-50 text-amber-700 px-3 py-1.5 rounded-full border border-amber-100">
            <i className="ti ti-tag text-sm" /> {discount.label} activo
          </span>
        )}
      </TopBar>

      <div className="flex-1 overflow-y-auto p-5">
        <div className="grid grid-cols-2 gap-x-6 gap-y-5">
          {Object.entries(grouped).map(([cat, services]) => (
            <div key={cat}>
              <div className="flex items-center gap-2 mb-2.5">
                <div className={`w-6 h-6 rounded-md flex items-center justify-center ${ICON_COLORS[cat]}`}>
                  <i className={`ti ${ICONS[cat]} text-sm`} />
                </div>
                <h3 className="text-sm font-medium text-gray-800">
                  {CATEGORY_LABELS[cat].label}
                </h3>
              </div>
              <div className="space-y-1.5">
                {services.map(svc => {
                  const discounted = applyDiscount(svc.price)
                  return (
                    <div key={svc.id} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="text-xs font-medium text-gray-800">{svc.name}</p>
                        {svc.detail && <p className="text-[10px] text-gray-400">{svc.detail}</p>}
                      </div>
                      <PriceDisplay price={svc.price} discountedPrice={discounted} />
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Footer note */}
        <div className="mt-5 flex gap-3">
          <div className="flex items-center gap-2 text-xs text-gray-500 bg-kr-rose-light px-3 py-2 rounded-lg">
            <i className="ti ti-credit-card text-kr-rose" /> Con todo medio de pago
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500 bg-kr-rose-light px-3 py-2 rounded-lg">
            <i className="ti ti-rotate-clockwise text-kr-rose" /> Costo de retiro adicional
          </div>
        </div>
      </div>
    </div>
  )
}