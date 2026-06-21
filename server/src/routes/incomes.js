const express = require('express')
const { PrismaClient } = require('@prisma/client')
const auth = require('../middleware/auth')

const router = express.Router()
const prisma = new PrismaClient()

// GET /incomes?source=salon|caja&fecha=YYYY-MM-DD&colaboradora=X
router.get('/', auth, async (req, res) => {
  try {
    const { source, fecha, colaboradora } = req.query
    const where = {}
    if (source)       where.source      = source === 'caja' ? 'caja' : { not: 'caja' }
    if (fecha)        where.fecha       = fecha
    if (colaboradora && colaboradora !== 'Todas') where.colaboradora = colaboradora

    const incomes = await prisma.income.findMany({
      where,
      orderBy: [{ fecha: 'desc' }, { createdAt: 'desc' }],
    })
    res.json(incomes)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST /incomes — crear ingreso manual
router.post('/', auth, async (req, res) => {
  try {
    const { fecha, colaboradora, servicio, monto, metodo, nota, source } = req.body
    const income = await prisma.income.create({
      data: {
        fecha,
        colaboradora,
        servicio,
        monto:  Number(monto),
        metodo: metodo || 'Efectivo',
        nota:   nota   || null,
        source: source || 'manual',
      },
    })
    res.status(201).json(income)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// PATCH /incomes/:id — editar ingreso
router.patch('/:id', auth, async (req, res) => {
  try {
    const { fecha, colaboradora, servicio, monto, metodo, nota } = req.body
    const income = await prisma.income.update({
      where: { id: Number(req.params.id) },
      data: { fecha, colaboradora, servicio, monto: Number(monto), metodo, nota },
    })
    res.json(income)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// DELETE /incomes/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    await prisma.income.delete({ where: { id: Number(req.params.id) } })
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router