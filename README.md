# Kerlyr Studio — Sistema de Agendamiento

Aplicación completa de gestión de citas para **Kerlyr Nails Studio**.

## Stack

| Capa | Tecnología |
|------|-----------|
| Frontend | React 18 + Vite |
| Estilos | TailwindCSS |
| Routing | React Router v6 |
| HTTP | Axios |
| Backend | Node.js + Express |
| ORM | Prisma |
| Base de datos | PostgreSQL |
| Auth | JWT + bcrypt |

---

## Estructura del proyecto

```
kerly-studio/
├── client/                 # Frontend React + Vite
│   ├── src/
│   │   ├── components/     # Sidebar, TopBar, cards reutilizables
│   │   ├── pages/          # Dashboard, Calendar, Clients, Services, etc.
│   │   ├── layouts/        # AppLayout (sidebar + main)
│   │   ├── services/       # api.js (Axios)
│   │   ├── hooks/          # useAppointments, useClients, useServices
│   │   ├── context/        # AppContext (estado global)
│   │   └── data/           # datos mock para desarrollo sin backend
│   └── ...
│
├── server/                 # Backend Express
│   ├── src/
│   │   ├── routes/         # appointments, clients, services, auth
│   │   ├── controllers/    # lógica de cada ruta
│   │   ├── services/       # whatsapp, descuentos
│   │   ├── middleware/     # auth JWT
│   │   └── utils/          # helpers
│   ├── prisma/
│   │   └── schema.prisma
│   └── .env
│
└── README.md
```

---

## Instalación rápida

### 1. Clonar / descomprimir el proyecto

```bash
cd kerly-studio
```

### 2. Frontend

```bash
cd client
npm install
npm run dev
```

Corre en: `http://localhost:5173`

### 3. Backend

```bash
cd server
npm install
```

Crea el archivo `.env` con:

```env
DATABASE_URL="postgresql://postgres:TU_PASSWORD@localhost:5432/kerlystudio"
JWT_SECRET="kerlyr_secret_2025"
PORT=5000
```

```bash
npx prisma migrate dev --name init
npm run dev
```

Corre en: `http://localhost:5000`

---

## Variables de entorno

| Variable | Descripción |
|----------|-------------|
| `DATABASE_URL` | Conexión PostgreSQL |
| `JWT_SECRET` | Clave secreta para tokens |
| `PORT` | Puerto del servidor (default: 5000) |
| `WHATSAPP_TOKEN` | Token Meta WhatsApp Cloud API (futuro) |

---

## Funcionalidades actuales

- [x] Dashboard con métricas del día
- [x] Calendario de citas
- [x] Formulario nueva cita con selector de servicios
- [x] Catálogo de servicios con categorías
- [x] Sistema de descuentos (porcentaje o monto fijo)
- [x] Historial de clientes con perfil detallado
- [x] Portal de autoagendamiento para clientes
- [x] Recordatorios automáticos (plantillas WhatsApp)
- [x] Panel WhatsApp Business con plantillas
- [x] Info del salón (mapa, horarios, contacto)

## Próximas fases

- [ ] Login admin con JWT
- [ ] Integración real WhatsApp Cloud API / Twilio
- [ ] Notificaciones push
- [ ] Reportes de ingresos mensuales
- [ ] Deploy (Vercel + Railway + Supabase)

---

## Datos de contacto del salón

- **Instagram**: [@kerlyr_nailstudio](https://www.instagram.com/kerlyr_nailstudio/)
- **WhatsApp**: +56 9 5925 7968
- **Horario**: Lun–Vie 10:00–19:00 | Sáb 10:00–14:00
- **Ubicación**: [Google Maps](https://maps.app.goo.gl/HcRbJ1P2bLscUEGL8)
