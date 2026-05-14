const express = require('express')
const { PrismaClient } = require('@prisma/client')
const auth = require('../middleware/auth')

const router = express.Router()
const prisma = new PrismaClient()

const ALL_SLOTS = [
  '10:00','10:30','11:00','11:30','12:00','12:30',
  '13:00','13:30','14:00','14:30','15:00','15:30',
  '16:00','16:30','17:00','17:30','18:00','18:30',
]

// GET /workers — todas las trabajadoras (público, lo usa el portal y el form)
router.get('/', async (req, res) => {
  try {
    const workers = await prisma.worker.findMany({ orderBy: { name: 'asc' } })
    res.json(workers)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET /workers/:id/slots?date=2026-05-12
// Retorna los horarios LIBRES para esa trabajadora en esa fecha
router.get('/:id/slots', async (req, res) => {
  try {
    const workerId = Number(req.params.id)
    const { date } = req.query

    if (!date) return res.status(400).json({ error: 'Se requiere el parámetro date (YYYY-MM-DD)' })

    const start = new Date(date)
    start.setHours(0, 0, 0, 0)
    const end = new Date(date)
    end.setHours(23, 59, 59, 999)

    // Buscar citas ya agendadas para esa trabajadora en esa fecha
    const booked = await prisma.appointment.findMany({
      where: {
        workerId,
        date: { gte: start, lte: end },
        status: { not: 'cancelled' },
      },
      select: { timeSlot: true },
    })

    const bookedSlots = booked.map(a => a.timeSlot)
    const availableSlots = ALL_SLOTS.filter(slot => !bookedSlots.includes(slot))

    res.json({ workerId, date, bookedSlots, availableSlots })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST /workers — crear trabajadora (admin)
router.post('/', auth, async (req, res) => {
  try {
    const { name, role, specialties } = req.body
    const worker = await prisma.worker.create({
      data: {
        name,
        role,
        specialties: Array.isArray(specialties) ? specialties.join(',') : specialties,
      },
    })
    res.status(201).json(worker)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// PUT /workers/:id — actualizar (admin)
router.put('/:id', auth, async (req, res) => {
  try {
    const { name, role, specialties, available } = req.body
    const worker = await prisma.worker.update({
      where: { id: Number(req.params.id) },
      data: {
        name, role, available,
        specialties: specialties
          ? (Array.isArray(specialties) ? specialties.join(',') : specialties)
          : undefined,
      },
    })
    res.json(worker)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// PATCH /workers/:id/availability — marcar disponible/no disponible (admin)
router.patch('/:id/availability', auth, async (req, res) => {
  try {
    const { available } = req.body
    const worker = await prisma.worker.update({
      where: { id: Number(req.params.id) },
      data: { available },
    })
    res.json(worker)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router