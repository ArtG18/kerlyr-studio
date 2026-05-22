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
            selWorker.specialties?.split(',').includes(s.category)
          )
          .map(s => s.category)
      )]
    : Object.keys(CATEGORY_LABELS)

  const filteredServices = services.filter(s => {
    const workerMatch =
      !selWorker ||
      selWorker.specialties?.split(',').includes(s.category)

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
    })
  }

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

      <div className="bg-white rounded-2xl border border-gray-100 p-5">

        <div className="space-y-2">

          {workers.length === 0 ? (
            <p className="text-xs text-gray-400 text-center py-4">
              Cargando profesionales...
            </p>
          ) : (
            workers.map(w => {

              const cats = w.specialties
                ?.split(',')
                .map(c => CATEGORY_LABELS[c])
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
                    {w.name
                      .split(' ')
                      .map(n => n[0])
                      .join('')
                      .slice(0,2)}
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
    </div>
  )
}