import { useState, useEffect } from 'react'
import api from '../../services/api'
import { TopBar } from '../../components/UI'

const WEEK_DAYS = ['L','M','X','J','V','S','D']
const MONTHS = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']

function getDaysInMonth(year, month) {
  const days = []
  const firstDay = new Date(year, month, 1).getDay()
  const adjusted = firstDay === 0 ? 6 : firstDay - 1
  const prevDays = new Date(year, month, 0).getDate()
  for (let i = adjusted - 1; i >= 0; i--) {
    days.push({ day: prevDays - i, current: false })
  }
  const total = new Date(year, month + 1, 0).getDate()
  for (let d = 1; d <= total; d++) {
    days.push({ day: d, current: true })
  }
  while (days.length % 7 !== 0) {
    days.push({ day: days.length - total - adjusted + 1, current: false })
  }
  return days
}

const STATUS_COLORS = {
  confirmed: 'bg-kr-rose-light text-kr-rose-dark',
  pending:   'bg-amber-50 text-amber-700',
  cancelled: 'bg-red-50 text-red-400 line-through',
  completed: 'bg-emerald-50 text-emerald-700',
}

export default function Calendar() {
  const now = new Date()
  const [year,  setYear]  = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth())
  const [selectedDay, setSelectedDay] = useState(now.getDate())
  const [monthAppts,  setMonthAppts]  = useState([]) // todas las citas del mes
  const [dayAppts,    setDayAppts]    = useState([]) // citas del día seleccionado
  const [loadingDay,  setLoadingDay]  = useState(false)

  // Cargar citas del mes para marcar días con puntos
  useEffect(() => {
    const fetchMonth = async () => {
      try {
        const start = new Date(year, month, 1).toISOString().split('T')[0]
        const end   = new Date(year, month + 1, 0).toISOString().split('T')[0]
        const { data } = await api.get('/appointments', { params: { start, end } })
        setMonthAppts(data)
      } catch {
        setMonthAppts([])
      }
    }
    fetchMonth()
  }, [year, month])

  // Cargar citas del día seleccionado
  useEffect(() => {
    const fetchDay = async () => {
      setLoadingDay(true)
      try {
        const date = `${year}-${String(month + 1).padStart(2,'0')}-${String(selectedDay).padStart(2,'0')}`
        const { data } = await api.get('/appointments', { params: { date } })
        setDayAppts(data)
      } catch {
        setDayAppts([])
      } finally {
        setLoadingDay(false)
      }
    }
    fetchDay()
  }, [year, month, selectedDay])

  // Días que tienen citas
  const daysWithAppts = new Set(
    monthAppts
      .filter(a => a.status !== 'cancelled')
      .map(a => new Date(a.date).getDate())
  )

  const calDays = getDaysInMonth(year, month)
  const today   = now.getDate()
  const isCurrentMonth = year === now.getFullYear() && month === now.getMonth()

  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear(y => y - 1) }
    else setMonth(m => m - 1)
    setSelectedDay(1)
  }
  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear(y => y + 1) }
    else setMonth(m => m + 1)
    setSelectedDay(1)
  }

  const selectedDate = `${String(selectedDay).padStart(2,'0')} de ${MONTHS[month]} ${year}`

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <TopBar title={`Calendario — ${MONTHS[month]} ${year}`}>
        <div className="flex items-center gap-2">
          <button onClick={prevMonth} className="btn-outline px-3 py-1.5">
            <i className="ti ti-chevron-left" />
          </button>
          <button onClick={nextMonth} className="btn-outline px-3 py-1.5">
            <i className="ti ti-chevron-right" />
          </button>
        </div>
      </TopBar>

      <div className="flex-1 overflow-y-auto p-4 sm:p-5">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Calendario */}
          <div>
            <div className="card">
              <div className="grid grid-cols-7 gap-1 mb-2">
                {WEEK_DAYS.map(d => (
                  <div key={d} className="text-center text-[10px] font-medium text-gray-400 py-1">{d}</div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {calDays.map(({ day, current }, i) => {
                  const hasAppt   = current && daysWithAppts.has(day)
                  const isToday   = current && isCurrentMonth && day === today
                  const isSelected = current && day === selectedDay
                  return (
                    <button
                      key={i}
                      onClick={() => current && setSelectedDay(day)}
                      disabled={!current}
                      className={`
                        aspect-square flex flex-col items-center justify-center rounded-lg text-xs transition-all relative
                        ${!current ? 'text-gray-200 cursor-default' : 'cursor-pointer hover:bg-kr-rose-light'}
                        ${isToday ? 'bg-kr-rose text-white font-medium hover:bg-kr-rose' : ''}
                        ${isSelected && !isToday ? 'bg-kr-rose-light text-kr-rose-dark ring-1 ring-kr-rose font-medium' : ''}
                        ${!isToday && !isSelected && current ? 'text-gray-700' : ''}
                      `}
                    >
                      {day}
                      {hasAppt && (
                        <span className={`absolute bottom-1 w-1 h-1 rounded-full ${isToday ? 'bg-white' : 'bg-kr-rose'}`} />
                      )}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Leyenda */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-3 px-1">
              <span className="flex items-center gap-1.5 text-xs text-gray-400">
                <span className="w-2 h-2 rounded-full bg-kr-rose inline-block" /> Con citas
              </span>
              <span className="flex items-center gap-1.5 text-xs text-gray-400">
                <span className="w-3.5 h-3.5 rounded bg-kr-rose inline-block" /> Hoy
              </span>
              <span className="flex items-center gap-1.5 text-xs text-gray-400">
                <span className="w-3.5 h-3.5 rounded border border-kr-rose inline-block" /> Seleccionado
              </span>
            </div>
          </div>

          {/* Citas del día */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">
              {isCurrentMonth && selectedDay === today ? 'Hoy' : selectedDate}
              {' '}
              {dayAppts.length > 0 && (
                <span className="text-xs font-normal text-gray-400">
                  · {dayAppts.length} cita{dayAppts.length !== 1 ? 's' : ''}
                </span>
              )}
            </h3>

            {loadingDay ? (
              <div className="text-center py-10 text-gray-400">
                <i className="ti ti-loader-2 animate-spin text-2xl block mb-2" />
                <p className="text-xs">Cargando...</p>
              </div>
            ) : dayAppts.length === 0 ? (
              <div className="text-center py-10 text-gray-300">
                <i className="ti ti-calendar-off text-3xl block mb-2" />
                <p className="text-xs">Sin citas este día</p>
              </div>
            ) : (
              <div className="space-y-2">
                {dayAppts.map(appt => (
                  <div key={appt.id} className="flex items-center gap-3">
                    <span className="text-[11px] text-gray-400 w-11 flex-shrink-0">{appt.timeSlot}</span>
                    <div className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium ${STATUS_COLORS[appt.status] || STATUS_COLORS.pending}`}>
                      <p className="font-medium">{appt.client?.name}</p>
                      <p className="font-normal opacity-75">{appt.service?.name} · {appt.worker?.name?.split(' ')[0]}</p>
                    </div>
                    <span className="text-[10px] text-gray-400 flex-shrink-0">
                      ${appt.service?.price?.toLocaleString('es-CL')}
                    </span>
                  </div>
                ))}

                {/* Resumen del día */}
                <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between text-xs text-gray-400">
                  <span>
                    {dayAppts.filter(a => a.status === 'confirmed').length} confirmadas ·{' '}
                    {dayAppts.filter(a => a.status === 'pending').length} pendientes
                  </span>
                  <span className="font-medium text-gray-600">
                    ${dayAppts
                      .filter(a => a.status !== 'cancelled')
                      .reduce((s, a) => s + (a.service?.price || 0), 0)
                      .toLocaleString('es-CL')}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}