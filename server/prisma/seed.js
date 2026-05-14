const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  // Workers / Trabajadoras
  const workers = [
    { name: 'Kerly', role: 'Dueña · Especialista', specialties: 'manicure,kapping,extensiones,pedicure', available: true },
    { name: 'Adri',   role: 'Especialista pestañas y cejas', specialties: 'pestanas,cejas,depilacion,manicure', available: true },
    { name: 'Leonela',  role: 'Manicurista', specialties: 'manicure,kapping,pedicure', available: true },
    { name: 'Josi',  role: 'Manicurista', specialties: 'manicure,kapping,pedicure', available: true },
  ]
  for (const w of workers) {
    await prisma.worker.upsert({
      where: { id: workers.indexOf(w) + 1 },
      update: {},
      create: w,
    })
  }

  // Admin user
  const hash = await bcrypt.hash('#Ks.2026$', 10)
  await prisma.user.upsert({
    where: { email: 'kerlyr@studio.cl' },
    update: {},
    create: { email: 'kerlyr@studio.cl', password: hash, role: 'admin' },
  })

  // Services
  const services = [
    { name: 'Manicure', detail: 'Limado + limpieza + fortalecedor', price: 6000, duration: 40, category: 'manicure' },
    { name: 'Esmaltado perm. exprés', detail: 'Limado + esmaltado', price: 8000, duration: 45, category: 'manicure' },
    { name: 'Esmaltado perm. completo', detail: '1-2 tonos', price: 10000, duration: 60, category: 'manicure' },
    { name: 'Francesa o degradado', price: 12000, duration: 60, category: 'manicure' },
    { name: 'Kapping Polygel', detail: 'Desde', price: 18000, duration: 60, category: 'kapping' },
    { name: 'Kapping Acrílico', detail: 'Desde', price: 18000, duration: 60, category: 'kapping' },
    { name: 'Extensión Polygel', detail: 'Sin pretinas incluidas', price: 24000, duration: 90, category: 'extensiones' },
    { name: 'Extensión Acrílico', detail: 'Sin pretinas incluidas', price: 25000, duration: 90, category: 'extensiones' },
    { name: 'Pedicure exprés', price: 15000, duration: 45, category: 'pedicure' },
    { name: 'Pedi Spa completa', detail: 'Diseños adicionales', price: 20000, duration: 60, category: 'pedicure' },
    { name: 'Volumen Egipcio', price: 35000, duration: 90, category: 'pestanas' },
    { name: 'Volumen Brasilero', price: 30000, duration: 90, category: 'pestanas' },
    { name: 'Rimel', price: 30000, duration: 60, category: 'pestanas' },
    { name: 'Clásicas', price: 25000, duration: 60, category: 'pestanas' },
    { name: 'Listing + tinte + keratina', price: 15000, duration: 45, category: 'pestanas' },
    { name: 'Racimo', price: 20000, duration: 60, category: 'pestanas' },
    { name: 'Laminado cejas', price: 15000, duration: 45, category: 'cejas' },
    { name: 'Planchado cejas', price: 15000, duration: 45, category: 'cejas' },
    { name: 'Perfilado + tinte', price: 10000, duration: 30, category: 'cejas' },
    { name: 'Perfilado', price: 6000, duration: 20, category: 'cejas' },
    { name: 'Rostro completo', price: 20000, duration: 30, category: 'depilacion' },
    { name: 'Pierna completa', price: 16000, duration: 45, category: 'depilacion' },
    { name: 'Rebaje + interglúteo', price: 15000, duration: 30, category: 'depilacion' },
    { name: 'Media pierna', price: 8000, duration: 25, category: 'depilacion' },
    { name: 'Axilas', price: 6000, duration: 20, category: 'depilacion' },
    { name: 'Brazo completo', price: 12000, duration: 30, category: 'depilacion' },
  ]

  for (const svc of services) {
    await prisma.service.upsert({
      where: { id: services.indexOf(svc) + 1 },
      update: {},
      create: svc,
    })
  }

  console.log('✅ Seed completado')
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())