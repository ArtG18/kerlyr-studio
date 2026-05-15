import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppProvider }  from './context/AppContext'
import { AuthProvider } from './context/AuthContext'

// Layouts
import AdminLayout  from './layouts/AdminLayout'
import PortalLayout from './layouts/PortalLayout'

// Pages
import Home         from './pages/Home'
import Login        from './pages/Login'
import ClientPortal from './pages/portal/ClientPortal'

// Admin pages
import Dashboard   from './pages/admin/Dashboard'
import Calendar    from './pages/admin/Calendar'
import BookingForm from './pages/admin/BookingForm'
import Services    from './pages/admin/Services'
import Discounts   from './pages/admin/Discounts'
import Clients     from './pages/admin/Clients'
import Portal      from './pages/admin/Portal'
import Reminders   from './pages/admin/Reminders'
import WhatsApp    from './pages/admin/WhatsApp'
import SalonInfo   from './pages/admin/SalonInfo'

export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <BrowserRouter>
          <Routes>

            {/* ── HOME PÚBLICO ── */}
            <Route path="/" element={<Home />} />

            {/* ── PORTAL CLIENTAS ── */}
            <Route path="/portal" element={<PortalLayout />}>
              <Route index element={<ClientPortal />} />
            </Route>

            {/* ── LOGIN ── */}
            <Route path="/login" element={<Login />} />

            {/* ── PANEL ADMIN (protegido) ── */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index            element={<Dashboard />} />
              <Route path="calendar"  element={<Calendar />} />
              <Route path="booking"   element={<BookingForm />} />
              <Route path="services"  element={<Services />} />
              <Route path="discounts" element={<Discounts />} />
              <Route path="clients"   element={<Clients />} />
              <Route path="portal"    element={<Portal />} />
              <Route path="reminders" element={<Reminders />} />
              <Route path="whatsapp"  element={<WhatsApp />} />
              <Route path="info"      element={<SalonInfo />} />
            </Route>

            {/* Ruta desconocida → home */}
            <Route path="*" element={<Navigate to="/" replace />} />

          </Routes>
        </BrowserRouter>
      </AppProvider>
    </AuthProvider>
  )
}