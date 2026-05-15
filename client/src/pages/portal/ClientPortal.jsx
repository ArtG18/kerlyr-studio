import { useState, useEffect } from 'react'
import api from '../../services/api'
import { SALON_INFO } from '../../data/mockData'

const CATEGORY_LABELS = {
  manicure:    'Manicure',
  kapping:     'Kapping',
  extensiones: 'Extensiones',
  pedicure:    'Pedicure',
  pestanas:    'Pestañas',
  cejas:       'Cejas',
  depilacion:  'Depilación',
}

const ALL_SLOTS = [
  '10:00','10:30','11:00','11:30','12:00','12:30',
  '13:00','13:30','14:00','14:30','15:00','15:30',
  '16:00','16:30','17:00','17:30','18:00','18:30',
]

function applyDiscount(price, discount) {
  if (!discount) return price
  if (discount.type === 'percent') return Math.round(price * (1 - discount.value / 100))
  return Math.max(0, price - discount.value)
}

function StepDot({ n, active, done }) {
  return (
    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0 transition-all
      ${done ? 'bg-emerald-500 text-white' : active ? 'bg-kr-rose text-white' : 'bg-gray-100 text-gray-400'}`}>
      {done ? <i className="ti ti-check text-xs" /> : n}
    </div>
  )
}

export default function ClientPortal() {
  const [step, setStep] = useState(1)

  // Data from API
  const [workers,  setWorkers]  = useState([])
  const [services, setServices] = useState([])
  const [discount, setDiscount] = useState(null)
  const [slots,    setSlots]    = useState([])

  // Selections
  const [selWorker,  setSelWorker]  = useState(null)
  const [selCat,     setSelCat]     = useState('all')
  const [selService, setSelService] = useState(null)
  const [selDate,    setSelDate]    = useState('')
  const [selSlot,    setSelSlot]    = useState(null)
  const [form,       setForm]       = useState({ name: '', phone: '' })

  // UI state
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [submitting,   setSubmitting]   = useState(false)
  const [done,         setDone]         = useState(false)
  const [error,        setError]        = useState('')

  // Load workers, services, active discount on mount
  useEffect(() => {
    api.get('/workers').then(r => setWorkers(r.data.filter(w => w.available))).catch(() => {})
    api.get('/services').then(r => setServices(r.data)).catch(() => {})
    api.get('/discounts/active').then(r => setDiscount(r.data)).catch(() => {})
  }, [])

  // Load available slots when worker + date selected
  useEffect(() => {
    if (!selWorker || !selDate) return
    setLoadingSlots(true)
    setSlots([])
    setSelSlot(null)
    api.get(`/workers/${selWorker.id}/slots`, { params: { date: selDate } })
      .then(r => setSlots(r.data.availableSlots))
      .catch(() => setSlots(ALL_SLOTS))
      .finally(() => setLoadingSlots(false))
  }, [selWorker, selDate])

  const filteredServices = services.filter(s => {
    const workerCats = selWorker?.specialties?.split(',') || []
    const catMatch = selCat === 'all' || s.category === selCat
    const workerMatch = !selWorker || workerCats.includes(s.category)
    return catMatch && workerMatch
  })

  const availableCats = selWorker
    ? [...new Set(services.filter(s => selWorker.specialties?.split(',').includes(s.category)).map(s => s.category))]
    : Object.keys(CATEGORY_LABELS)

  const handleSubmit = async () => {
    if (!form.name || !form.phone || !selWorker || !selService || !selSlot || !selDate) {
      setError('Por favor completa todos los campos')
      return
    }
    setSubmitting(true)
    setError('')
    try {
      // 1. Create or find client
      const clientRes = await api.post('/clients/portal', { name: form.name, phone: form.phone })
      const clientId = clientRes.data.id

      // 2. Create appointment
      await api.post('/appointments/portal', {
        clientId,
        serviceId: selService.id,
        workerId:  selWorker.id,
        date:      selDate,
        timeSlot:  selSlot,
      })

      setDone(true)
    } catch (err) {
      setError(err.response?.data?.error || 'Ocurrió un error. Intenta de nuevo.')
    } finally {
      setSubmitting(false)
    }
  }

  // ─── DONE screen ────────────────────────────────────────────────────────────
  if (done) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-4">
          <i className="ti ti-check text-emerald-500 text-3xl" />
        </div>
        <h2 className="text-xl font-medium text-gray-800 mb-2">¡Cita reservada!</h2>
        <p className="text-sm text-gray-500 mb-1">
          {selService?.name} con {selWorker?.name}
        </p>
        <p className="text-sm text-gray-500 mb-6">
          {selDate} a las {selSlot} hrs
        </p>
        <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100 max-w-sm mx-auto mb-6">
          <p className="text-xs text-emerald-700">
            <i className="ti ti-brand-whatsapp mr-1" />
            Recibirás una confirmación por WhatsApp al {form.phone}
          </p>
        </div>
        <button
          onClick={() => { setDone(false); setStep(1); setSelWorker(null); setSelService(null); setSelSlot(null); setSelDate(''); setForm({ name: '', phone: '' }) }}
          className="btn-primary mx-auto"
        >
          Agendar otra cita
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      {/* Discount banner */}
      {discount && (
        <div className="flex items-center gap-3 p-3.5 bg-amber-50 rounded-xl border border-amber-100">
          <i className="ti ti-tag text-amber-500 text-lg flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-amber-800">{discount.label}</p>
            <p className="text-xs text-amber-600">
              {discount.type === 'percent'
                ? `${discount.value}% de descuento en todos los servicios`
                : `$${Number(discount.value).toLocaleString('es-CL')} de descuento por servicio`
              }
            </p>
          </div>
        </div>
      )}

      {/* Step indicator */}
      <div className="flex items-center gap-2">
        {['Profesional','Servicio','Fecha y hora','Tus datos'].map((label, i) => (
          <div key={label} className="flex items-center gap-2 flex-1">
            <StepDot n={i+1} active={step === i+1} done={step > i+1} />
            <span className={`text-xs hidden sm:block ${step === i+1 ? 'text-kr-rose-dark font-medium' : step > i+1 ? 'text-emerald-600' : 'text-gray-300'}`}>
              {label}
            </span>
            {i < 3 && <div className="flex-1 h-px bg-gray-100" />}
          </div>
        ))}
      </div>

      {/* STEP 1 — Profesional */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <p className="text-sm font-medium text-gray-700 mb-3">
          <span className="text-kr-rose mr-2">1.</span>Elige la profesional
        </p>
        <div className="space-y-2">
          {workers.map(w => {
            const cats = w.specialties?.split(',').map(c => CATEGORY_LABELS[c]).filter(Boolean).join(', ')
            return (
              <button
                key={w.id}
                onClick={() => { setSelWorker(w); setSelService(null); setSelCat('all'); setStep(Math.max(step, 2)) }}
                className={`w-full flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all
                  ${selWorker?.id === w.id ? 'border-kr-rose bg-kr-rose-light' : 'border-gray-100 hover:border-kr-rose-mid'}`}
              >
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0"
                  style={{ background: '#f5e8e4', color: '#8b5e52' }}>
                  {w.name.split(' ').map(n => n[0]).join('').slice(0,2)}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">{w.name}</p>
                  <p className="text-xs text-gray-400">{cats}</p>
                </div>
                {selWorker?.id === w.id && <i className="ti ti-check text-kr-rose" />}
              </button>
            )
          })}
        </div>
      </div>

      {/* STEP 2 — Servicio */}
      {step >= 2 && (
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <p className="text-sm font-medium text-gray-700 mb-3">
            <span className="text-kr-rose mr-2">2.</span>Elige el servicio
          </p>
          {/* Category tabs */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            <button onClick={() => setSelCat('all')}
              className={`text-xs px-3 py-1 rounded-full border transition-all ${selCat === 'all' ? 'bg-kr-rose-light text-kr-rose-dark border-kr-rose' : 'border-gray-200 text-gray-500'}`}>
              Todos
            </button>
            {availableCats.map(cat => (
              <button key={cat} onClick={() => setSelCat(cat)}
                className={`text-xs px-3 py-1 rounded-full border transition-all ${selCat === cat ? 'bg-kr-rose-light text-kr-rose-dark border-kr-rose' : 'border-gray-200 text-gray-500'}`}>
                {CATEGORY_LABELS[cat]}
              </button>
            ))}
          </div>
          <div className="space-y-1.5 max-h-64 overflow-y-auto">
            {filteredServices.map(svc => {
              const discounted = applyDiscount(svc.price, discount)
              const isSelected = selService?.id === svc.id
              return (
                <button key={svc.id}
                  onClick={() => { setSelService(svc); setStep(Math.max(step, 3)) }}
                  className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all
                    ${isSelected ? 'border-kr-rose bg-kr-rose-light' : 'border-gray-100 hover:border-kr-rose-mid'}`}>
                  <div>
                    <p className="text-sm font-medium text-gray-800">{svc.name}</p>
                    {svc.detail && <p className="text-xs text-gray-400">{svc.detail}</p>}
                    <p className="text-xs text-gray-300">{svc.duration} min</p>
                  </div>
                  <div className="text-right flex-shrink-0 ml-3">
                    {discounted !== svc.price ? (
                      <>
                        <p className="text-xs line-through text-gray-300">${svc.price.toLocaleString('es-CL')}</p>
                        <p className="text-sm font-semibold text-emerald-600">${discounted.toLocaleString('es-CL')}</p>
                      </>
                    ) : (
                      <p className="text-sm font-medium text-gray-800">${svc.price.toLocaleString('es-CL')}</p>
                    )}
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* STEP 3 — Fecha y hora */}
      {step >= 3 && (
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <p className="text-sm font-medium text-gray-700 mb-3">
            <span className="text-kr-rose mr-2">3.</span>Fecha y hora
          </p>
          <div className="mb-4">
            <label className="form-label">Selecciona una fecha</label>
            <input
              type="date"
              className="form-input"
              min={new Date().toISOString().split('T')[0]}
              value={selDate}
              onChange={e => { setSelDate(e.target.value); setSelSlot(null); setStep(Math.max(step, 3)) }}
            />
          </div>
          {selDate && (
            <>
              {loadingSlots ? (
                <p className="text-xs text-gray-400 text-center py-4">Cargando horarios disponibles...</p>
              ) : slots.length === 0 ? (
                <p className="text-xs text-red-400 bg-red-50 rounded-lg p-3 text-center">
                  No hay horarios disponibles para {selWorker?.name} en esta fecha.
                </p>
              ) : (
                <>
                  <label className="form-label">Horarios disponibles</label>
                  <div className="grid grid-cols-4 gap-2">
                    {slots.map(slot => (
                      <button key={slot}
                        onClick={() => { setSelSlot(slot); setStep(Math.max(step, 4)) }}
                        className={`py-2 rounded-lg text-xs font-medium border transition-all
                          ${selSlot === slot ? 'bg-kr-rose text-white border-kr-rose' : 'border-gray-200 text-gray-700 hover:border-kr-rose hover:bg-kr-rose-light'}`}>
                        {slot}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      )}

      {/* STEP 4 — Datos */}
      {step >= 4 && (
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <p className="text-sm font-medium text-gray-700 mb-3">
            <span className="text-kr-rose mr-2">4.</span>Tus datos
          </p>
          <div className="space-y-3">
            <div>
              <label className="form-label">Nombre completo</label>
              <input className="form-input" type="text" placeholder="Tu nombre" value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
            </div>
            <div>
              <label className="form-label">WhatsApp</label>
              <input className="form-input" type="tel" placeholder="+56 9 ..." value={form.phone}
                onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
            </div>
          </div>

          {/* Resumen */}
          {selService && selSlot && (
            <div className="mt-4 p-3.5 bg-kr-rose-light rounded-xl border border-kr-rose-mid text-sm space-y-1.5">
              <p className="font-medium text-kr-rose-dark mb-2">Resumen de tu cita</p>
              <p className="text-gray-600 text-xs"><i className="ti ti-user mr-1.5" />{selWorker?.name}</p>
              <p className="text-gray-600 text-xs"><i className="ti ti-sparkles mr-1.5" />{selService.name}</p>
              <p className="text-gray-600 text-xs"><i className="ti ti-calendar mr-1.5" />{selDate} a las {selSlot} hrs</p>
              <p className="text-gray-600 text-xs font-medium">
                <i className="ti ti-cash mr-1.5" />
                {applyDiscount(selService.price, discount) !== selService.price ? (
                  <><span className="line-through text-gray-300 mr-1">${selService.price.toLocaleString('es-CL')}</span>
                  <span className="text-emerald-600">${applyDiscount(selService.price, discount).toLocaleString('es-CL')}</span></>
                ) : `$${selService.price.toLocaleString('es-CL')}`}
              </p>
            </div>
          )}

          {error && (
            <div className="mt-3 flex items-center gap-2 p-3 bg-red-50 rounded-lg border border-red-100">
              <i className="ti ti-alert-circle text-red-400" />
              <p className="text-xs text-red-600">{error}</p>
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={submitting || !form.name || !form.phone}
            className="btn-primary w-full justify-center py-3 mt-4 disabled:opacity-40"
          >
            {submitting
              ? <><i className="ti ti-loader-2 animate-spin" /> Reservando...</>
              : <><i className="ti ti-check" /> Confirmar cita</>
            }
          </button>
        </div>
      )}
    </div>
  )
}