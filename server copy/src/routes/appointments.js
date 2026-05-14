const express = require('express')
const { PrismaClient } = require('@prisma/client')
const auth = require('../middleware/auth')

const router = express.Router()
const prisma = new PrismaClient()

// GET /appointments — todas las citas (protegido)
router.get('/', auth, async (req, res) => {
  try {
    const appointments = await prisma.appointment.findMany({
      include: { client: true, service: true },
      orderBy: { date: 'asc' },
    })
    res.json(appointments)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET /appointments/:id
router.get('/:id', auth, async (req, res) => {
  try {
    const appt = await prisma.appointment.findUnique({
      where: { id: Number(req.params.id) },
      include: { client: true, service: true },
    })
    if (!appt) return res.status(404).json({ error: 'Cita no encontrada' })
    res.json(appt)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST /appointments — crear cita
router.post('/', auth, async (req, res) => {
  try {
    const { clientId, serviceId, date, timeSlot, notes } = req.body
    const appt = await prisma.appointment.create({
      data: {
        clientId: Number(clientId),
        serviceId: Number(serviceId),
        date: new Date(date),
        timeSlot,
        notes,
        status: 'pending',
      },
      include: { client: true, service: true },
    })
    res.status(201).json(appt)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// PUT /appointments/:id — actualizar
router.put('/:id', auth, async (req, res) => {
  try {
    const { status, notes, date, timeSlot } = req.body
    const appt = await prisma.appointment.update({
      where: { id: Number(req.params.id) },
      data: { status, notes, date: date ? new Date(date) : undefined, timeSlot },
      include: { client: true, service: true },
    })
    res.json(appt)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// DELETE /appointments/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    await prisma.appointment.delete({ where: { id: Number(req.params.id) } })
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router