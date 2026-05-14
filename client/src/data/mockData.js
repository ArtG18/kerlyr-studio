// ─── TRABAJADORAS ─────────────────────────────────────────────────────────────
export const WORKERS = [
  {
    id: 1,
    name: 'Kerly',
    initials: 'KR',
    color: '#f5e8e4',
    textColor: '#8b5e52',
    role: 'Dueña · Especialista',
    specialties: ['manicure', 'kapping', 'extensiones', 'pedicure'],
    available: true,
  },
  {
    id: 2,
    name: 'Adri',
    initials: 'VS',
    color: '#EAF3DE',
    textColor: '#27500A',
    role: 'Especialista pestañas y cejas',
    specialties: ['pestanas', 'cejas', 'depilacion'],
    available: true,
  },
  {
    id: 3,
    name: 'Leonela',
    initials: 'DM',
    color: '#E6F1FB',
    textColor: '#0C447C',
    role: 'Manicurista',
    specialties: ['manicure', 'kapping', 'pedicure'],
    available: false,
  },
  {
    id: 4,
    name: 'Josi',
    initials: 'JG',
    color: '#F9E79F',
    textColor: '#5D4037',
    role: 'Especialista pestañas y cejas',
    specialties: ['pestanas', 'man', 'depilacion'],
    available: true,
  } 
]

// Slots ocupados hoy por trabajadora
export const BOOKED_SLOTS = {
  1: ['10:00', '11:30', '16:00'],
  2: ['14:00', '17:00'],
  3: [],
  4: [],
}

export const ALL_TIME_SLOTS = [
  '10:00','10:30','11:00','11:30','12:00','12:30',
  '13:00','13:30','14:00','14:30','15:00','15:30',
  '16:00','16:30','17:00','17:30','18:00','18:30',
]

export function getAvailableSlots(workerId) {
  const worker = WORKERS.find(w => w.id === workerId)
  if (!worker || !worker.available) return []
  const occupied = BOOKED_SLOTS[workerId] || []
  return ALL_TIME_SLOTS.filter(slot => !occupied.includes(slot))
}

// ─── SERVICIOS ───────────────────────────────────────────────────────────────
export const SERVICES = [
  // Manicure
  { id: 1, category: 'manicure', name: 'Manicure', detail: 'Limado + limpieza + fortalecedor', price: 6000, duration: 40 },
  { id: 2, category: 'manicure', name: 'Esmaltado perm. exprés', detail: 'Limado + esmaltado', price: 8000, duration: 45 },
  { id: 3, category: 'manicure', name: 'Esmaltado perm. completo', detail: '1-2 tonos', price: 10000, duration: 60 },
  { id: 4, category: 'manicure', name: 'Francesa o degradado', detail: 'Diseño especial', price: 12000, duration: 60 },
  // Kapping
  { id: 5, category: 'kapping', name: 'Kapping Polygel', detail: 'Desde', price: 18000, duration: 60 },
  { id: 6, category: 'kapping', name: 'Kapping Acrílico', detail: 'Desde', price: 18000, duration: 60 },
  // Extensiones
  { id: 7, category: 'extensiones', name: 'Extensión Polygel', detail: 'Sin pretinas incluidas', price: 24000, duration: 90 },
  { id: 8, category: 'extensiones', name: 'Extensión Acrílico', detail: 'Sin pretinas incluidas', price: 25000, duration: 90 },
  // Pedicure
  { id: 9, category: 'pedicure', name: 'Pedicure exprés', detail: '', price: 15000, duration: 45 },
  { id: 10, category: 'pedicure', name: 'Pedi Spa completa', detail: 'Diseños adicionales', price: 20000, duration: 60 },
  // Pestañas
  { id: 11, category: 'pestanas', name: 'Volumen Egipcio', detail: '', price: 35000, duration: 90 },
  { id: 12, category: 'pestanas', name: 'Volumen Brasilero', detail: '', price: 30000, duration: 90 },
  { id: 13, category: 'pestanas', name: 'Rimel', detail: '', price: 30000, duration: 60 },
  { id: 14, category: 'pestanas', name: 'Clásicas', detail: '', price: 25000, duration: 60 },
  { id: 15, category: 'pestanas', name: 'Listing + tinte + keratina', detail: '', price: 15000, duration: 45 },
  { id: 16, category: 'pestanas', name: 'Racimo', detail: '', price: 20000, duration: 60 },
  // Cejas
  { id: 17, category: 'cejas', name: 'Laminado cejas', detail: '', price: 15000, duration: 45 },
  { id: 18, category: 'cejas', name: 'Planchado cejas', detail: '', price: 15000, duration: 45 },
  { id: 19, category: 'cejas', name: 'Perfilado + tinte', detail: '', price: 10000, duration: 30 },
  { id: 20, category: 'cejas', name: 'Perfilado', detail: '', price: 6000, duration: 20 },
  // Depilación
  { id: 21, category: 'depilacion', name: 'Rostro completo', detail: '', price: 20000, duration: 30 },
  { id: 22, category: 'depilacion', name: 'Pierna completa', detail: '', price: 16000, duration: 45 },
  { id: 23, category: 'depilacion', name: 'Rebaje + interglúteo', detail: '', price: 15000, duration: 30 },
  { id: 24, category: 'depilacion', name: 'Media pierna', detail: '', price: 8000, duration: 25 },
  { id: 25, category: 'depilacion', name: 'Patilla', detail: '', price: 8000, duration: 20 },
  { id: 26, category: 'depilacion', name: 'Axilas', detail: '', price: 6000, duration: 20 },
  { id: 27, category: 'depilacion', name: 'Bordes rebaje', detail: '', price: 6000, duration: 20 },
  { id: 28, category: 'depilacion', name: 'Bozo', detail: '', price: 4000, duration: 15 },
  { id: 29, category: 'depilacion', name: 'Medio brazo', detail: '', price: 6000, duration: 20 },
  { id: 30, category: 'depilacion', name: 'Brazo completo', detail: '', price: 12000, duration: 30 },
]

export const CATEGORY_LABELS = {
  manicure:    { label: 'Manicure',    icon: 'ti-sparkles' },
  kapping:     { label: 'Kapping',     icon: 'ti-diamond' },
  extensiones: { label: 'Extensiones', icon: 'ti-stars' },
  pedicure:    { label: 'Pedicure',    icon: 'ti-droplet' },
  pestanas:    { label: 'Pestañas',    icon: 'ti-eye' },
  cejas:       { label: 'Cejas',       icon: 'ti-brush' },
  depilacion:  { label: 'Depilación',  icon: 'ti-scissors' },
}

// ─── CLIENTES ────────────────────────────────────────────────────────────────
export const CLIENTS = [
  { id: 1, name: 'Catalina Araya',   initials: 'CA', color: '#f5e8e4', textColor: '#8b5e52', phone: '+56 9 8765 4321', visits: 12, total: 312000, favService: 'Extensiones · Kapping',   rating: 5, tag: 'VIP',      lastVisit: '28 abr' },
  { id: 2, name: 'María Rodríguez',  initials: 'MR', color: '#E1F5EE', textColor: '#085041', phone: '+56 9 7654 3210', visits: 8,  total: 184000, favService: 'Manicure · Pedicure',    rating: 4, tag: 'Frecuente', lastVisit: '5 may' },
  { id: 3, name: 'Valentina Pérez',  initials: 'VP', color: '#FAEEDA', textColor: '#633806', phone: '+56 9 6543 2109', visits: 5,  total: 175000, favService: 'Pestañas · Cejas',       rating: 5, tag: 'Regular',   lastVisit: '1 may' },
  { id: 4, name: 'Sofía López',      initials: 'SL', color: '#FBEAF0', textColor: '#72243E', phone: '+56 9 5432 1098', visits: 3,  total: 55000,  favService: 'Pedicure',               rating: 3, tag: 'Nueva',     lastVisit: '10 may' },
  { id: 5, name: 'Javiera Muñoz',    initials: 'JM', color: '#EAF3DE', textColor: '#27500A', phone: '+56 9 4321 0987', visits: 9,  total: 261000, favService: 'Cejas · Depilación',     rating: 5, tag: 'VIP',      lastVisit: '3 may' },
  { id: 6, name: 'Daniela Torres',   initials: 'DT', color: '#E6F1FB', textColor: '#0C447C', phone: '+56 9 3210 9876', visits: 6,  total: 138000, favService: 'Volumen Egipcio',        rating: 5, tag: 'Frecuente', lastVisit: '8 may' },
  { id: 7, name: 'Camila Flores',    initials: 'CF', color: '#F3EEFF', textColor: '#5B21B6', phone: '+56 9 2109 8765', visits: 2,  total: 40000,  favService: 'Manicure clásica',       rating: 4, tag: 'Nueva',     lastVisit: '11 may' },
]

// ─── CITAS DE HOY ─────────────────────────────────────────────────────────────
export const TODAY_APPOINTMENTS = [
  { id: 1, clientId: 1, clientName: 'Catalina Araya',  initials: 'CA', color: '#f5e8e4', textColor: '#8b5e52', workerId: 1, workerName: 'Kerlyr',    service: 'Extensión Acrílico',         price: 25000, time: '10:00', endTime: '11:30', status: 'confirmed' },
  { id: 2, clientId: 2, clientName: 'María Rodríguez', initials: 'MR', color: '#E1F5EE', textColor: '#085041', workerId: 1, workerName: 'Kerlyr',    service: 'Esmaltado perm. completo',   price: 10000, time: '11:30', endTime: '12:30', status: 'confirmed' },
  { id: 3, clientId: 3, clientName: 'Valentina Pérez', initials: 'VP', color: '#FAEEDA', textColor: '#633806', workerId: 2, workerName: 'Valentina', service: 'Volumen Egipcio',            price: 35000, time: '14:00', endTime: '15:30', status: 'pending'   },
  { id: 4, clientId: 4, clientName: 'Sofía López',     initials: 'SL', color: '#FBEAF0', textColor: '#72243E', workerId: 1, workerName: 'Kerlyr',    service: 'Pedi Spa completa',          price: 20000, time: '16:00', endTime: '17:00', status: 'pending'   },
  { id: 5, clientId: 5, clientName: 'Javiera Muñoz',   initials: 'JM', color: '#EAF3DE', textColor: '#27500A', workerId: 2, workerName: 'Valentina', service: 'Laminado + Perfilado cejas', price: 21000, time: '17:00', endTime: '17:45', status: 'confirmed' },
]

export const TIME_SLOTS = [
  { time: '10:00', appointment: TODAY_APPOINTMENTS[0] },
  { time: '11:30', appointment: TODAY_APPOINTMENTS[1] },
  { time: '12:30', appointment: null },
  { time: '13:00', appointment: null },
  { time: '14:00', appointment: TODAY_APPOINTMENTS[2] },
  { time: '15:30', appointment: null },
  { time: '16:00', appointment: TODAY_APPOINTMENTS[3] },
  { time: '17:00', appointment: TODAY_APPOINTMENTS[4] },
]

// ─── INFO DEL SALÓN ───────────────────────────────────────────────────────────
export const SALON_INFO = {
  name: 'Kerlyr Studio',
  fullName: 'Kerlyr Nails Studio',
  tagline: 'Nails · Pestañas · Cejas · Depilación',
  phone: '+56 9 5925 7968',
  instagram: '@kerlyr_nailstudio',
  instagramUrl: 'https://www.instagram.com/kerlyr_nailstudio/',
  mapsUrl: 'https://maps.app.goo.gl/HcRbJ1P2bLscUEGL8',
  mapsEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3193.6233872533217!2d-73.0547422229579!3d-36.82754367223928!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9669b54455f9ef69%3A0x658e5c38f8ef2988!2sKerlyr%20Nails%20Studio!5e0!3m2!1ses!2scl!4v1778619349367!5m2!1ses!2scl',
  hours: {
    weekdays: 'Lunes a Viernes: 10:00 — 19:00',
    saturday: 'Sábado: 10:00 — 14:00',
    sunday: 'Domingo: Cerrado',
  },
  payment: 'Todos los medios de pago',
  note: 'Costo de retiro adicional',
}