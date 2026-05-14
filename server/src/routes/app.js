const express = require('express')
const cors    = require('cors')

const appointmentRoutes = require('./appointments')
const clientRoutes      = require('./clients')
const serviceRoutes     = require('./services')
const discountRoutes    = require('./discounts')
const authRoutes        = require('./auth')
const workerRoutes      = require('./workers')

const app = express()

app.use(cors({ origin: 'http://localhost:5173', credentials: true }))
app.use(express.json())

// Routes
app.use('/auth',         authRoutes)
app.use('/appointments', appointmentRoutes)
app.use('/clients',      clientRoutes)
app.use('/services',     serviceRoutes)
app.use('/discounts',    discountRoutes)
app.use('/workers',      workerRoutes)

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