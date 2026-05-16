const express = require('express')
const cors    = require('cors')

const appointmentRoutes       = require('./routes/appointments')
const appointmentsPortalRoute = require('./routes/appointmentsPortal')
const clientRoutes            = require('./routes/clients')
const clientsPortalRoute      = require('./routes/clientsPortal')
const serviceRoutes           = require('./routes/services')
const discountRoutes          = require('./routes/discounts')
const authRoutes              = require('./routes/auth')
const workerRoutes            = require('./routes/workers')

const app = express()

app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://kerlyr-studio-client.onrender.com'
  ],
  credentials: true
}))
app.use(express.json())

app.use('/auth',                authRoutes)
app.use('/appointments/portal', appointmentsPortalRoute)
app.use('/appointments',        appointmentRoutes)
app.use('/clients/portal',      clientsPortalRoute)
app.use('/clients',             clientRoutes)
app.use('/services',            serviceRoutes)
app.use('/discounts',           discountRoutes)
app.use('/workers',             workerRoutes)

app.get('/', (_req, res) => res.json({ status: 'ok', app: 'Kerlyr Studio API' }))

// Ruta temporal para ejecutar seed — ELIMINAR después de usar
app.get('/run-seed', async (_req, res) => {
  try {
    const { execSync } = require('child_process')
    execSync('npx prisma migrate deploy', { cwd: process.cwd() })
    execSync('node prisma/seed.js', { cwd: process.cwd() })
    res.json({ ok: true, message: 'Migración y seed ejecutados correctamente' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// 404 — debe ir al final
app.use((_req, res) => res.status(404).json({ error: 'Ruta no encontrada' }))

app.use((err, _req, res, _next) => {
  console.error(err)
  res.status(500).json({ error: 'Error interno del servidor' })
})

module.exports = app