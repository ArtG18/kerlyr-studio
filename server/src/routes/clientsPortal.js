const express = require('express')
const { PrismaClient } = require('@prisma/client')

const router = express.Router()
const prisma = new PrismaClient()

router.post('/', async (req, res) => {
  try {
    const { name, phone } = req.body
    if (!name || !phone) {
      return res.status(400).json({ error: 'Nombre y teléfono son requeridos' })
    }

    let client = await prisma.client.findFirst({ where: { phone } })
    if (!client) {
      client = await prisma.client.create({ data: { name, phone } })
    }
    res.json(client)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router