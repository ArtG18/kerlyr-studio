const express = require('express')
const { PrismaClient } = require('@prisma/client')
const auth = require('../middleware/auth')

const router = express.Router()
const prisma = new PrismaClient()

// GET /appointments — citas reales con filtro por fecha
router.get('/', auth, async (req, res) => {
  try {
    const { date } = req.query

    const where = {}
    if (date) {
      const start = new Date(date); start.setHours(0,0,0,0)
      const end   = new Date(date); end.setHours(23,59,59,999)
      where.date  = { gte: start, lte: end }
    }

    const appointments = await prisma.appointment.findMany({
      where,
      include: { client: true, service: true, worker: true },
      orderBy: { timeSlot: 'asc' },
    })
    res.json(appointments)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET /appointments/today — citas de hoy
router.get('/today', auth, async (req, res) => {
  try {
    const start = new Date(); start.setHours(0,0,0,0)
    const end   = new Date(); end.setHours(23,59,59,999)

    const appointments = await prisma.appointment.findMany({
      where: { date: { gte: start, lte: end } },
      include: { client: true, service: true, worker: true },
      orderBy: { timeSlot: 'asc' },
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
      include: { client: true, service: true, worker: true },
    })
    if (!appt) return res.status(404).json({ error: 'Cita no encontrada' })
    res.json(appt)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST /appointments — crear cita desde admin
router.post('/', auth, async (req, res) => {
  try {
    const { clientId, serviceId, workerId, date, timeSlot, notes } = req.body

    // Validar duplicado
    const start = new Date(date); start.setHours(0,0,0,0)
    const end   = new Date(date); end.setHours(23,59,59,999)

    const conflict = await prisma.appointment.findFirst({
      where: {
        workerId: Number(workerId),
        timeSlot,
        date: { gte: start, lte: end },
        status: { not: 'cancelled' },
      },
    })
    if (conflict) return res.status(409).json({ error: `El horario ${timeSlot} ya está reservado.` })

    const appt = await prisma.appointment.create({
      data: {
        clientId:  Number(clientId),
        serviceId: Number(serviceId),
        workerId:  Number(workerId),
        date:      new Date(date),
        timeSlot,
        notes,
        status: 'pending',
      },
      include: { client: true, service: true, worker: true },
    })
    res.status(201).json(appt)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// PATCH /appointments/:id/status — confirmar o cancelar
router.patch('/:id/status', auth, async (req, res) => {
  try {
    const { status } = req.body
    if (!['pending','confirmed','cancelled','completed'].includes(status)) {
      return res.status(400).json({ error: 'Estado inválido' })
    }

    const appt = await prisma.appointment.update({
      where: { id: Number(req.params.id) },
      data: { status },
      include: { client: true, service: true, worker: true },
    })

    // Si se cancela, verificar si la clienta llega a 5 cancelaciones → lista negra
    if (status === 'cancelled') {
      const cancelCount = await prisma.appointment.count({
        where: { clientId: appt.clientId, status: 'cancelled' },
      })
      if (cancelCount >= 5) {
        await prisma.client.update({
          where: { id: appt.clientId },
          data: { tag: 'Blacklist' },
        })
      }
    }

    // Si se completa, verificar si la clienta llega a 5 citas completadas → VIP
    if (status === 'completed') {
      const completedCount = await prisma.appointment.count({
        where: { clientId: appt.clientId, status: 'completed' },
      })
      if (completedCount >= 5) {
        await prisma.client.update({
          where: { id: appt.clientId },
          data: { tag: 'VIP' },
        })
      } else if (completedCount >= 3) {
        await prisma.client.update({
          where: { id: appt.clientId },
          data: { tag: 'Frecuente' },
        })
      }
    }

    res.json(appt)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// DELETE /appointments/:id — eliminar cita
router.delete('/:id', auth, async (req, res) => {
  try {
    await prisma.appointment.delete({ where: { id: Number(req.params.id) } })
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router