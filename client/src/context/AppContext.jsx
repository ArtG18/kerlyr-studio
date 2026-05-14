import { createContext, useContext, useState } from 'react'
import { SERVICES, CLIENTS, TODAY_APPOINTMENTS } from '../data/mockData'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [services, setServices] = useState(SERVICES)
  const [clients, setClients] = useState(CLIENTS)
  const [appointments, setAppointments] = useState(TODAY_APPOINTMENTS)

  // ─── DISCOUNT STATE ────────────────────────────────────────────────────────
  const [discount, setDiscount] = useState({
    active: false,
    type: 'percent',   // 'percent' | 'fixed'
    value: 0,
    label: '',
    categories: [],    // empty = all categories
  })

  // Apply discount to a price
  const applyDiscount = (price) => {
    if (!discount.active || !discount.value) return price
    if (discount.type === 'percent') {
      return Math.round(price * (1 - discount.value / 100))
    }
    return Math.max(0, price - discount.value)
  }

  // ─── APPOINTMENTS ─────────────────────────────────────────────────────────
  const addAppointment = (appt) => {
    setAppointments(prev => [...prev, { ...appt, id: Date.now() }])
  }

  const updateAppointmentStatus = (id, status) => {
    setAppointments(prev =>
      prev.map(a => a.id === id ? { ...a, status } : a)
    )
  }

  // ─── CLIENTS ──────────────────────────────────────────────────────────────
  const addClient = (client) => {
    setClients(prev => [...prev, { ...client, id: Date.now(), visits: 0, total: 0 }])
  }

  return (
    <AppContext.Provider value={{
      services,
      clients,
      appointments,
      discount,
      setDiscount,
      applyDiscount,
      addAppointment,
      updateAppointmentStatus,
      addClient,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used inside AppProvider')
  return ctx
}