import { useState, useEffect } from 'react'
import api from '../../services/api'
import { TopBar } from '../../components/UI'

const CATEGORIES = ['manicure','kapping','extensiones','pedicure','pestanas','cejas','depilacion']
const CAT_LABELS = {
  manicure:'Manicure', kapping:'Kapping', extensiones:'Extensiones',
  pedicure:'Pedicure', pestanas:'Pestañas', cejas:'Cejas', depilacion:'Depilación'
}
const CAT_ICONS = {
  manicure:'ti-sparkles', kapping:'ti-diamond', extensiones:'ti-stars',
  pedicure:'ti-droplet', pestanas:'ti-eye', cejas:'ti-brush', depilacion:'ti-scissors'
}

function ServiceModal({ service, onClose, onSave }) {
  const [form, setForm] = useState({
    name:     service?.name     || '',
    detail:   service?.detail   || '',
    price:    service?.price    || '',
    duration: service?.duration || '',
    category: service?.category || 'manicure',
    active:   service?.active   ?? true,
  })
  const [saving, setSaving] = useState(false)

  const set = f => e => setForm(p => ({ ...p, [f]: e.target.value }))

  const handleSave = async () => {
    if (!form.name || !form.price || !form.duration) return
    setSaving(true)
    try {
      if (service?.id) {
        const { data } = await api.put(`/services/${service.id}`, form)
        onSave(data, 'edit')
      } else {
        const { data } = await api.post('/services', form)
        onSave(data, 'create')
      }
      onClose()
    } catch (err) {
      alert(err.response?.data?.error || 'Error al guardar')
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
              {CATEGORIES.map(c => <option key={c} value={c}>{CAT_LABELS[c]}</option>)}
            </select>
          </div>
          <div>
            <label className="form-label">Nombre del servicio</label>
            <input className="form-input" type="text" placeholder="Ej: Extensión Acrílico" value={form.name} onChange={set('name')} />
          </div>
          <div>
            <label className="form-label">Descripción (opcional)</label>
            <input className="form-input" type="text" placeholder="Ej: Sin pretinas incluidas" value={form.detail} onChange={set('detail')} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="form-label">Precio (CLP)</label>
              <input className="form-input" type="number" placeholder="25000" value={form.price} onChange={set('price')} />
            </div>
            <div>
              <label className="form-label">Duración (min)</label>
              <input className="form-input" type="number" placeholder="60" value={form.duration} onChange={set('duration')} />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="active" checked={form.active}
              onChange={e => setForm(p => ({ ...p, active: e.target.checked }))}
              className="rounded" />
            <label htmlFor="active" className="text-sm text-gray-600">Servicio activo (visible para clientes)</label>
          </div>
        </div>

        <div className="flex gap-3 mt-5">
          <button onClick={onClose} className="btn-outline flex-1 justify-center">Cancelar</button>
          <button onClick={handleSave} disabled={saving || !form.name || !form.price}
            className="btn-primary flex-1 justify-center disabled:opacity-40">
            {saving ? <><i className="ti ti-loader-2 animate-spin" /> Guardando...</> : <><i className="ti ti-check" /> Guardar</>}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function Services() {
  const [services, setServices] = useState([])
  const [loading,  setLoading]  = useState(true)
  const [modal,    setModal]    = useState(null) // null | 'new' | service object

  const fetchServices = async () => {
    try {
      setLoading(true)
      const { data } = await api.get('/services/all')
      setServices(data)
    } catch {
      // silencioso
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchServices() }, [])

  const handleSave = (saved, type) => {
    if (type === 'edit') {
      setServices(prev => prev.map(s => s.id === saved.id ? saved : s))
    } else {
      setServices(prev => [...prev, saved])
    }
  }

  const toggleActive = async (svc) => {
    try {
      const { data } = await api.put(`/services/${svc.id}`, { ...svc, active: !svc.active })
      setServices(prev => prev.map(s => s.id === data.id ? data : s))
    } catch { alert('Error al actualizar') }
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
          <div className="text-center py-12 text-gray-400">
            <i className="ti ti-loader-2 animate-spin text-3xl mb-2 block" />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-x-6 gap-y-5">
            {Object.entries(grouped).map(([cat, svcs]) => svcs.length === 0 ? null : (
              <div key={cat}>
                <div className="flex items-center gap-2 mb-2.5">
                  <div className="w-6 h-6 rounded-md bg-kr-rose-light flex items-center justify-center">
                    <i className={`ti ${CAT_ICONS[cat]} text-sm text-kr-rose`} />
                  </div>
                  <h3 className="text-sm font-medium text-gray-800">{CAT_LABELS[cat]}</h3>
                </div>
                <div className="space-y-1.5">
                  {svcs.map(svc => (
                    <div key={svc.id}
                      className={`flex items-center gap-3 py-2 px-3 rounded-lg border transition-all
                        ${svc.active ? 'bg-gray-50 border-gray-100' : 'bg-gray-50/50 border-dashed border-gray-200 opacity-60'}`}>
                      <div className="flex-1 min-w-0">
                        <p className={`text-xs font-medium ${svc.active ? 'text-gray-800' : 'text-gray-400'}`}>{svc.name}</p>
                        {svc.detail && <p className="text-[10px] text-gray-400">{svc.detail}</p>}
                        <p className="text-[10px] text-gray-300">{svc.duration} min</p>
                      </div>
                      <p className="text-xs font-semibold text-gray-700 flex-shrink-0">
                        ${Number(svc.price).toLocaleString('es-CL')}
                      </p>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <button onClick={() => setModal(svc)} title="Editar"
                          className="w-7 h-7 rounded-lg bg-blue-50 text-blue-500 hover:bg-blue-100 flex items-center justify-center transition-colors">
                          <i className="ti ti-pencil text-sm" />
                        </button>
                        <button onClick={() => toggleActive(svc)} title={svc.active ? 'Desactivar' : 'Activar'}
                          className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors
                            ${svc.active ? 'bg-amber-50 text-amber-500 hover:bg-amber-100' : 'bg-emerald-50 text-emerald-500 hover:bg-emerald-100'}`}>
                          <i className={`ti ${svc.active ? 'ti-eye-off' : 'ti-eye'} text-sm`} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-5 p-3 bg-gray-50 rounded-xl border border-gray-100 flex items-center gap-2 text-xs text-gray-400">
          <i className="ti ti-info-circle" />
          Los servicios desactivados no aparecen en el portal de clientes pero se mantienen en el historial.
        </div>
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