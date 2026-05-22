import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    email: '',
    password: ''
  })

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const set = (field) => (e) => {
    setForm(prev => ({
      ...prev,
      [field]: e.target.value
    }))
  }

  const validateForm = () => {
    const email = form.email.trim()
    const password = form.password.trim()

    if (!email || !password) {
      setError('Completa todos los campos')
      return false
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!emailRegex.test(email)) {
      setError('Ingresa un email válido')
      return false
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      return false
    }

    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    setError('')

    if (!validateForm()) return

    setLoading(true)

    try {
      await login(
        form.email.trim(),
        form.password.trim()
      )

      toast.success('Bienvenida al panel ✨')

      navigate('/admin')
    } catch (err) {
      setError('Email o contraseña incorrectos')
      toast.error('Credenciales inválidas')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-kr-rose-light flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-sm border border-kr-rose-mid w-full max-w-sm p-8">

        <div className="text-center mb-8">
          <img
            src="/gallery/Logo.jpg"
            alt="Kerlyr Studio"
            className="w-24 h-24 rounded-full object-cover mx-auto mb-3 shadow-sm border border-rose-100"
          />

          <p className="text-base font-medium text-gray-800">
            Kerlyr Studio
          </p>

          <p className="text-xs text-gray-400 tracking-widest uppercase mt-1">
            Panel de administración
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <label className="form-label">
              Email
            </label>

            <input
              className="form-input"
              type="email"
              placeholder="kerlyr@studio.cl"
              value={form.email}
              onChange={set('email')}
              autoComplete="email"
              maxLength={120}
              required
            />
          </div>

          <div>
            <label className="form-label">
              Contraseña
            </label>

            <input
              className="form-input"
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={set('password')}
              autoComplete="current-password"
              minLength={6}
              maxLength={80}
              required
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 rounded-lg border border-red-100">
              <i className="ti ti-alert-circle text-red-400" />

              <p className="text-xs text-red-600">
                {error}
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full justify-center py-2.5 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
          >
            {loading ? (
              <>
                <i className="ti ti-loader-2 animate-spin" />
                Entrando...
              </>
            ) : (
              <>
                <i className="ti ti-login" />
                Entrar
              </>
            )}
          </button>
        </form>

        <div className="text-center mt-6 pt-5 border-t border-gray-100">
          <p className="text-xs text-gray-400 mb-2">
            ¿Eres clienta?
          </p>

          <a
            href="/"
            className="text-xs text-kr-rose hover:text-kr-rose-dark transition-colors font-medium"
          >
            Ir al portal de agendamiento →
          </a>
        </div>
      </div>
    </div>
  )
}
