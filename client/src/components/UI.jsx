// ─── Badge ────────────────────────────────────────────────────────────────────
export function Badge({ variant = 'default', children }) {
  const variants = {
    confirmed: 'badge-confirmed',
    pending:   'badge-pending',
    cancelled: 'badge-cancelled',
    rose:      'badge-rose',
    blue:      'badge-blue',
    vip:       'bg-purple-50 text-purple-700',
    frecuente: 'bg-emerald-50 text-emerald-700',
    regular:   'bg-amber-50 text-amber-700',
    nueva:     'bg-blue-50 text-blue-700',
  }
  return (
    <span className={`badge ${variants[variant] || 'bg-gray-100 text-gray-600'}`}>
      {children}
    </span>
  )
}

// ─── Avatar ───────────────────────────────────────────────────────────────────
export function Avatar({ initials, color = '#f5e8e4', textColor = '#8b5e52', size = 'md' }) {
  const sizes = { sm: 'w-7 h-7 text-[10px]', md: 'w-9 h-9 text-xs', lg: 'w-12 h-12 text-sm' }
  return (
    <div
      className={`${sizes[size]} rounded-full flex items-center justify-center font-medium flex-shrink-0`}
      style={{ background: color, color: textColor }}
    >
      {initials}
    </div>
  )
}

// ─── StatCard ─────────────────────────────────────────────────────────────────
export function StatCard({ label, value, sub, subColor = 'text-emerald-600' }) {
  return (
    <div className="card">
      <p className="text-xs text-gray-400 mb-1">{label}</p>
      <p className="text-2xl font-semibold text-gray-900">{value}</p>
      {sub && <p className={`text-xs mt-1 ${subColor}`}>{sub}</p>}
    </div>
  )
}

// ─── Toggle ───────────────────────────────────────────────────────────────────
export function Toggle({ value, onChange }) {
  return (
    <button
      onClick={() => onChange(!value)}
      className={`toggle ${value ? 'toggle-on' : 'toggle-off'}`}
      role="switch"
      aria-checked={value}
    >
      <span
        className={`toggle-thumb transition-all duration-200 ${value ? 'left-[22px]' : 'left-[2px]'}`}
      />
    </button>
  )
}

// ─── SectionTitle ─────────────────────────────────────────────────────────────
export function SectionTitle({ children, className = '' }) {
  return (
    <h3 className={`text-sm font-medium text-gray-800 mb-2.5 ${className}`}>
      {children}
    </h3>
  )
}

// ─── TopBar ───────────────────────────────────────────────────────────────────
export function TopBar({ title, children }) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between px-4 sm:px-5 py-3 sm:py-3.5 border-b border-gray-100 flex-shrink-0 bg-white">
      <h2 className="text-base font-medium text-gray-900 truncate">{title}</h2>
      {children && <div className="flex items-center gap-2 flex-wrap">{children}</div>}
    </div>
  )
}

// ─── PriceDisplay ─────────────────────────────────────────────────────────────
// Shows price with optional discount applied
export function PriceDisplay({ price, discountedPrice }) {
  if (!discountedPrice || discountedPrice === price) {
    return <span className="font-medium text-gray-900">${price.toLocaleString('es-CL')}</span>
  }
  return (
    <span className="flex items-center gap-1.5">
      <span className="line-through text-gray-300 text-xs">${price.toLocaleString('es-CL')}</span>
      <span className="font-semibold text-emerald-600">${discountedPrice.toLocaleString('es-CL')}</span>
    </span>
  )
}

// ─── EmptyState ───────────────────────────────────────────────────────────────
export function EmptyState({ icon = 'ti-search', message }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-gray-400">
      <i className={`ti ${icon} text-4xl mb-3`} />
      <p className="text-sm">{message}</p>
    </div>
  )
}