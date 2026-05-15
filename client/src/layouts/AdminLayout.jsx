import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Sidebar from '../../components/Sidebar'

export default function AdminLayout() {
  const { isAuthenticated, loading, logout, user } = useAuth()

  // Esperar a que cargue el estado de auth
  if (loading) {
    return (
      <div className="min-h-screen bg-kr-rose-light flex items-center justify-center">
        <div className="text-center">
          <p className="font-display italic text-4xl text-kr-rose mb-3">KR</p>
          <p className="text-sm text-gray-400">Cargando...</p>
        </div>
      </div>
    )
  }

  // Si no está autenticada, redirigir al login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      <Sidebar />
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Admin top bar */}
        <div className="flex items-center justify-end px-5 py-2 border-b border-gray-100 bg-white flex-shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-400">
              <i className="ti ti-user mr-1" />{user?.email}
            </span>
            <button
              onClick={logout}
              className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-red-400 transition-colors"
            >
              <i className="ti ti-logout text-sm" /> Cerrar sesión
            </button>
          </div>
        </div>
        <Outlet />
      </main>
    </div>
  )
}