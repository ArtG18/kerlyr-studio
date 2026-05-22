import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import api from '../../services/api'
import { TopBar } from '../../components/UI'

const CATEGORIES = ['manicure','kapping','extensiones','pedicure','pestanas','cejas','depilacion']

const CAT_LABELS = {
  manicure:'Manicure',
  kapping:'Kapping',
  extensiones:'Extensiones',
  pedicure:'Pedicure',
  pestanas:'Pestañas',
  cejas:'Cejas',
  depilacion:'Depilación'
}

const CAT_ICONS = {
  manicure:'ti-sparkles',
  kapping:'ti-diamond',
  extensiones:'ti-stars',
  pedicure:'ti-droplet',
  pestanas:'ti-eye',
  cejas:'ti-brush',
  depilacion:'ti-scissors'
}

function ServicesSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-6 animate-pulse">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="bg-white border border-gray-100 rounded-2xl p-4 h-32" />
      ))}
    </div>
  )
}

function ServiceModal({ service, onClose, onSave }) {
  const [form, setForm] = useState({
    name: service?.name || '',
    detail: service?.detail || '',
    price: service?.price || '',
    duration: service?.duration || '',
    category: service?.category || 'manicure',
    active: service?.active ?? true,
  })

  const [saving, setSaving] = useState(false)

  const set = f => e => setForm(p => ({ ...p, [f]: e.target.value }))

  const handleSave = async () => {
    if (!form.name || !form.price || !form.duration) {
      toast.error('Completa todos los campos')
      return
    }

    setSaving(true)

    try {
      if (service?.id) {
        const { data } = await api.put(`/services/${service.id}`, form)
        onSave(data, 'edit')
        toast.success('Servicio actualizado ✨')
      } else {
        const { data } = await api.post('/services', form)
        onSave(data, 'create')
        toast.success('Servicio creado ✨')
      }

      onClose()
    } catch (err) {
      toast.error(err.response?.data?.error || 'Error al guardar')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-base font-medium text-gray-900">
            {service?.id ? 'Editar servicio' : 'Nuevo servicio'}
          </h3>

          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <i className="ti ti-x text-lg" />
          </button>
        </div>

        <div className="space-y-3">
          <div>
            <label className="form-label">Categoría</label>

            <select className="form-select" value={form.category} onChange={set('category')}>
              {CATEGORIES.map(c => (
                <option key={c} value={c}>
                  {CAT_LABELS[c]}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="form-label">Nombre del servicio</label>

            <input
              className="form-input"
              type="text"
              placeholder="Ej: Extensión Acrílico"
              value={form.name}
              onChange={set('name')}
            />
          </div>

          <div>
            <label className="form-label">Descripción</label>

            <input
              className="form-input"
              type="text"
              placeholder="Ej: Diseño incluido"
              value={form.detail}
              onChange={set('detail')}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="form-label">Precio</label>

              <input
                className="form-input"
                type="number"
                placeholder="25000"
                value={form.price}
                onChange={set('price')}
              />
            </div>

            <div>
              <label className="form-label">Duración</label>

              <input
                className="form-input"
                type="number"
                placeholder="60"
                value={form.duration}
                onChange={set('duration')}
              />
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-5">
          <button onClick={onClose} className="btn-outline flex-1 justify-center">
            Cancelar
          </button>

          <button
            onClick={handleSave}
            disabled={saving}
            className="btn-primary flex-1 justify-center disabled:opacity-40"
          >
            {saving ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function Services() {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null)

  const fetchServices = async () => {
    try {
      setLoading(true)

      const { data } = await api.get('/services/all')

      setServices(data)
    } catch {
      toast.error('No se pudieron cargar los servicios')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchServices()
  }, [])

  const handleSave = (saved, type) => {
    if (type === 'edit') {
      setServices(prev => prev.map(s => s.id === saved.id ? saved : s))
    } else {
      setServices(prev => [...prev, saved])
    }
  }

  const grouped = CATEGORIES.reduce((acc, cat) => {
    acc[cat] = services.filter(s => s.category === cat)
    return acc
  }, {})

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <TopBar title="Catálogo de servicios">
        <button className="btn-primary" onClick={() => setModal('new')}>
          <i className="ti ti-plus" /> Nuevo servicio
        </button>
      </TopBar>

      <div className="flex-1 overflow-y-auto p-5">
        {loading ? (
          <ServicesSkeleton />
        ) : (
          <div className="grid grid-cols-2 gap-x-6 gap-y-5">
            {Object.entries(grouped).map(([cat, svcs]) => svcs.length === 0 ? null : (
              <div key={cat}>
                <div className="flex items-center gap-2 mb-2.5">
                  <div className="w-6 h-6 rounded-md bg-kr-rose-light flex items-center justify-center">
                    <i className={`ti ${CAT_ICONS[cat]} text-sm text-kr-rose`} />
                  </div>

                  <h3 className="text-sm font-medium text-gray-800">
                    {CAT_LABELS[cat]}
                  </h3>
                </div>

                <div className="space-y-1.5">
                  {svcs.map(svc => (
                    <div
                      key={svc.id}
                      className="flex items-center gap-3 py-2 px-3 rounded-lg border bg-gray-50 border-gray-100"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-gray-800">
                          {svc.name}
                        </p>

                        <p className="text-[10px] text-gray-300">
                          {svc.duration} min
                        </p>
                      </div>

                      <p className="text-xs font-semibold text-gray-700 flex-shrink-0">
                        ${Number(svc.price).toLocaleString('es-CL')}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {modal && (
        <ServiceModal
          service={modal === 'new' ? null : modal}
          onClose={() => setModal(null)}
          onSave={handleSave}
        />
      )}
    </div>
  )
}
