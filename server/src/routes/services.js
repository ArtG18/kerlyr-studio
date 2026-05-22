const express = require('express')
const { PrismaClient } = require('@prisma/client')
const { body, param, validationResult } = require('express-validator')

const auth = require('../middleware/auth')

const router = express.Router()
const prisma = new PrismaClient()

const serviceValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('El nombre es obligatorio')
    .isLength({ min: 2, max: 100 })
    .withMessage('El nombre debe tener entre 2 y 100 caracteres'),

  body('detail')
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage('El detalle es demasiado largo'),

  body('price')
    .notEmpty()
    .withMessage('El precio es obligatorio')
    .isNumeric()
    .withMessage('El precio debe ser numérico')
    .custom(value => Number(value) >= 0)
    .withMessage('El precio no puede ser negativo'),

  body('duration')
    .notEmpty()
    .withMessage('La duración es obligatoria')
    .isInt({ min: 1, max: 600 })
    .withMessage('La duración debe estar entre 1 y 600 minutos'),

  body('category')
    .trim()
    .notEmpty()
    .withMessage('La categoría es obligatoria')
    .isLength({ min: 2, max: 50 })
    .withMessage('Categoría inválida'),
]

const idValidation = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('ID inválido'),
]

const validate = (req, res, next) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
    })
  }

  next()
}

router.get('/', async (req, res) => {
  try {
    const services = await prisma.service.findMany({
      where: { active: true },
      orderBy: [{ category: 'asc' }, { name: 'asc' }],
    })

    res.json(services)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.get('/all', auth, async (req, res) => {
  try {
    const services = await prisma.service.findMany({
      orderBy: [{ category: 'asc' }, { name: 'asc' }],
    })

    res.json(services)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.get('/:id', idValidation, validate, async (req, res) => {
  try {
    const svc = await prisma.service.findUnique({
      where: {
        id: Number(req.params.id),
      },
    })

    if (!svc) {
      return res.status(404).json({
        error: 'Servicio no encontrado',
      })
    }

    res.json(svc)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.post(
  '/',
  auth,
  serviceValidation,
  validate,
  async (req, res) => {
    try {
      const { name, detail, price, duration, category } = req.body

      const svc = await prisma.service.create({
        data: {
          name,
          detail,
          price: Number(price),
          duration: Number(duration),
          category,
        },
      })

      res.status(201).json(svc)
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  }
)

router.put(
  '/:id',
  auth,
  idValidation,
  serviceValidation,
  validate,
  async (req, res) => {
    try {
      const {
        name,
        detail,
        price,
        duration,
        category,
        active,
      } = req.body

      const svc = await prisma.service.update({
        where: {
          id: Number(req.params.id),
        },

        data: {
          name,
          detail,
          price: Number(price),
          duration: Number(duration),
          category,
          active,
        },
      })

      res.json(svc)
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  }
)

router.delete(
  '/:id',
  auth,
  idValidation,
  validate,
  async (req, res) => {
    try {
      await prisma.service.update({
        where: {
          id: Number(req.params.id),
        },

        data: {
          active: false,
        },
      })

      res.json({ success: true })
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  }
)

module.exports = router