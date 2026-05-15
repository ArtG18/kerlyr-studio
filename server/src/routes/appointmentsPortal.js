const express = require('express')
const { PrismaClient } = require('@prisma/client')

const router = express.Router()
const prisma = new PrismaClient()

// POST /appointments/portal — crear cita desde el portal público
// Valida duplicados y envía WhatsApp de confirmación
router.post('/', async (req, res) => {
  try {
    const { clientId, serviceId, workerId, date, timeSlot } = req.body

    if (!clientId || !serviceId || !workerId || !date || !timeSlot) {
      return res.status(400).json({ error: 'Faltan datos para crear la cita' })
    }

    const apptDate = new Date(date)
    const start    = new Date(date); start.setHours(0,0,0,0)
    const end      = new Date(date); end.setHours(23,59,59,999)

    // ── Validar que el slot no esté ya tomado por esa trabajadora ────────────
    const conflict = await prisma.appointment.findFirst({
      where: {
        workerId: Number(workerId),
        timeSlot,
        date: { gte: start, lte: end },
        status: { not: 'cancelled' },
      },
    })
    if (conflict) {
      return res.status(409).json({
        error: `El horario ${timeSlot} ya está reservado. Por favor elige otro horario.`,
      })
    }

    // ── Validar que la misma clienta no tenga cita el mismo día/hora ─────────
    const clientConflict = await prisma.appointment.findFirst({
      where: {
        clientId: Number(clientId),
        timeSlot,
        date: { gte: start, lte: end },
        status: { not: 'cancelled' },
      },
    })
    if (clientConflict) {
      return res.status(409).json({
        error: `Ya tienes una cita agendada a las ${timeSlot} ese día.`,
      })
    }

    // ── Crear la cita ─────────────────────────────────────────────────────────
    const appointment = await prisma.appointment.create({
      data: {
        clientId:  Number(clientId),
        serviceId: Number(serviceId),
        workerId:  Number(workerId),
        date:      apptDate,
        timeSlot,
        status:    'pending',
      },
      include: { client: true, service: true, worker: true },
    })

    // ── Enviar WhatsApp de confirmación ───────────────────────────────────────
    try {
      const msg = confirmationMessage(
        appointment.client.name,
        formatDate(apptDate),
        timeSlot,
        appointment.service.name
      )
      await sendMessage(appointment.client.phone, msg)
    } catch (waErr) {
      // No fallar si WhatsApp falla, solo loguear
      console.error('[WhatsApp] Error enviando confirmación:', waErr.message)
    }

    res.status(201).json(appointment)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router