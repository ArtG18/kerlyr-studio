const rateLimit = require('express-rate-limit')

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,

  message: {
    error: 'Demasiadas solicitudes. Intenta nuevamente más tarde.'
  },

  standardHeaders: true,
  legacyHeaders: false,
})

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,

  message: {
    error: 'Demasiados intentos de login. Intenta nuevamente en 15 minutos.'
  },

  standardHeaders: true,
  legacyHeaders: false,

  skipSuccessfulRequests: true,
})

const portalLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 20,

  message: {
    error: 'Has realizado demasiadas solicitudes. Intenta más tarde.'
  },

  standardHeaders: true,
  legacyHeaders: false,
})

module.exports = {
  generalLimiter,
  loginLimiter,
  portalLimiter
}