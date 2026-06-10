import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'

const CATEGORY_LABELS = {
  manicure: 'Manicure',
  kapping: 'Kapping',
  extensiones: 'Extensiones',
  pedicure: 'Pedicure',
  pestanas: 'Pestañas',
  cejas: 'Cejas',
  depilacion: 'Depilación',
}

const ALL_SLOTS = [
  '10:00','10:30','11:00','11:30','12:00','12:30',
  '13:00','13:30','14:00','14:30','15:00','15:30',
  '16:00','16:30','17:00','17:30','18:00','18:30',
]

const BACKEND = (
  import.meta.env.VITE_API_URL ||
  'https://kerlyr-studio-server.onrender.com'
).replace(/\/$/, '')

function applyDiscount(price, discount) {
  if (!discount) return price
  if (discount.type === 'percent') {
    return Math.round(price * (1 - discount.value / 100))
  }
  return Math.max(0, price - discount.value)
}

function StepDot({ n, active, done }) {
  return (
    <div
      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0 transition-all
      ${
        done
          ? 'bg-emerald-500 text-white'
          : active
          ? 'bg-rose-400 text-white'
          : 'bg-gray-100 text-gray-400'
      }`}
    >
      {done ? '✓' : n}
    </div>
  )
}

export default function ClientPortal() {
  const [step, setStep] = useState(1)

  const [workers, setWorkers] = useState([])
  const [services, setServices] = useState([])
  const [discount, setDiscount] = useState(null)
  const [slots, setSlots] = useState([])

  const [selWorker, setSelWorker] = useState(null)
  const [selServices, setSelServices] = useState([])
  const [selCat, setSelCat] = useState('all')
  const [selDate, setSelDate] = useState('')
  const [selSlot, setSelSlot] = useState(null)

  const [form, setForm] = useState({
    name: '',
    phone: '',
  })

  const [loadingSlots, setLoadingSlots] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)

  useEffect(() => {
    fetch(`${BACKEND}/workers`)
      .then(r => r.json())
      .then(data => {
        setWorkers(
          Array.isArray(data)
            ? data.filter(w => w.available)
            : []
        )
      })
      .catch(() => setWorkers([]))

    fetch(`${BACKEND}/services`)
      .then(r => r.json())
      .then(data => {
        setServices(Array.isArray(data) ? data : [])
      })
      .catch(() => setServices([]))

    fetch(`${BACKEND}/discounts/active`)
      .then(async r => {
        if (!r.ok) return null
        const text = await r.text()
        try {
          return JSON.parse(text)
        } catch {
          return null
        }
      })
      .then(data => setDiscount(data || null))
      .catch(() => setDiscount(null))
  }, [])

<<<<<<< HEAD
  useEffect(() => {
    if (!selWorker || !selDate) return

    setLoadingSlots(true)
    setSlots([])
    setSelSlot(null)

    fetch(`${BACKEND}/workers/${selWorker.id}/slots?date=${selDate}`)
      .then(r => r.json())
      .then(data => {
        setSlots(data.availableSlots || ALL_SLOTS)
      })
      .catch(() => setSlots(ALL_SLOTS))
      .finally(() => setLoadingSlots(false))
  }, [selWorker, selDate])

  const availableCats = selWorker
    ? [...new Set(
        services
          .filter(s =>
            selWorker.specialties?.split(',').map(c => c.trim().toLowerCase()).includes(s.category?.trim().toLowerCase())
          )
          .map(s => s.category)
      )]
    : Object.keys(CATEGORY_LABELS)

  const filteredServices = services.filter(s => {
    const workerMatch =
      !selWorker ||
      selWorker.specialties?.split(',').map(c => c.trim().toLowerCase()).includes(s.category?.trim().toLowerCase())

    const catMatch =
      selCat === 'all' || s.category === selCat

    return workerMatch && catMatch
  })

  const toggleService = (svc) => {
    setSelServices(prev => {
      const exists = prev.find(s => s.id === svc.id)
      if (exists) {
        return prev.filter(s => s.id !== svc.id)
      }
      return [...prev, svc]
=======
  // Cargar slots cuando cambia trabajadora o fecha
useEffect(() => {
  if (!selWorker || !selDate) return
  setLoadingSlots(true)
  setSlots([])
  setSelSlot(null)
  fetch(`${BACKEND}/workers/${selWorker.id}/slots?date=${selDate}`)
    .then(r => r.json())
    .then(data => {
      let available = data.availableSlots || ALL_SLOTS
      // Filtrar horas pasadas si es hoy
      const today = new Date().toISOString().split('T')[0]
      if (selDate === today) {
        const now = new Date()
        const currentHour = now.getHours()
        const currentMin  = now.getMinutes()
        available = available.filter(slot => {
          const [h, m] = slot.split(':').map(Number)
          return h > currentHour || (h === currentHour && m > currentMin)
        })
      }
      setSlots(available)
>>>>>>> b6ad3cc (fix: no permitir agendar en horas pasadas)
    })
    .catch(() => {
      // Fallback con filtro igual
      const today = new Date().toISOString().split('T')[0]
      let slots = ALL_SLOTS
      if (selDate === today) {
        const now = new Date()
        slots = ALL_SLOTS.filter(slot => {
          const [h, m] = slot.split(':').map(Number)
          return h > now.getHours() || (h === now.getHours() && m > now.getMinutes())
        })
      }
      setSlots(slots)
    })
    .finally(() => setLoadingSlots(false))
}, [selWorker, selDate])

  const totalPrice = selServices.reduce(
    (sum, s) => sum + applyDiscount(s.price, discount),
    0
  )

  const totalDuration = selServices.reduce(
    (sum, s) => sum + (s.duration || 0),
    0
  )

  const handleSubmit = async () => {
    if (
      !form.name ||
      !form.phone ||
      !selWorker ||
      selServices.length === 0 ||
      !selSlot ||
      !selDate
    ) {
      toast.error('Completa todos los campos')
      return
    }

    setSubmitting(true)

    try {
      const clientRes = await fetch(`${BACKEND}/clients/portal`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
        }),
      })

      const client = await clientRes.json()

      if (!clientRes.ok) {
        throw new Error(client.error)
      }

      for (const svc of selServices) {
        const apptRes = await fetch(`${BACKEND}/appointments/portal`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            clientId: client.id,
            serviceId: svc.id,
            workerId: selWorker.id,
            date: selDate,
            timeSlot: selSlot,
          }),
        })

        const appt = await apptRes.json()

        if (!apptRes.ok) {
          throw new Error(appt.error)
        }
      }

      toast.success('Cita reservada correctamente ✨')
      setDone(true)

    } catch (err) {
      toast.error(
        err.message || 'Ocurrió un error, intenta nuevamente'
      )
    } finally {
      setSubmitting(false)
    }
  }

  if (done) {
    return (
      <div className="text-center py-16 px-4">
        <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-4">
          <span className="text-emerald-500 text-3xl">✓</span>
        </div>

        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          ¡Cita reservada!
        </h2>

        <p className="text-sm text-gray-500 mb-1">
          {selServices.map(s => s.name).join(' + ')}
        </p>

        <p className="text-sm text-gray-500 mb-1">
          con {selWorker?.name}
        </p>

        <p className="text-sm text-gray-500 mb-6">
          {selDate} a las {selSlot} hrs
        </p>

        <button
          onClick={() => {
            setDone(false)
            setStep(1)
            setSelWorker(null)
            setSelServices([])
            setSelSlot(null)
            setSelDate('')
            setForm({
              name: '',
              phone: '',
            })
          }}
          className="bg-gradient-to-r from-rose-400 to-pink-500 text-white px-6 py-3 rounded-xl font-medium"
        >
          Agendar otra cita
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-4 max-w-xl mx-auto">
      
      {/* Descuento activo */}
      {discount && (
        <div className="flex items-center gap-3 p-3.5 bg-amber-50 rounded-xl border border-amber-100">
          <span className="text-amber-500 text-lg">🏷️</span>
          <div>
            <p className="text-sm font-medium text-amber-800">{discount.label}</p>
            <p className="text-xs text-amber-600">
              {discount.type === 'percent' ? `${discount.value}% de descuento aplicado` : `$${Number(discount.value).toLocaleString('es-CL')} de descuento`}
            </p>
          </div>
        </div>
      )}

      {/* Indicador de Pasos (Steps) */}
      <div className="flex items-center gap-2">
        {['Profesional','Servicios','Fecha y hora','Tus datos'].map((label, i) => (
          <div key={label} className="flex items-center gap-1.5 flex-1">
            <StepDot
              n={i + 1}
              active={step === i + 1}
              done={step > i + 1}
            />
            <span
              className={`text-xs hidden sm:block truncate ${
                step === i + 1
                  ? 'text-rose-500 font-medium'
                  : step > i + 1
                  ? 'text-emerald-600'
                  : 'text-gray-300'
              }`}
            >
              {label}
            </span>
            {i < 3 && (
              <div className="flex-1 h-px bg-gray-100" />
            )}
          </div>
        ))}
      </div>

      {/* PASO 1 — Profesional */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <p className="text-sm font-medium text-gray-700 mb-3">
          <span className="text-rose-400 mr-1.5">1.</span>Elige la profesional
        </p>
        <div className="space-y-2">
          {workers.length === 0 ? (
            <p className="text-xs text-gray-400 text-center py-4">
              Cargando profesionales...
            </p>
          ) : (
            workers.map(w => {
              const cats = w.specialties
                ?.split(',')
                .map(c => CATEGORY_LABELS[c.trim().toLowerCase()] || c.trim())
                .filter(Boolean)
                .join(', ')

              const isSelected = selWorker?.id === w.id

              return (
                <button
                  key={w.id}
                  onClick={() => {
                    setSelWorker(w)
                    setSelServices([])
                    setSelCat('all')
                    setStep(2)
                  }}
                  className={`w-full flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'border-rose-300 bg-rose-50'
                      : 'border-gray-100 hover:border-rose-200'
                  }`}
                >
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0 bg-rose-100 text-rose-600">
                    {w.name ? w.name.split(' ').map(n => n[0]).join('').slice(0,2) : '??'}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800">
                      {w.name}
                    </p>
                    <p className="text-xs text-gray-400 truncate">
                      {cats}
                    </p>
                  </div>

                  {isSelected && (
                    <span className="text-rose-400 text-lg">✓</span>
                  )}
                </button>
              )
            })
          )}
        </div>
      </div>

      {/* PASO 2 — Servicios (Múltiple) */}
      {step >= 2 && (
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <p className="text-sm font-medium text-gray-700 mb-3">
            <span className="text-rose-400 mr-1.5">2.</span> Elige los servicios <span className="text-xs font-normal text-gray-400 ml-2">Puedes seleccionar varios</span>
          </p>
          
          {/* Tabs de categoría */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            <button onClick={() => setSelCat('all')} className={`text-xs px-3 py-1 rounded-full border transition-all ${selCat === 'all' ? 'bg-rose-50 text-rose-500 border-rose-200 font-medium' : 'border-gray-200 text-gray-500'}`}>
              Todos
            </button>
            {availableCats.map(cat => (
              <button key={cat} onClick={() => setSelCat(cat)} className={`text-xs px-3 py-1 rounded-full border transition-all ${selCat === cat ? 'bg-rose-50 text-rose-500 border-rose-200 font-medium' : 'border-gray-200 text-gray-500'}`}>
                {CATEGORY_LABELS[cat] || cat}
              </button>
            ))}
          </div>

          {/* Lista de servicios */}
          <div className="space-y-1.5 max-h-60 overflow-y-auto">
            {filteredServices.map(svc => {
              const discounted = applyDiscount(svc.price, discount)
              const isSelected = selServices.find(s => s.id === svc.id)
              return (
                <button key={svc.id} onClick={() => { toggleService(svc); setStep(Math.max(step, 2)) }} className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${isSelected ? 'border-rose-300 bg-rose-50' : 'border-gray-100 hover:border-rose-200'}`}>
                  <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all ${isSelected ? 'bg-rose-400 border-rose-400' : 'border-gray-300'}`}>
                    {isSelected && <span className="text-white text-xs font-bold">✓</span>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800">{svc.name}</p>
                    {svc.detail && <p className="text-xs text-gray-400">{svc.detail}</p>}
                    <p className="text-[10px] text-gray-300">{svc.duration} min</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    {discounted !== svc.price ? (
                      <>
                        <p className="text-xs line-through text-gray-300">${svc.price.toLocaleString('es-CL')}</p>
                        <p className="text-sm font-semibold text-emerald-600">${discounted.toLocaleString('es-CL')}</p>
                      </>
                    ) : (
                      <p className="text-sm font-medium text-gray-700">${svc.price.toLocaleString('es-CL')}</p>
                    )}
                  </div>
                </button>
              )
            })}
          </div>

          {/* Resumen selección */}
          {selServices.length > 0 && (
            <div className="mt-3 p-3 bg-rose-50 rounded-xl border border-rose-100">
              <div className="flex items-center justify-between mb-1">
                <p className="text-xs font-medium text-rose-600">{selServices.length} servicio{selServices.length > 1 ? 's' : ''} seleccionado{selServices.length > 1 ? 's' : ''}</p>
                <p className="text-xs font-semibold text-rose-600">${totalPrice.toLocaleString('es-CL')} · {totalDuration} min</p>
              </div>
              <div className="flex flex-wrap gap-1 mb-2">
                {selServices.map(s => (
                  <span key={s.id} className="text-[10px] bg-white text-rose-500 px-2 py-0.5 rounded-full border border-rose-100">
                    {s.name}
                  </span>
                ))}
              </div>
              <button onClick={() => setStep(Math.max(step, 3))} className="w-full bg-rose-400 text-white text-xs py-2 rounded-lg font-medium">
                Continuar →
              </button>
            </div>
          )}
        </div>
      )}

      {/* PASO 3 — Fecha y hora */}
      {step >= 3 && (
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <p className="text-sm font-medium text-gray-700 mb-3">
            <span className="text-rose-400 mr-1.5">3.</span>Fecha y hora
          </p>
          <div className="mb-4">
            <label className="text-xs text-gray-500 mb-1.5 block">Selecciona una fecha</label>
            <input type="date" className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl outline-none focus:border-rose-300" min={new Date().toISOString().split('T')[0]} value={selDate} onChange={e => { setSelDate(e.target.value); setSelSlot(null); setStep(Math.max(step, 3)) }} />
          </div>
          {selDate && (
            <>
              {loadingSlots ? (
                <p className="text-xs text-gray-400 text-center py-4">Cargando horarios disponibles...</p>
              ) : slots.length === 0 ? (
                <p className="text-xs text-red-400 bg-red-50 rounded-lg p-3 text-center">
                  No hay horarios disponibles para {selWorker?.name?.split(' ')[0]} en esta fecha.
                </p>
              ) : (
                <>
                  <label className="text-xs text-gray-500 mb-1.5 block">Horarios disponibles</label>
                  <div className="grid grid-cols-4 gap-2">
                    {slots.map(slot => (
                      <button key={slot} onClick={() => { setSelSlot(slot); setStep(Math.max(step, 4)) }} className={`py-2 rounded-xl text-xs font-medium border transition-all ${selSlot === slot ? 'bg-rose-400 text-white border-rose-400' : 'border-gray-200 text-gray-700 hover:border-rose-300 hover:bg-rose-50'}`}>
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

      {/* PASO 4 — Datos */}
      {step >= 4 && (
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <p className="text-sm font-medium text-gray-700 mb-3">
            <span className="text-rose-400 mr-1.5">4.</span>Tus datos
          </p>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-gray-500 mb-1.5 block">Nombre completo</label>
              <input className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:border-rose-300" type="text" placeholder="Tu nombre" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1.5 block">WhatsApp</label>
              <input className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:border-rose-300" type="tel" placeholder="+56 9 ..." value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
            </div>
          </div>

          {/* Resumen final */}
          {selServices.length > 0 && selSlot && (
            <div className="mt-4 p-4 bg-rose-50 rounded-xl border border-rose-100 space-y-1.5 text-xs">
              <p className="font-semibold text-rose-500 mb-2">Resumen de tu cita</p>
              <p className="text-gray-600">👤 {selWorker?.name}</p>
              <p className="text-gray-600">✨ {selServices.map(s => s.name).join(', ')}</p>
              <p className="text-gray-600">📅 {selDate} a las {selSlot} hrs</p>
              <p className="text-gray-600">⏱️ {totalDuration} min en total</p>
              <p className="font-semibold text-rose-500">💰 Total: ${totalPrice.toLocaleString('es-CL')}</p>
            </div>
          )}

          <button onClick={handleSubmit} disabled={submitting || !form.name || !form.phone} className="w-full bg-gradient-to-r from-rose-400 to-pink-500 text-white py-3 rounded-xl font-semibold mt-4 disabled:opacity-40 hover:scale-105 transition-all shadow-md">
            {submitting ? 'Reservando...' : '💅 Confirmar cita'}
          </button>
        </div>
      )}

    </div>
  )
}