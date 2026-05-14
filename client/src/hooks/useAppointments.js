import { useState, useEffect } from 'react'
import { appointmentsApi } from '../services/api'

/**
 * Hook para gestionar citas.
 * Cuando el backend esté conectado, reemplaza los datos mock por llamadas reales.
 */
export function useAppointments() {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)

  const fetchAll = async () => {
    setLoading(true)
    try {
      const { data } = await appointmentsApi.getAll()
      setAppointments(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const create = async (payload) => {
    const { data } = await appointmentsApi.create(payload)
    setAppointments(prev => [...prev, data])
    return data
  }

  const updateStatus = async (id, status) => {
    const { data } = await appointmentsApi.update(id, { status })
    setAppointments(prev => prev.map(a => a.id === id ? data : a))
    return data
  }

  const remove = async (id) => {
    await appointmentsApi.delete(id)
    setAppointments(prev => prev.filter(a => a.id !== id))
  }

  useEffect(() => { fetchAll() }, [])

  return { appointments, loading, error, create, updateStatus, remove, refetch: fetchAll }
}