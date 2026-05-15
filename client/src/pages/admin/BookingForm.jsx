import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { SERVICES, CATEGORY_LABELS, SALON_INFO, WORKERS, getAvailableSlots } from '../data/mockData'
import { PriceDisplay, TopBar, Avatar } from '../components/UI'

const CATEGORIES = Object.keys(CATEGORY_LABELS)

// Step indicator
function Step({ n, label, active, done }) {
  return (
    <div className={`flex items-center gap-2 text-xs font-medium transition-colors ${active ? 'text-kr-rose-dark' : done ? 'text-emerald-600' : 'text-gray-300'}`}>
      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-semibold flex-shrink-0
        ${active ? 'bg-kr-rose text-white' : done ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-400'}`}>
        {done ? <i className="ti ti-check text-xs" /> : n}
      </div>
      {label}
    </div>
  )
}

export default function BookingForm() {
  const navigate = useNavigate()
  const { applyDiscount, discount, addAppointment } = useApp()

  const [step, setStep] = useState(1) // 1: trabajadora  2: servicio  3: horario  4: datos
  const [selectedWorker, setSelectedWorker] = useState(null)
  const [selectedServiceId, setSelectedServiceId] = useState(null)
  const [selectedSlot, setSelectedSlot] = useState(null)
  const [catFilter, setCatFilter] = useState('all')
  const [form, setForm] = useState({ name: '', phone: '', notes: '' })
  const [saved, setSaved] = useState(false)
  const [slotError, setSlotError] = useState('')

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }))
  const selectedService = SERVICES.find(s => s.id === selectedServiceId)
  const availableSlots = selectedWorker ? getAvailableSlots(selectedWorker.id) : []

  const filteredServices = (catFilter === 'all' ? SERVICES : SERVICES.filter(s => s.category === catFilter))
    .filter(s => !selectedWorker || selectedWorker.specialties.includes(s.category))

  const handleSelectWorker = (w) => {
    setSelectedWorker(w)
    setSelectedServiceId(null)
    setSelectedSlot(null)
    setSlotError('')
    setStep(2)
  }

  const handleSelectService = (id) => {
    setSelectedServiceId(id)
    setSelectedSlot(null)
    setStep(3)
  }

  const handleSelectSlot = (slot) => {
    setSelectedSlot(slot)
    setSlotError('')
    setStep(4)
  }

  const handleSubmit = () => {
    if (!form.name || !selectedServiceId || !selectedSlot || !selectedWorker) return
    addAppointment({
      clientName: form.name,
      initials: form.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase(),
      color: '#f5e8e4',
      textColor: '#8b5e52',
      workerId: selectedWorker.id,
      workerName: selectedWorker.name.split(' ')[0],
      service: selectedService?.name || '',
      price: selectedService?.price || 0,
      time: selectedSlot,
      endTime: selectedSlot,
      status: 'pending',
    })
    setSaved(true)
    setTimeout(() => navigate('/'), 1200)
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <TopBar title="Nueva cita" />

      <div className="flex-1 overflow-y-auto p-5">
        {/* Step indicators */}
        <div className="flex items-center gap-4 mb-6">
          <Step n={1} label="Profesional" active={step === 1} done={step > 1} />
          <div className="flex-1 h-px bg-gray-100" />
          <Step n={2} label="Servicio"    active={step === 2} done={step > 2} />
          <div className="flex-1 h-px bg-gray-100" />
          <Step n={3} label="Horario"     active={step === 3} done={step > 3} />
          <div className="flex-1 h-px bg-gray-100" />
          <Step n={4} label="Datos"       active={step === 4} done={saved} />
        </div>

        <div className="grid grid-cols-2 gap-6">
          {/* LEFT column */}
          <div className="space-y-5">

            {/* PASO 1 — Trabajadora */}
            <div>
              <p className="form-label">1. Elige la profesional</p>
              <div className="space-y-2">
                {WORKERS.map(w => {
                  const isSelected = selectedWorker?.id === w.id
                  return (
                    <button
                      key={w.id}
                      onClick={() => w.available && handleSelectWorker(w)}
                      disabled={!w.available}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all
                        ${!w.available ? 'opacity-40 cursor-not-allowed border-gray-100 bg-gray-50' : ''}
                        ${isSelected ? 'border-kr-rose bg-kr-rose-light' : w.available ? 'border-gray-100 hover:border-kr-rose-mid bg-white' : ''}
                      `}
                    >
                      <Avatar initials={w.initials} color={w.color} textColor={w.textColor} />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-800">{w.name}</p>
                        <p className="text-xs text-gray-400">{w.role}</p>
                      </div>
                      {!w.available && <span className="text-[10px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">No disponible hoy</span>}
                      {isSelected && <i className="ti ti-check text-kr-rose text-sm" />}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* PASO 3 — Horario */}
            {step >= 3 && selectedWorker && (
              <div>
                <p className="form-label">3. Elige el horario</p>
                {availableSlots.length === 0 ? (
                  <p className="text-xs text-red-400 bg-red-50 rounded-lg p-3">
                    <i className="ti ti-alert-circle mr-1" />
                    No hay horarios disponibles para {selectedWorker.name.split(' ')[0]} hoy.
                  </p>
                ) : (
                  <div className="grid grid-cols-4 gap-2">
                    {availableSlots.map(slot => (
                      <button
                        key={slot}
                        onClick={() => handleSelectSlot(slot)}
                        className={`py-2 rounded-lg text-xs font-medium border transition-all
                          ${selectedSlot === slot
                            ? 'bg-kr-rose text-white border-kr-rose'
                            : 'border-gray-200 text-gray-700 hover:border-kr-rose hover:bg-kr-rose-light'
                          }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                )}
                {slotError && <p className="text-xs text-red-500 mt-2">{slotError}</p>}
              </div>
            )}

            {/* PASO 4 — Datos del cliente */}
            {step >= 4 && (
              <div className="space-y-3">
                <p className="form-label">4. Datos de la clienta</p>
                <input className="form-input" type="text"  placeholder="Nombre" value={form.name}  onChange={set('name')} />
                <input className="form-input" type="tel"   placeholder="+56 9 ..." value={form.phone} onChange={set('phone')} />
                <input className="form-input" type="text"  placeholder="Notas (alergias, diseño...)" value={form.notes} onChange={set('notes')} />

                {/* WhatsApp notice */}
                <div className="flex items-center gap-2 p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                  <i className="ti ti-brand-whatsapp text-emerald-600" />
                  <p className="text-xs text-emerald-700">Confirmación automática por WhatsApp</p>
                </div>

                {/* Discount notice */}
                {discount.active && (
                  <div className="flex items-center gap-2 p-3 bg-amber-50 rounded-xl border border-amber-100">
                    <i className="ti ti-tag text-amber-600" />
                    <p className="text-xs text-amber-700">Descuento activo: <strong>{discount.label}</strong></p>
                  </div>
                )}

                <button
                  onClick={handleSubmit}
                  disabled={!form.name || saved}
                  className="btn-primary w-full justify-center py-2.5 disabled:opacity-40"
                >
                  {saved ? <><i className="ti ti-check" /> ¡Cita guardada!</> : <><i className="ti ti-check" /> Confirmar cita</>}
                </button>
              </div>
            )}
          </div>

          {/* RIGHT — Servicio */}
          <div>
            <p className="form-label mb-2">
              2. Elige el servicio
              {selectedWorker && <span className="ml-2 text-kr-rose font-normal">({selectedWorker.name.split(' ')[0]} · {selectedWorker.specialties.map(s => CATEGORY_LABELS[s]?.label).join(', ')})</span>}
            </p>

            {!selectedWorker ? (
              <div className="flex flex-col items-center justify-center h-40 text-gray-300 border-2 border-dashed border-gray-100 rounded-xl">
                <i className="ti ti-user-check text-3xl mb-2" />
                <p className="text-xs">Primero elige la profesional</p>
              </div>
            ) : (
              <>
                {/* Category tabs */}
                <div className="flex flex-wrap gap-1.5 mb-3">
                  <button onClick={() => setCatFilter('all')}
                    className={`text-xs px-3 py-1 rounded-full border transition-all ${catFilter === 'all' ? 'bg-kr-rose-light text-kr-rose-dark border-kr-rose' : 'border-gray-200 text-gray-500'}`}>
                    Todos
                  </button>
                  {CATEGORIES.filter(cat => selectedWorker.specialties.includes(cat)).map(cat => (
                    <button key={cat} onClick={() => setCatFilter(cat)}
                      className={`text-xs px-3 py-1 rounded-full border transition-all ${catFilter === cat ? 'bg-kr-rose-light text-kr-rose-dark border-kr-rose' : 'border-gray-200 text-gray-500'}`}>
                      {CATEGORY_LABELS[cat].label}
                    </button>
                  ))}
                </div>

                {/* Service list */}
                <div className="space-y-1.5 max-h-80 overflow-y-auto pr-1">
                  {filteredServices.map(svc => {
                    const discounted = applyDiscount(svc.price)
                    const isSelected = selectedServiceId === svc.id
                    return (
                      <button key={svc.id} onClick={() => handleSelectService(svc.id)}
                        className={`w-full flex items-center justify-between p-2.5 rounded-lg border text-left transition-all
                          ${isSelected ? 'border-kr-rose bg-kr-rose-light' : 'border-gray-100 hover:border-kr-rose-mid bg-white'}`}>
                        <div>
                          <p className="text-xs font-medium text-gray-800">{svc.name}</p>
                          {svc.detail && <p className="text-[10px] text-gray-400">{svc.detail}</p>}
                          <p className="text-[10px] text-gray-300">{svc.duration} min</p>
                        </div>
                        <PriceDisplay price={svc.price} discountedPrice={discounted} />
                      </button>
                    )
                  })}
                </div>

                {/* Resumen */}
                {selectedService && selectedSlot && (
                  <div className="mt-3 p-3 bg-kr-rose-light rounded-xl border border-kr-rose-mid text-xs space-y-1">
                    <p className="font-medium text-kr-rose-dark">Resumen de la cita</p>
                    <p className="text-gray-600"><i className="ti ti-user mr-1" />{selectedWorker.name}</p>
                    <p className="text-gray-600"><i className="ti ti-sparkles mr-1" />{selectedService.name}</p>
                    <p className="text-gray-600"><i className="ti ti-clock mr-1" />{selectedSlot} · {selectedService.duration} min</p>
                    <p className="text-gray-600 font-medium">
                      <i className="ti ti-cash mr-1" />
                      <PriceDisplay price={selectedService.price} discountedPrice={applyDiscount(selectedService.price)} />
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}