const express = require('express')
const { PrismaClient } = require('@prisma/client')
const auth = require('../middleware/auth')

const router = express.Router()
const prisma = new PrismaClient()

// GET /clients — con stats calculadas en tiempo real
router.get('/', auth, async (req, res) => {
  try {
    const clients = await prisma.client.findMany({
      include: {
        appointments: {
          include: { service: true },
          orderBy: { date: 'desc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    // Calcular stats y tag automático
    const enriched = clients.map(c => {
      const completed  = c.appointments.filter(a => a.status === 'completed')
      const cancelled  = c.appointments.filter(a => a.status === 'cancelled')
      const totalSpent = completed.reduce((sum, a) => sum + (a.service?.price || 0), 0)
      const lastVisit  = completed[0]?.date || null

      // Tag automático
      let tag = c.tag
      if (cancelled.length >= 5) tag = 'Blacklist'
      else if (completed.length >= 5) tag = 'VIP'
      else if (completed.length >= 3) tag = 'Frecuente'
      else if (completed.length >= 1) tag = 'Regular'
      else tag = 'Nueva'

      return {
        ...c,
        totalVisits: completed.length,
        totalCancelled: cancelled.length,
        totalSpent,
        lastVisit,
        tag,
        appointments: c.appointments,
      }
    })

    res.json(enriched)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET /clients/:id — detalle con historial
router.get('/:id', auth, async (req, res) => {
  try {
    const client = await prisma.client.findUnique({
      where: { id: Number(req.params.id) },
      include: {
        appointments: {
          include: { service: true, worker: true },
          orderBy: { date: 'desc' },
        },
      },
    })
    if (!client) return res.status(404).json({ error: 'Cliente no encontrado' })
    res.json(client)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST /clients
router.post('/', auth, async (req, res) => {
  try {
    const { name, phone, notes } = req.body
    const client = await prisma.client.create({ data: { name, phone, notes } })
    res.status(201).json(client)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// PUT /clients/:id
router.put('/:id', auth, async (req, res) => {
  try {
    const { name, phone, notes, tag } = req.body
    const client = await prisma.client.update({
      where: { id: Number(req.params.id) },
      data: { name, phone, notes, tag },
    })
    res.json(client)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// PATCH /clients/:id/blacklist — agregar o quitar de lista negra manualmente
router.patch('/:id/blacklist', auth, async (req, res) => {
  try {
    const { blacklist } = req.body
    const client = await prisma.client.update({
      where: { id: Number(req.params.id) },
      data: { tag: blacklist ? 'Blacklist' : 'Regular' },
    })
    res.json(client)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// DELETE /clients/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    // Primero eliminar citas asociadas
    await prisma.appointment.deleteMany({ where: { clientId: Number(req.params.id) } })
    await prisma.client.delete({ where: { id: Number(req.params.id) } })
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router