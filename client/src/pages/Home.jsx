import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

const GALLERY = [
  { src: '/gallery/default.jpg',  label: 'Nail art degradado' },
  { src: '/gallery/foto1.jpeg',   label: 'Francesa leopardo' },
  { src: '/gallery/foto2.jpeg',   label: 'Gel floral' },
  { src: '/gallery/foto3.jpeg',   label: 'Gel naranja' },
  { src: '/gallery/foto4.jpeg',   label: 'Francesa rosada' },
  { src: '/gallery/foto5.jpeg',   label: 'Extensión almendra' },
  { src: '/gallery/foto9.jpeg',   label: 'Gel rosa coral' },
  { src: '/gallery/foto10.jpeg',  label: 'Nail art 3D' },
  { src: '/gallery/foto11.jpg',   label: 'Pedicure girasol' },
  { src: '/gallery/foto12.jpg',   label: 'Extensión mariposa' },
]

const SERVICES_PREVIEW = [
  { icon: '💅', label: 'Manicure',    desc: 'Clásica, permanente, francesa' },
  { icon: '💎', label: 'Kapping',     desc: 'Polygel y acrílico' },
  { icon: '✨', label: 'Extensiones', desc: 'Polygel y acrílico' },
  { icon: '🦶', label: 'Pedicure',    desc: 'Exprés y spa completa' },
  { icon: '👁️', label: 'Pestañas',   desc: 'Volumen egipcio, brasilero' },
  { icon: '🌿', label: 'Cejas',       desc: 'Laminado, planchado, perfilado' },
]

export default function Home() {
  const navigate = useNavigate()
  const [lightbox,  setLightbox]  = useState(null)
  const [openCat,   setOpenCat]   = useState(null)
  const [priceList, setPriceList] = useState([])

  return (
    <div className="min-h-screen bg-white font-sans">

      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm border-b border-rose-100">
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/gallery/Logo.jpg" alt="Kerlyr Studio" className="w-10 h-10 rounded-full object-cover" />
            <div>
              <p className="text-sm font-semibold text-gray-800 leading-none">Kerlyr Studio</p>
              <p className="text-[10px] text-gray-400 tracking-widest uppercase">Nails · Pestañas · Cejas</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <a href="https://www.instagram.com/kerlyr_nailstudio/" target="_blank" rel="noopener noreferrer" className="text-pink-400 hover:text-pink-500 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
            </a>
            <a href="https://wa.me/56959257968" target="_blank" rel="noopener noreferrer" className="text-emerald-500 hover:text-emerald-600 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            </a>
            <button onClick={() => navigate('/login')} className="text-xs text-gray-400 hover:text-gray-600 transition-colors flex items-center gap-1.5 border border-gray-200 px-3 py-1.5 rounded-full hover:border-gray-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
              Admin
            </button>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="pt-20 min-h-[90vh] flex items-center bg-gradient-to-br from-rose-50 via-white to-pink-50">
        <div className="max-w-3xl mx-auto px-6 py-16 text-center">
          {/* Logo grande */}
          <div className="flex justify-center mb-6">
            <img
              src="/gallery/Logo.jpg"
              alt="Kerlyr Studio"
              className="w-28 h-28 rounded-full object-cover shadow-xl border-4 border-white ring-2 ring-rose-100"
            />
          </div>

          <p className="text-xs font-semibold tracking-widest uppercase text-rose-400 mb-4">
            ✨ Nails · Pestañas · Cejas · Depilación
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight mb-6">
            Tu belleza,{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-pink-500">
              nuestra pasión
            </span>
          </h1>
          <p className="text-gray-500 text-base sm:text-lg leading-relaxed mb-8 max-w-xl mx-auto">
            En Kerlyr Studio te ofrecemos una experiencia única de cuidado y belleza.
            Desde manicure artístico hasta extensiones profesionales, todo con amor y dedicación.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <button onClick={() => navigate('/portal')}
              className="bg-gradient-to-r from-rose-400 to-pink-500 text-white px-8 py-4 rounded-2xl font-semibold text-base shadow-lg shadow-rose-200 hover:shadow-rose-300 hover:scale-105 transition-all duration-200">
              💅 Agenda ahora
            </button>
            <a href="#galeria"
              className="text-gray-500 hover:text-gray-800 font-medium transition-colors flex items-center gap-2">
              Ver galería
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </a>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-center gap-8 mt-12 pt-8 border-t border-rose-100">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">+500</p>
              <p className="text-xs text-gray-400">Clientas felices</p>
            </div>
            <div className="w-px h-10 bg-rose-100" />
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">5★</p>
              <p className="text-xs text-gray-400">Calificación</p>
            </div>
            <div className="w-px h-10 bg-rose-100" />
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">3+</p>
              <p className="text-xs text-gray-400">Años de experiencia</p>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICIOS */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold tracking-widest uppercase text-rose-400 mb-2">Lo que ofrecemos</p>
            <h2 className="text-3xl font-bold text-gray-900">Nuestros servicios</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICES_PREVIEW.map(svc => (
              <div key={svc.label}
                className="group p-6 rounded-2xl border border-rose-100 hover:border-rose-300 hover:shadow-lg hover:shadow-rose-50 transition-all duration-200">
                <div className="text-3xl mb-3">{svc.icon}</div>
                <h3 className="text-base font-semibold text-gray-800 mb-1">{svc.label}</h3>
                <p className="text-sm text-gray-400 mb-4">{svc.desc}</p>
                <button
                  onClick={() => setOpenCat(svc.cat)}
                  className="text-xs text-rose-400 hover:text-rose-600 font-medium transition-colors"
                >
                  Ver precios →
                </button>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <button onClick={() => navigate('/portal')}
              className="bg-rose-50 text-rose-500 hover:bg-rose-100 px-8 py-3 rounded-xl font-medium transition-colors">
              Ver todos los servicios y precios
            </button>
          </div>
        </div>
      </section>

      {/* MODAL PRECIOS */}
      {openCat && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
          onClick={() => setOpenCat(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[80vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-gray-100 sticky top-0 bg-white rounded-t-2xl">
              <div>
                <p className="text-xs text-rose-400 font-medium uppercase tracking-widest">
                  {SERVICES_PREVIEW.find(s => s.cat === openCat)?.icon} {SERVICES_PREVIEW.find(s => s.cat === openCat)?.label}
                </p>
                <h3 className="text-base font-semibold text-gray-900 mt-0.5">Lista de precios</h3>
              </div>
              <button onClick={() => setOpenCat(null)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-colors">
                ✕
              </button>
            </div>
            <div className="p-5 space-y-2">
              {priceList.length === 0 ? (
                <p className="text-center text-gray-400 text-sm py-8">Cargando precios...</p>
              ) : (
                priceList.map((svc, i) => (
                  <div key={i} className="flex items-center justify-between py-2.5 px-3 bg-rose-50/50 rounded-xl">
                    <div>
                      <p className="text-sm font-medium text-gray-800">{svc.name}</p>
                      {svc.detail && <p className="text-xs text-gray-400">{svc.detail}</p>}
                      <p className="text-[10px] text-gray-300">{svc.duration} min</p>
                    </div>
                    <p className="text-sm font-bold text-rose-500 flex-shrink-0 ml-4">
                      ${Number(svc.price).toLocaleString('es-CL')}
                    </p>
                  </div>
                ))
              )}
            </div>
            <div className="p-5 pt-0">
              <button onClick={() => { setOpenCat(null); navigate('/portal') }}
                className="w-full bg-gradient-to-r from-rose-400 to-pink-500 text-white py-3 rounded-xl font-semibold hover:scale-105 transition-all shadow-md">
                💅 Agendar ahora
              </button>
              <p className="text-center text-xs text-gray-400 mt-2">Con todo medio de pago · Costo de retiro adicional</p>
            </div>
          </div>
        </div>
      )}

      {/* ABOUT */}
      <section className="py-20 bg-gradient-to-br from-rose-50 to-pink-50">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 gap-16 items-center">
          <div className="relative">
            <div className="grid grid-cols-2 gap-3">
              <img src="/gallery/foto5.jpeg" alt="" className="rounded-2xl shadow-lg object-cover object-center h-52 w-full" />
              <img src="/gallery/foto9.jpeg" alt="" className="rounded-2xl shadow-lg object-cover object-center h-52 w-full mt-8" />
              <img src="/gallery/foto1.jpeg" alt="" className="rounded-2xl shadow-lg object-cover object-center h-52 w-full -mt-4" />
              <img src="/gallery/foto3.jpeg" alt="" className="rounded-2xl shadow-lg object-cover object-center h-52 w-full mt-4" />
            </div>
            <div className="absolute -bottom-4 -right-4 bg-white rounded-2xl p-3 shadow-xl border border-rose-100">
              <img src="/gallery/Logo.jpg" alt="Kerlyr Studio" className="w-16 h-16 rounded-xl object-cover" />
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase text-rose-400 mb-4">Sobre nosotras</p>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Más que un salón,<br />una experiencia</h2>
            <p className="text-gray-500 leading-relaxed mb-4">
              Somos un equipo apasionado por la belleza y el cuidado personal. En Kerlyr Studio
              cada clienta es especial y merece atención personalizada y de calidad.
            </p>
            <p className="text-gray-500 leading-relaxed mb-8">
              Trabajamos con los mejores productos del mercado para garantizar resultados
              duraderos y seguros. Nuestro equipo se capacita constantemente para traerte
              las últimas tendencias en nail art, pestañas y cejas.
            </p>
            <div className="flex flex-col gap-3 mb-8">
              {['Productos de primera calidad','Equipo profesional y capacitado','Ambiente cálido y acogedor','Todos los medios de pago'].map(item => (
                <div key={item} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-rose-100 flex items-center justify-center flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <span className="text-sm text-gray-600">{item}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-3">
              <div className="bg-white rounded-xl px-4 py-3 border border-rose-100 text-center"><p className="text-xs text-gray-400">Lun–Vie</p><p className="text-sm font-semibold text-gray-800">10:00–19:00</p></div>
              <div className="bg-white rounded-xl px-4 py-3 border border-rose-100 text-center"><p className="text-xs text-gray-400">Sábado</p><p className="text-sm font-semibold text-gray-800">10:00–14:00</p></div>
              <div className="bg-white rounded-xl px-4 py-3 border border-rose-100 text-center"><p className="text-xs text-gray-400">Domingo</p><p className="text-sm font-semibold text-gray-800">Cerrado</p></div>
            </div>
          </div>
        </div>
      </section>

      {/* GALERÍA */}
      <section id="galeria" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold tracking-widest uppercase text-rose-400 mb-2">Nuestro trabajo</p>
            <h2 className="text-3xl font-bold text-gray-900">Galería</h2>
            <p className="text-gray-400 mt-2 text-sm">Haz clic en cualquier foto para verla completa</p>
          </div>
          <div className="grid grid-cols-4 gap-4">
            {GALLERY.map((img, i) => (
              <button key={i} onClick={() => setLightbox(img)}
                className="group relative rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 aspect-square bg-rose-50">
                <img src={img.src} alt={img.label} className="w-full h-full object-cover object-center" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-end p-3">
                  <p className="text-white text-xs font-medium">{img.label}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* UBICACIÓN */}
      <section className="py-20 bg-gradient-to-br from-rose-50 to-pink-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-10">
            <p className="text-xs font-semibold tracking-widest uppercase text-rose-400 mb-2">Dónde encontrarnos</p>
            <h2 className="text-3xl font-bold text-gray-900">Nuestra ubicación</h2>
          </div>
          <div className="grid grid-cols-2 gap-10 items-center">
            <div className="rounded-3xl overflow-hidden shadow-xl border border-rose-100">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3193.6233872533217!2d-73.0547422229579!3d-36.82754367223928!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9669b54455f9ef69%3A0x658e5c38f8ef2988!2sKerlyr%20Nails%20Studio!5e0!3m2!1ses!2scl!4v1778619349367!5m2!1ses!2scl"
                width="100%" height="340" style={{ border: 0, display: 'block' }}
                allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"
                title="Kerlyr Nails Studio" />
            </div>
            <div className="space-y-5">
              {[
                { icon: '📍', label: 'Dirección', value: 'Kerlyr Nails Studio, Concepción', link: 'https://maps.app.goo.gl/HcRbJ1P2bLscUEGL8' },
                { icon: '📱', label: 'WhatsApp', value: '+56 9 5925 7968', link: 'https://wa.me/56959257968' },
                { icon: '📸', label: 'Instagram', value: '@kerlyr_nailstudio', link: 'https://www.instagram.com/kerlyr_nailstudio/' },
                { icon: '🕐', label: 'Lunes a Viernes', value: '10:00 — 19:00' },
                { icon: '🕐', label: 'Sábado', value: '10:00 — 14:00' },
              ].map(item => (
                <div key={item.label} className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-white rounded-xl shadow-sm border border-rose-100 flex items-center justify-center flex-shrink-0 text-lg">{item.icon}</div>
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">{item.label}</p>
                    {item.link
                      ? <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-gray-800 hover:text-rose-500 transition-colors">{item.value}</a>
                      : <p className="text-sm font-medium text-gray-800">{item.value}</p>
                    }
                  </div>
                </div>
              ))}
              <button onClick={() => navigate('/portal')}
                className="w-full bg-gradient-to-r from-rose-400 to-pink-500 text-white py-3 rounded-xl font-semibold hover:scale-105 transition-all shadow-lg shadow-rose-200 mt-2">
                💅 Agenda tu cita
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-20 bg-gradient-to-r from-rose-400 to-pink-500">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">¿Lista para lucir unas uñas increíbles?</h2>
          <p className="text-rose-100 mb-8 text-lg">Agenda tu cita en minutos y elige el horario que más te acomode.</p>
          <button onClick={() => navigate('/portal')}
            className="bg-white text-rose-500 hover:bg-rose-50 px-10 py-4 rounded-2xl font-bold text-lg shadow-lg hover:scale-105 transition-all duration-200">
            💅 Agenda tu cita ahora
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-900 py-8">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/gallery/Logo.jpg" alt="Logo" className="w-8 h-8 rounded-full object-cover" />
            <p className="text-sm text-gray-400">Kerlyr Studio © 2026</p>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/portal')} className="text-xs text-gray-400 hover:text-white transition-colors">Portal clientas</button>
            <button onClick={() => navigate('/login')} className="text-xs text-gray-400 hover:text-white transition-colors">Admin</button>
          </div>
        </div>
      </footer>

      {/* LIGHTBOX */}
      {lightbox && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4" onClick={() => setLightbox(null)}>
          <div className="relative max-w-2xl w-full" onClick={e => e.stopPropagation()}>
            <img src={lightbox.src} alt={lightbox.label} className="w-full rounded-2xl shadow-2xl object-cover" />
            <p className="text-white text-center mt-3 text-sm">{lightbox.label}</p>
            <button onClick={() => setLightbox(null)}
              className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-white text-gray-800 flex items-center justify-center font-bold shadow-lg hover:bg-gray-100">×</button>
          </div>
        </div>
      )}
    </div>
  )
}