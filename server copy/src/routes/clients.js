const express = require('express')
const { PrismaClient } = require('@prisma/client')
const auth = require('../middleware/auth')

const router = express.Router()
const prisma = new PrismaClient()

// GET /clients
router.get('/', auth, async (req, res) => {
  try {
    const clients = await prisma.client.findMany({
      include: { appointments: { include: { service: true } } },
      orderBy: { name: 'asc' },
    })
    res.json(clients)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET /clients/:id
router.get('/:id', auth, async (req, res) => {
  try {
    const client = await prisma.client.findUnique({
      where: { id: Number(req.params.id) },
      include: { appointments: { include: { service: true }, orderBy: { date: 'desc' } } },
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
    const client = await prisma.client.create({
      data: { name, phone, notes },
    })
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

module.exports = router