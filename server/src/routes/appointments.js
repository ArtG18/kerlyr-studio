const express = require('express')
const { PrismaClient } = require('@prisma/client')
const auth = require('../middleware/auth')
const { sendMessage, confirmationMessage, reviewMessage } = require('../utils/whatsapp')

const router = express.Router()
const prisma = new PrismaClient()

// GET /appointments
router.get('/', auth, async (req, res) => {
  try {
    const { date, start, end } = req.query
    const where = {}
    if (date) {
      const s = new Date(date); s.setHours(0,0,0,0)
      const e = new Date(date); e.setHours(23,59,59,999)
      where.date = { gte: s, lte: e }
    } else if (start && end) {
      where.date = { gte: new Date(start), lte: new Date(end + 'T23:59:59') }
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
    const start = new Date(date); start.setHours(0,0,0,0)
    const end   = new Date(date); end.setHours(23,59,59,999)
    const conflict = await prisma.appointment.findFirst({
      where: { workerId: Number(workerId), timeSlot, date: { gte: start, lte: end }, status: { not: 'cancelled' } },
    })
    if (conflict) return res.status(409).json({ error: `El horario ${timeSlot} ya está reservado.` })
    const appt = await prisma.appointment.create({
      data: { clientId: Number(clientId), serviceId: Number(serviceId), workerId: Number(workerId), date: new Date(date), timeSlot, notes, status: 'pending' },
      include: { client: true, service: true, worker: true },
    })
    res.status(201).json(appt)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// PATCH /appointments/:id/status — cambiar estado + WhatsApp
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

    // Si se cancela → contar cancelaciones → blacklist
    if (status === 'cancelled') {
      const cancelCount = await prisma.appointment.count({ where: { clientId: appt.clientId, status: 'cancelled' } })
      if (cancelCount >= 5) await prisma.client.update({ where: { id: appt.clientId }, data: { tag: 'Blacklist' } })
    }

    // Si se completa → tag VIP/Frecuente + ingreso automático
    if (status === 'completed') {
      const completedCount = await prisma.appointment.count({ where: { clientId: appt.clientId, status: 'completed' } })
      if (completedCount >= 5) {
        await prisma.client.update({ where: { id: appt.clientId }, data: { tag: 'VIP' } })
      } else if (completedCount >= 3) {
        await prisma.client.update({ where: { id: appt.clientId }, data: { tag: 'Frecuente' } })
      }
      const yaExiste = await prisma.income.findUnique({ where: { appointmentId: appt.id } })
      if (!yaExiste) {
        const fecha = appt.date.toISOString().slice(0, 10)
        await prisma.income.create({
          data: { fecha, colaboradora: appt.worker?.name || 'Sin asignar', servicio: appt.service.name, monto: appt.service.price, metodo: 'Efectivo', nota: `Auto – ${appt.client.name}`, source: 'appointment', appointmentId: appt.id },
        })
      }
    }

    res.json(appt)

    // WhatsApp (fire-and-forget)
    try {
      const phone = appt.client?.phone
      if (phone) {
        const fechaFormato = new Date(appt.date).toLocaleDateString('es-CL', { weekday: 'long', day: 'numeric', month: 'long' })
        if (status === 'confirmed') {
          await sendMessage(phone, confirmationMessage(appt.client.name, fechaFormato, appt.timeSlot, appt.service.name))
        }
        if (status === 'completed') {
          await sendMessage(phone, reviewMessage())
        }
      }
    } catch (e) {
      console.error('[WhatsApp] Error:', e.message)
    }

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