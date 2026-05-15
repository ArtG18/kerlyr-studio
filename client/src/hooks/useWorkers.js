import { useState, useEffect } from 'react'
import api from '../../services/api'

export function useWorkers() {
  const [workers, setWorkers]   = useState([])
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState(null)

  const fetchAll = async () => {
    setLoading(true)
    try {
      const { data } = await api.get('/workers')
      setWorkers(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  /**
   * Obtiene los slots disponibles para una trabajadora en una fecha
   * @param {number} workerId
   * @param {string} date — formato YYYY-MM-DD
   */
  const getSlots = async (workerId, date) => {
    const { data } = await api.get(`/workers/${workerId}/slots`, { params: { date } })
    return data // { availableSlots: [], bookedSlots: [] }
  }

  const setAvailability = async (id, available) => {
    const { data } = await api.patch(`/workers/${id}/availability`, { available })
    setWorkers(prev => prev.map(w => w.id === id ? data : w))
  }

  const create = async (payload) => {
    const { data } = await api.post('/workers', payload)
    setWorkers(prev => [...prev, data])
    return data
  }

  const update = async (id, payload) => {
    const { data } = await api.put(`/workers/${id}`, payload)
    setWorkers(prev => prev.map(w => w.id === id ? data : w))
    return data
  }

  useEffect(() => { fetchAll() }, [])

  return { workers, loading, error, getSlots, setAvailability, create, update, refetch: fetchAll }
}