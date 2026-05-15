import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/',
  headers: { 'Content-Type': 'application/json' },
})

// Attach JWT if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('kr_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// ─── Appointments ──────────────────────────────────────────────────────────
export const appointmentsApi = {
  getAll:  ()     => api.get('/appointments'),
  getById: (id)   => api.get(`/appointments/${id}`),
  create:  (data) => api.post('/appointments', data),
  update:  (id, data) => api.put(`/appointments/${id}`, data),
  delete:  (id)   => api.delete(`/appointments/${id}`),
}

// ─── Clients ───────────────────────────────────────────────────────────────
export const clientsApi = {
  getAll:  ()     => api.get('/clients'),
  getById: (id)   => api.get(`/clients/${id}`),
  create:  (data) => api.post('/clients', data),
  update:  (id, data) => api.put(`/clients/${id}`, data),
}

// ─── Services ──────────────────────────────────────────────────────────────
export const servicesApi = {
  getAll:  ()     => api.get('/services'),
  create:  (data) => api.post('/services', data),
  update:  (id, data) => api.put(`/services/${id}`, data),
  delete:  (id)   => api.delete(`/services/${id}`),
}

// ─── Discounts ─────────────────────────────────────────────────────────────
export const discountsApi = {
  getActive: ()     => api.get('/discounts/active'),
  create:    (data) => api.post('/discounts', data),
  deactivate:(id)   => api.patch(`/discounts/${id}/deactivate`),
}

export default api