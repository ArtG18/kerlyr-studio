const express = require('express')
const { PrismaClient } = require('@prisma/client')
const { confirmationMessage, sendMessage } = require('../services/whatsapp')
const { formatDate } = require('../utils/helpers')

const router  = express.Router()
const prisma  = new PrismaClient()

// POST /clients/portal — crear o encontrar cliente por teléfono
router.post('/', async (req, res) => {
  try {
    const { name, phone } = req.body
    if (!name || !phone) return res.status(400).json({ error: 'Nombre y teléfono son requeridos' })

    // Si ya existe el cliente con ese teléfono, retornarlo
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