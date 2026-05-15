const express = require('express')
const cors    = require('cors')

const appointmentRoutes       = require('./appointments')
const appointmentsPortalRoute = require('./appointmentsPortal')
const clientRoutes            = require('./clients')
const clientsPortalRoute      = require('./clientsPortal')
const serviceRoutes           = require('./services')
const discountRoutes          = require('./discounts')
const authRoutes              = require('./auth')
const workerRoutes            = require('./workers')

const app = express()

app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://kerlyr-studio-client.onrender.com'  // 
  ],
  credentials: true
}))

// Routes
app.use('/auth',                authRoutes)
app.use('/appointments',        appointmentRoutes)
app.use('/appointments/portal', appointmentsPortalRoute)  // público
app.use('/clients',             clientRoutes)
app.use('/clients/portal',      clientsPortalRoute)        // público
app.use('/services',            serviceRoutes)
app.use('/discounts',           discountRoutes)
app.use('/workers',             workerRoutes)

// Health check
app.get('/', (_req, res) => res.json({ status: 'ok', app: 'Kerlyr Studio API' }))

// 404
app.use((_req, res) => res.status(404).json({ error: 'Ruta no encontrada' }))

// Error handler
app.use((err, _req, res, _next) => {
  console.error(err)
  res.status(500).json({ error: 'Error interno del servidor' })
})

module.exports = app