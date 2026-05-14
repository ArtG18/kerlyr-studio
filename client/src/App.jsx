import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import AppLayout from './layouts/AppLayout'

import Dashboard   from './pages/Dashboard'
import Calendar    from './pages/Calendar'
import BookingForm from './pages/BookingForm'
import Services    from './pages/Services'
import Discounts   from './pages/Discounts'
import Clients     from './pages/Clients'
import Portal      from './pages/Portal'
import Reminders   from './pages/Reminders'
import WhatsApp    from './pages/WhatsApp'
import SalonInfo   from './pages/SalonInfo'

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