import { useState, useEffect } from 'react'
import { discountsApi } from '../../services/api'

export function useDiscount() {
  const [discount, setDiscount] = useState(null)
  const [loading, setLoading]   = useState(false)

  const fetchActive = async () => {
    setLoading(true)
    try {
      const { data } = await discountsApi.getActive()
      setDiscount(data)
    } catch {
      setDiscount(null)
    } finally {
      setLoading(false)
    }
  }

  const activate = async (payload) => {
    const { data } = await discountsApi.create(payload)
    setDiscount(data)
    return data
  }

  const deactivate = async () => {
    if (!discount) return
    await discountsApi.deactivate(discount.id)
    setDiscount(null)
  }

  /**
   * Aplica el descuento activo a un precio dado.
   * @param {number} price
   * @param {string} [category] — si el descuento solo aplica a ciertas categorías
   */
  const applyDiscount = (price, category) => {
    if (!discount) return price
    const cats = discount.categories ? discount.categories.split(',').filter(Boolean) : []
    if (cats.length > 0 && category && !cats.includes(category)) return price
    if (discount.type === 'percent') return Math.round(price * (1 - discount.value / 100))
    return Math.max(0, price - discount.value)
  }

  useEffect(() => { fetchActive() }, [])

  return { discount, loading, activate, deactivate, applyDiscount, refetch: fetchActive }
}