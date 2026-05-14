/**
 * Formatea un precio en pesos chilenos
 * @param {number} amount
 * @returns {string} — ej: "$25.000"
 */
function formatPrice(amount) {
  return `$${amount.toLocaleString('es-CL')}`
}

/**
 * Aplica descuento a un precio
 * @param {number} price
 * @param {{ type: 'percent'|'fixed', value: number }} discount
 * @returns {number}
 */
function applyDiscount(price, discount) {
  if (!discount) return price
  if (discount.type === 'percent') {
    return Math.round(price * (1 - discount.value / 100))
  }
  return Math.max(0, price - discount.value)
}

/**
 * Formatea una fecha legible en español
 * @param {Date|string} date
 * @returns {string} — ej: "martes 12 de mayo"
 */
function formatDate(date) {
  return new Date(date).toLocaleDateString('es-CL', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })
}

module.exports = { formatPrice, applyDiscount, formatDate }