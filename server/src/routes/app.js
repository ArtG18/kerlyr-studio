const express   = require('express')
const cors      = require('cors')
const helmet    = require('helmet')

const {
  generalLimiter,
  loginLimiter,
  portalLimiter
} = require('./middleware/rateLimiter')

const appointmentRoutes          = require('./routes/appointments')
const appointmentsPortalRoute    = require('./routes/appointmentsPortal')
const clientRoutes               = require('./routes/clients')
const clientsPortalRoute         = require('./routes/clientsPortal')
const serviceRoutes              = require('./routes/services')
const discountRoutes             = require('./routes/discounts')
const authRoutes                 = require('./routes/auth')
const workerRoutes               = require('./routes/workers')

const app = express()

app.set('trust proxy', 1)

app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://kerlyr-studio-client.onrender.com'
  ],
  credentials: true
}))

app.use(express.json())

app.use(helmet())

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
  console.error(err)

  res.status(500).json({
    error: 'Error interno del servidor'
  })
})

module.exports = app