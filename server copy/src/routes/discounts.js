const express = require('express')
const { PrismaClient } = require('@prisma/client')
const auth = require('../middleware/auth')

const router = express.Router()
const prisma = new PrismaClient()

// GET /discounts/active — descuento activo actual (público, lo usa el portal)
router.get('/active', async (req, res) => {
  try {
    const discount = await prisma.discount.findFirst({
      where: { active: true },
      orderBy: { createdAt: 'desc' },
    })
    res.json(discount || null)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET /discounts — historial completo (admin)
router.get('/', auth, async (req, res) => {
  try {
    const discounts = await prisma.discount.findMany({
      orderBy: { createdAt: 'desc' },
    })
    res.json(discounts)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST /discounts — crear y activar descuento
router.post('/', auth, async (req, res) => {
  try {
    const { label, type, value, categories } = req.body

    // Desactivar el descuento anterior
    await prisma.discount.updateMany({
      where: { active: true },
      data: { active: false },
    })

    const discount = await prisma.discount.create({
      data: {
        label,
        type,          // 'percent' | 'fixed'
        value: Number(value),
        categories: Array.isArray(categories) ? categories.join(',') : (categories || ''),
        active: true,
      },
    })
    res.status(201).json(discount)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// PATCH /discounts/:id/deactivate
router.patch('/:id/deactivate', auth, async (req, res) => {
  try {
    const discount = await prisma.discount.update({
      where: { id: Number(req.params.id) },
      data: { active: false },
    })
    res.json(discount)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// DELETE — desactivar todos
router.delete('/deactivate-all', auth, async (req, res) => {
  try {
    await prisma.discount.updateMany({ where: { active: true }, data: { active: false } })
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router