const express = require('express')
const { PrismaClient } = require('@prisma/client')

const router = express.Router()
const prisma = new PrismaClient()

router.post('/', async (req, res) => {
  try {
    const { clientId, serviceId, workerId, date, timeSlot } = req.body

    if (!clientId || !serviceId || !workerId || !date || !timeSlot) {
      return res.status(400).json({ error: 'Faltan datos para crear la cita' })
    }

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
    if (conflict) {
      return res.status(409).json({
        error: `El horario ${timeSlot} ya está reservado. Elige otro horario.`,
      })
    }

    const now = new Date()
    const apptDateTime = new Date(`${date}T${timeSlot}:00`)
      if (apptDateTime <= now) {
        return res.status(400).json({
         error: 'No puedes agendar una cita en una hora que ya pasó.'
      })
    }

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
        error: `Ya tienes una cita a las ${timeSlot} ese día.`,
      })
    }

    const appointment = await prisma.appointment.create({
      data: {
        clientId:  Number(clientId),
        serviceId: Number(serviceId),
        workerId:  Number(workerId),
        date:      new Date(date),
        timeSlot,
        status:    'pending',
      },
      include: { client: true, service: true, worker: true },
    })

    res.status(201).json(appointment)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router