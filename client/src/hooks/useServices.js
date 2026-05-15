import { useState, useEffect } from 'react'
import { servicesApi } from '../../services/api'

export function useServices() {
  const [services, setServices] = useState([])
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState(null)

  const fetchAll = async () => {
    setLoading(true)
    try {
      const { data } = await servicesApi.getAll()
      setServices(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const create = async (payload) => {
    const { data } = await servicesApi.create(payload)
    setServices(prev => [...prev, data])
    return data
  }

  const update = async (id, payload) => {
    const { data } = await servicesApi.update(id, payload)
    setServices(prev => prev.map(s => s.id === id ? data : s))
    return data
  }

  const remove = async (id) => {
    await servicesApi.delete(id)
    setServices(prev => prev.filter(s => s.id !== id))
  }

  useEffect(() => { fetchAll() }, [])

  return { services, loading, error, create, update, remove, refetch: fetchAll }
}