const express = require('express')
const { PrismaClient } = require('@prisma/client')
const auth = require('../middleware/auth')

const router = express.Router()
const prisma = new PrismaClient()

// GET /services — público (lo usa el portal de clientes)
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

// GET /services/:id
router.get('/:id', async (req, res) => {
  try {
    const svc = await prisma.service.findUnique({
      where: { id: Number(req.params.id) },
    })
    if (!svc) return res.status(404).json({ error: 'Servicio no encontrado' })
    res.json(svc)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST /services — solo admin
router.post('/', auth, async (req, res) => {
  try {
    const { name, detail, price, duration, category } = req.body
    const svc = await prisma.service.create({
      data: { name, detail, price: Number(price), duration: Number(duration), category },
    })
    res.status(201).json(svc)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// PUT /services/:id
router.put('/:id', auth, async (req, res) => {
  try {
    const { name, detail, price, duration, category, active } = req.body
    const svc = await prisma.service.update({
      where: { id: Number(req.params.id) },
      data: {
        name, detail,
        price: price !== undefined ? Number(price) : undefined,
        duration: duration !== undefined ? Number(duration) : undefined,
        category, active,
      },
    })
    res.json(svc)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// DELETE /services/:id (soft delete)
router.delete('/:id', auth, async (req, res) => {
  try {
    await prisma.service.update({
      where: { id: Number(req.params.id) },
      data: { active: false },
    })
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router