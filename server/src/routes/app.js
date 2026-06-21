const express = require('express')
const cors    = require('cors')
const morgan  = require('morgan')
const cron    = require('node-cron')
const { PrismaClient } = require('@prisma/client')
const { sendMessage, reminder24hMessage, reminder2hMessage } = require('./utils/whatsapp')

const {
  generalLimiter,
  loginLimiter,
  portalLimiter
} = require('./middleware/rateLimiter')

const appointmentRoutes       = require('./routes/appointments')
const appointmentsPortalRoute = require('./routes/appointmentsPortal')
const clientRoutes            = require('./routes/clients')
const clientsPortalRoute      = require('./routes/clientsPortal')
const serviceRoutes           = require('./routes/services')
const discountRoutes          = require('./routes/discounts')
const authRoutes              = require('./routes/auth')
const workerRoutes            = require('./routes/workers')

const app = express()

app.disable('x-powered-by')

app.set('trust proxy', 1)

app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://kerlyr-studio-client.onrender.com'
  ],
  credentials: true
}))

app.use(express.json())

app.use(morgan('combined'))

app.use(generalLimiter)

app.use('/auth', loginLimiter)

app.use('/appointments/portal', portalLimiter)

app.use('/auth', authRoutes)

app.use('/appointments/portal', appointmentsPortalRoute)
app.use('/appointments', appointmentRoutes)

app.use('/clients/portal', clientsPortalRoute)
app.use('/clients', clientRoutes)

app.use('/services', serviceRoutes)
app.use('/discounts', discountRoutes)
app.use('/workers', workerRoutes)

app.get('/', (_req, res) => {
  res.json({
    status: 'ok',
    app: 'Kerlyr Studio API'
  })
})

app.use((_req, res) => {
  res.status(404).json({
    error: 'Ruta no encontrada'
  })
})

app.use((err, _req, res, _next) => {
  console.error(err.stack)

  res.status(500).json({
    error:
      process.env.NODE_ENV === 'production'
        ? 'Error interno del servidor'
        : err.message
  })
})

module.exports = app

// ─── CRON: Recordatorios WhatsApp ──────────────────────────────────────────
const prismaApp = new PrismaClient()

// Cada 30 min verifica citas próximas
cron.schedule('*/30 * * * *', async () => {
  try {
    const ahora = new Date()

    // ── Recordatorio 24h antes ──
    const en24h     = new Date(ahora.getTime() + 24 * 60 * 60 * 1000)
    const en24hMin  = new Date(en24h.getTime() - 15 * 60 * 1000)
    const en24hMax  = new Date(en24h.getTime() + 15 * 60 * 1000)

    const citas24h = await prismaApp.appointment.findMany({
      where: { date: { gte: en24hMin, lte: en24hMax }, status: 'confirmed', reminder24Sent: false },
      include: { client: true },
    })
    for (const c of citas24h) {
      if (c.client?.phone) {
        await sendMessage(c.client.phone, reminder24hMessage(c.client.name, c.timeSlot))
        await prismaApp.appointment.update({ where: { id: c.id }, data: { reminder24Sent: true } })
        console.log(`[WhatsApp] Recordatorio 24h → ${c.client.name}`)
      }
    }

    // ── Recordatorio 2h antes ──
    const en2h    = new Date(ahora.getTime() + 2 * 60 * 60 * 1000)
    const en2hMin = new Date(en2h.getTime() - 15 * 60 * 1000)
    const en2hMax = new Date(en2h.getTime() + 15 * 60 * 1000)

    const citas2h = await prismaApp.appointment.findMany({
      where: { date: { gte: en2hMin, lte: en2hMax }, status: 'confirmed', reminder2Sent: false },
      include: { client: true },
    })
    for (const c of citas2h) {
      if (c.client?.phone) {
        await sendMessage(c.client.phone, reminder2hMessage(c.client.name, c.timeSlot))
        await prismaApp.appointment.update({ where: { id: c.id }, data: { reminder2Sent: true } })
        console.log(`[WhatsApp] Recordatorio 2h → ${c.client.name}`)
      }
    }

  } catch (e) {
    console.error('[Cron] Error recordatorios:', e.message)
  }
})