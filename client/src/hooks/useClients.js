import { useState, useEffect } from 'react'
import { clientsApi } from '../services/api'

export function useClients() {
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)

  const fetchAll = async () => {
    setLoading(true)
    try {
      const { data } = await clientsApi.getAll()
      setClients(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const create = async (payload) => {
    const { data } = await clientsApi.create(payload)
    setClients(prev => [...prev, data])
    return data
  }

  const update = async (id, payload) => {
    const { data } = await clientsApi.update(id, payload)
    setClients(prev => prev.map(c => c.id === id ? data : c))
    return data
  }

  const remove = async (id) => {
    await clientsApi.delete(id)
    setClients(prev => prev.filter(c => c.id !== id))
  }

  useEffect(() => { fetchAll() }, [])

  return { clients, loading, error, create, update, refetch: fetchAll }
}