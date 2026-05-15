import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import AppLayout from './layouts/AppLayout'

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
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route index           element={<Dashboard />} />
            <Route path="calendar" element={<Calendar />} />
            <Route path="booking"  element={<BookingForm />} />
            <Route path="services" element={<Services />} />
            <Route path="discounts"element={<Discounts />} />
            <Route path="clients"  element={<Clients />} />
            <Route path="portal"   element={<Portal />} />
            <Route path="reminders"element={<Reminders />} />
            <Route path="whatsapp" element={<WhatsApp />} />
            <Route path="info"     element={<SalonInfo />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  )
}