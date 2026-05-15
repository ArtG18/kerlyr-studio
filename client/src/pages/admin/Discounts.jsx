import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { CATEGORY_LABELS, SERVICES } from '../../data/mockData'
import { TopBar, Toggle, PriceDisplay } from '../../components/UI'

const QUICK_DISCOUNTS = [
  { label: '10% OFF',           type: 'percent', value: 10 },
  { label: '20% OFF',           type: 'percent', value: 20 },
  { label: '30% OFF',           type: 'percent', value: 30 },
  { label: '50% OFF',           type: 'percent', value: 50 },
  { label: '$2.000 menos',      type: 'fixed',   value: 2000 },
  { label: '$5.000 menos',      type: 'fixed',   value: 5000 },
]

export default function Discounts() {
  const { discount, setDiscount, applyDiscount } = useApp()

  const [form, setForm] = useState({
    type: discount.type,
    value: discount.value || '',
    label: discount.label || '',
    categories: discount.categories || [],
  })

  const setF = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }))

  const toggleCategory = (cat) => {
    setForm(f => ({
      ...f,
      categories: f.categories.includes(cat)
        ? f.categories.filter(c => c !== cat)
        : [...f.categories, cat],
    }))
  }

  const applyQuick = (q) => {
    const label = q.label
    setForm({ type: q.type, value: q.value, label, categories: [] })
    setDiscount({ active: true, type: q.type, value: q.value, label, categories: [] })
  }

  const handleSave = () => {
    setDiscount({
      active: true,
      type: form.type,
      value: Number(form.value),
      label: form.label || (form.type === 'percent' ? `${form.value}% OFF` : `$${Number(form.value).toLocaleString('es-CL')} menos`),
      categories: form.categories,
    })
  }

  const handleDeactivate = () => {
    setDiscount({ active: false, type: 'percent', value: 0, label: '', categories: [] })
    setForm({ type: 'percent', value: '', label: '', categories: [] })
  }

  // Preview: show a few services with discount applied
  const previewServices = SERVICES.slice(0, 6)

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <TopBar title="Descuentos">
        <div className="flex items-center gap-2">
          <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${discount.active ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
            {discount.active ? '● Descuento activo' : '○ Sin descuento'}
          </span>
          {discount.active && (
            <button onClick={handleDeactivate} className="btn-outline text-red-500 border-red-100 hover:bg-red-50">
              <i className="ti ti-x" /> Desactivar
            </button>
          )}
        </div>
      </TopBar>

      <div className="flex-1 overflow-y-auto p-5">
        <div className="grid grid-cols-2 gap-6">

          {/* Left — config */}
          <div className="space-y-5">

            {/* Quick discounts */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2.5">Descuentos rápidos</h3>
              <div className="grid grid-cols-3 gap-2">
                {QUICK_DISCOUNTS.map(q => (
                  <button
                    key={q.label}
                    onClick={() => applyQuick(q)}
                    className={`py-2.5 rounded-xl text-xs font-medium border transition-all
                      ${discount.active && discount.label === q.label
                        ? 'bg-kr-rose text-white border-kr-rose'
                        : 'bg-white border-gray-200 text-gray-700 hover:border-kr-rose hover:bg-kr-rose-light hover:text-kr-rose-dark'
                      }`}
                  >
                    {q.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom discount */}
            <div className="card space-y-4">
              <h3 className="text-sm font-medium text-gray-700">Descuento personalizado</h3>

              <div>
                <label className="form-label">Tipo de descuento</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { val: 'percent', label: 'Porcentaje (%)', icon: 'ti-percentage' },
                    { val: 'fixed',   label: 'Monto fijo ($)',  icon: 'ti-cash' },
                  ].map(opt => (
                    <button
                      key={opt.val}
                      onClick={() => setForm(f => ({ ...f, type: opt.val }))}
                      className={`flex items-center gap-2 p-2.5 rounded-lg border text-xs transition-all
                        ${form.type === opt.val
                          ? 'border-kr-rose bg-kr-rose-light text-kr-rose-dark font-medium'
                          : 'border-gray-200 text-gray-600 hover:border-gray-300'
                        }`}
                    >
                      <i className={`ti ${opt.icon}`} /> {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="form-label">
                  {form.type === 'percent' ? 'Porcentaje de descuento' : 'Monto a descontar (CLP)'}
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                    {form.type === 'percent' ? '%' : '$'}
                  </span>
                  <input
                    className="form-input pl-7"
                    type="number"
                    min="0"
                    max={form.type === 'percent' ? 100 : undefined}
                    placeholder={form.type === 'percent' ? 'Ej: 20' : 'Ej: 5000'}
                    value={form.value}
                    onChange={setF('value')}
                  />
                </div>
              </div>

              <div>
                <label className="form-label">Nombre del descuento (opcional)</label>
                <input
                  className="form-input"
                  type="text"
                  placeholder="Ej: Promo día de la madre"
                  value={form.label}
                  onChange={setF('label')}
                />
              </div>

              {/* Category filter */}
              <div>
                <label className="form-label">Aplicar a categorías (vacío = todas)</label>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {Object.entries(CATEGORY_LABELS).map(([cat, { label }]) => (
                    <button
                      key={cat}
                      onClick={() => toggleCategory(cat)}
                      className={`text-xs px-2.5 py-1 rounded-full border transition-all
                        ${form.categories.includes(cat)
                          ? 'bg-kr-rose-light text-kr-rose-dark border-kr-rose font-medium'
                          : 'border-gray-200 text-gray-500 hover:border-gray-300'
                        }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleSave}
                disabled={!form.value}
                className="btn-primary w-full justify-center disabled:opacity-40"
              >
                <i className="ti ti-check" /> Activar descuento
              </button>
            </div>
          </div>

          {/* Right — preview */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2.5">
              Vista previa de precios
              {discount.active && (
                <span className="ml-2 text-xs font-normal text-emerald-600">
                  con descuento aplicado
                </span>
              )}
            </h3>
            <div className="space-y-1.5">
              {previewServices.map(svc => {
                const shouldApply = discount.categories.length === 0 || discount.categories.includes(svc.category)
                const discounted = shouldApply ? applyDiscount(svc.price) : svc.price
                return (
                  <div key={svc.id} className="flex items-center justify-between py-2.5 px-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-xs font-medium text-gray-800">{svc.name}</p>
                      <p className="text-[10px] text-gray-400 capitalize">{svc.category}</p>
                    </div>
                    <PriceDisplay price={svc.price} discountedPrice={discounted} />
                  </div>
                )
              })}
            </div>

            {discount.active && (
              <div className="mt-4 p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                <p className="text-xs font-medium text-emerald-700 mb-1">
                  <i className="ti ti-check-circle mr-1" />
                  Descuento activo: {discount.label}
                </p>
                <p className="text-xs text-emerald-600">
                  {discount.type === 'percent'
                    ? `${discount.value}% de descuento aplicado automáticamente`
                    : `$${Number(discount.value).toLocaleString('es-CL')} menos en cada servicio`
                  }
                  {discount.categories.length > 0
                    ? ` — solo ${discount.categories.map(c => CATEGORY_LABELS[c]?.label).join(', ')}`
                    : ' — en todos los servicios'
                  }
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}