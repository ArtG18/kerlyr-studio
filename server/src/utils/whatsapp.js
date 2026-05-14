/**
 * Servicio de WhatsApp Business (Meta Cloud API)
 *
 * Para activar:
 * 1. Crea una app en Meta for Developers (https://developers.facebook.com)
 * 2. Agrega WHATSAPP_TOKEN y WHATSAPP_PHONE_NUMBER_ID al .env
 * 3. Las funciones de abajo enviarán mensajes reales
 */

const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID
const TOKEN           = process.env.WHATSAPP_TOKEN

async function sendMessage(to, message) {
  if (!TOKEN || !PHONE_NUMBER_ID) {
    console.log(`[WhatsApp MOCK] → ${to}: ${message}`)
    return { mock: true }
  }

  const url = `https://graph.facebook.com/v19.0/${PHONE_NUMBER_ID}/messages`
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      to: to.replace(/\s+/g, '').replace('+', ''),
      type: 'text',
      text: { body: message },
    }),
  })
  return res.json()
}

// ─── Plantillas ────────────────────────────────────────────────────────────
const SALON_HOURS = 'Lun–Vie 10–19 · Sáb 10–14'

function confirmationMessage(clientName, date, time, service) {
  return `¡Hola ${clientName}! 💅 Tu cita en *Kerlyr Studio* está confirmada.\n\n📅 ${date}\n⏰ ${time} hrs\n✨ ${service}\n\n${SALON_HOURS}\n¡Te esperamos! 🌸`
}

function reminder24hMessage(clientName, time) {
  return `¡Hola ${clientName}! 👋 Mañana tienes cita en *Kerlyr Studio* a las *${time} hrs*.\n\n¿Necesitas reagendar? Escríbenos con anticipación 💜\n+56 9 5925 7968`
}

function reminder2hMessage(clientName, time) {
  return `¡Hola ${clientName}! ⏰ En 2 horas tienes tu cita en *Kerlyr Studio* a las *${time} hrs*.\n¡Te esperamos! 💅`
}

function maintenanceMessage(clientName) {
  return `¡Hola ${clientName}! 💅 Ya pasaron 3 semanas desde tu última visita — es hora de renovar ese look.\n\n¿Agendamos? 👉 +56 9 5925 7968\n${SALON_HOURS} 🌸`
}

function reviewMessage() {
  return `¡Esperamos que hayas quedado encantada con el resultado! ✨\n\n¿Nos dejas una reseña en Google? Nos ayuda un montón 🙏\n\n@kerlyr_nailstudio también nos encuentra 💜`
}

module.exports = {
  sendMessage,
  confirmationMessage,
  reminder24hMessage,
  reminder2hMessage,
  maintenanceMessage,
  reviewMessage,
}