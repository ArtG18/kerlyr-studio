import { useState, useEffect } from 'react'
import api from '../../services/api'
import { TopBar, Avatar } from '../../components/UI'

const CATEGORIES = ['manicure','kapping','extensiones','pedicure','pestanas','cejas','depilacion']
const CAT_LABELS = {
  manicure:'Manicure', kapping:'Kapping', extensiones:'Extensiones',
  pedicure:'Pedicure', pestanas:'Pestañas', cejas:'Cejas', depilacion:'Depilación'
}

function WorkerModal({ worker, onClose, onSave }) {
  const [form, setForm] = useState({
    name:       worker?.name       || '',
    role:       worker?.role       || '',
    specialties: worker?.specialties
      ? worker.specialties.split(',').filter(Boolean)
      : [],
    available:  worker?.available  ?? true,
  })
  const [saving, setSaving] = useState(false)

  const toggleCat = (cat) => {
    setForm(f => ({
      ...f,
      specialties: f.specialties.includes(cat)
        ? f.specialties.filter(c => c !== cat)
        : [...f.specialties, cat],
    }))
  }

  const handleSave = async () => {
    if (!form.name || form.specialties.length === 0) return
    setSaving(true)
    try {
      const payload = {
        name:       form.name,
        role:       form.role,
        specialties: form.specialties.join(','),
        available:  form.available,
      }
      if (worker?.id) {
        const { data } = await api.put(`/workers/${worker.id}`, payload)
        onSave(data, 'edit')
      } else {
        const { data } = await api.post('/workers', payload)
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
            {worker?.id ? 'Editar trabajadora' : 'Nueva trabajadora'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <i className="ti ti-x text-lg" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="form-label">Nombre completo</label>
            <input className="form-input" type="text" placeholder="Ej: Valentina Soto"
              value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
          </div>
          <div>
            <label className="form-label">Rol / Cargo</label>
            <input className="form-input" type="text" placeholder="Ej: Especialista pestañas y cejas"
              value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} />
          </div>

          <div>
            <label className="form-label">Especialidades (selecciona las que aplican)</label>
            <div className="flex flex-wrap gap-2 mt-1">
              {CATEGORIES.map(cat => (
                <button key={cat} type="button" onClick={() => toggleCat(cat)}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-all
                    ${form.specialties.includes(cat)
                      ? 'bg-kr-rose-light text-kr-rose-dark border-kr-rose font-medium'
                      : 'border-gray-200 text-gray-500 hover:border-gray-300'
                    }`}>
                  {CAT_LABELS[cat]}
                </button>
              ))}
            </div>
            {form.specialties.length === 0 && (
              <p className="text-xs text-red-400 mt-1">Selecciona al menos una especialidad</p>
            )}
          </div>

          <div className="flex items-center gap-3">
            <input type="checkbox" id="available" checked={form.available}
              onChange={e => setForm(f => ({ ...f, available: e.target.checked }))}
              className="rounded" />
            <label htmlFor="available" className="text-sm text-gray-600">
              Disponible para recibir citas
            </label>
          </div>
        </div>

        <div className="flex gap-3 mt-5">
          <button onClick={onClose} className="btn-outline flex-1 justify-center">Cancelar</button>
          <button onClick={handleSave}
            disabled={saving || !form.name || form.specialties.length === 0}
            className="btn-primary flex-1 justify-center disabled:opacity-40">
            {saving
              ? <><i className="ti ti-loader-2 animate-spin" /> Guardando...</>
              : <><i className="ti ti-check" /> Guardar</>
            }
          </button>
        </div>
      </div>
    </div>
  )
}

export default function Workers() {
  const [workers, setWorkers] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal,   setModal]   = useState(null) // null | 'new' | worker object

  const fetchWorkers = async () => {
    try {
      setLoading(true)
      const { data } = await api.get('/workers')
      setWorkers(data)
    } catch {
      // silencioso
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchWorkers() }, [])

  const handleSave = (saved, type) => {
    if (type === 'edit') {
      setWorkers(prev => prev.map(w => w.id === saved.id ? saved : w))
    } else {
      setWorkers(prev => [...prev, saved])
    }
  }

  const [confirmDelete, setConfirmDelete] = useState(null) // worker id a eliminar

  const deleteWorker = async (id) => {
    try {
      await api.delete(`/workers/${id}`)
      setWorkers(prev => prev.filter(w => w.id !== id))
      setConfirmDelete(null)
    } catch {
      alert('Error al eliminar la trabajadora')
    }
  }

  const toggleAvailability = async (worker) => {
    try {
      const { data } = await api.put(`/workers/${worker.id}`, {
        available: !worker.available,
      })
      setWorkers(prev => prev.map(w => w.id === data.id ? data : w))
    } catch {
      alert('Error al actualizar disponibilidad')
    }
  }

  const getInitials = (name) =>
    name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <TopBar title="Trabajadoras">
        <button className="btn-primary" onClick={() => setModal('new')}>
          <i className="ti ti-plus" /> Nueva trabajadora
        </button>
      </TopBar>

      <div className="flex-1 overflow-y-auto p-5">
        {loading ? (
          <div className="text-center py-12 text-gray-400">
            <i className="ti ti-loader-2 animate-spin text-3xl block mb-2" />
          </div>
        ) : workers.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <i className="ti ti-users text-4xl block mb-3" />
            <p className="text-sm">No hay trabajadoras registradas</p>
            <button onClick={() => setModal('new')} className="btn-primary mx-auto mt-4">
              <i className="ti ti-plus" /> Agregar primera trabajadora
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {workers.map(w => {
              const specialties = w.specialties
                ? w.specialties.split(',').filter(Boolean).map(c => CAT_LABELS[c]).filter(Boolean)
                : []
              return (
                <div key={w.id} className={`card flex items-center gap-4 transition-all
                  ${!w.available ? 'opacity-60' : ''}`}>
                  <Avatar initials={getInitials(w.name)} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-gray-900">{w.name}</p>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium
                        ${w.available
                          ? 'bg-emerald-50 text-emerald-600'
                          : 'bg-gray-100 text-gray-400'
                        }`}>
                        {w.available ? 'Disponible' : 'No disponible'}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">{w.role}</p>
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {specialties.map(s => (
                        <span key={s} className="text-[10px] bg-kr-rose-light text-kr-rose-dark px-2 py-0.5 rounded-full">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button onClick={() => toggleAvailability(w)}
                      title={w.available ? 'Marcar no disponible' : 'Marcar disponible'}
                      className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors
                        ${w.available
                          ? 'bg-amber-50 text-amber-500 hover:bg-amber-100'
                          : 'bg-emerald-50 text-emerald-500 hover:bg-emerald-100'
                        }`}>
                      <i className={`ti ${w.available ? 'ti-pause' : 'ti-play'} text-sm`} />
                    </button>
                    <button onClick={() => setModal(w)}
                      className="w-8 h-8 rounded-lg bg-blue-50 text-blue-500 hover:bg-blue-100 flex items-center justify-center transition-colors">
                      <i className="ti ti-pencil text-sm" />
                    </button>
                    {confirmDelete === w.id ? (
                      <div className="flex items-center gap-1">
                        <button onClick={() => deleteWorker(w.id)}
                          className="text-[10px] bg-red-500 text-white px-2 py-1 rounded-lg hover:bg-red-600 font-medium">
                          Sí, eliminar
                        </button>
                        <button onClick={() => setConfirmDelete(null)}
                          className="text-[10px] bg-gray-100 text-gray-500 px-2 py-1 rounded-lg hover:bg-gray-200">
                          Cancelar
                        </button>
                      </div>
                    ) : (
                      <button onClick={() => setConfirmDelete(w.id)}
                        title="Eliminar trabajadora"
                        className="w-8 h-8 rounded-lg bg-red-50 text-red-400 hover:bg-red-100 flex items-center justify-center transition-colors">
                        <i className="ti ti-trash text-sm" />
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        <div className="mt-4 p-3 bg-gray-50 rounded-xl border border-gray-100 flex items-center gap-2 text-xs text-gray-400">
          <i className="ti ti-info-circle" />
          Las trabajadoras marcadas como "No disponible" no aparecen en el portal de clientas.
        </div>
      </div>

      {modal && (
        <WorkerModal
          worker={modal === 'new' ? null : modal}
          onClose={() => setModal(null)}
          onSave={handleSave}
        />
      )}
    </div>
  )
}