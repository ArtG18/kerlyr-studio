import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { TopBar } from '../components/UI'

const DAYS_WITH_APPTS = new Set([2,3,5,6,7,9,10,12,13,15,16,17,19,21,22,24,26,27,29,30,31])
const WEEK_DAYS = ['L','M','X','J','V','S','D']

export default function Calendar() {
  const { appointments } = useApp()
  const [selectedDay, setSelectedDay] = useState(12)

  // Build calendar days for May 2026
  const calDays = []
  // Previous month fill (starts on Thursday = index 3)
  for (let i = 3; i > 0; i--) calDays.push({ day: 30 - i + 1, current: false })
  for (let d = 1; d <= 31; d++) calDays.push({ day: d, current: true })
  // Fill remaining
  while (calDays.length % 7 !== 0) calDays.push({ day: calDays.length - 34, current: false })

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <TopBar title="Calendario — mayo 2026" />

      <div className="flex-1 overflow-y-auto p-5">
        <div className="grid grid-cols-2 gap-6">
          {/* Calendar grid */}
          <div>
            <div className="card">
              <div className="grid grid-cols-7 gap-1 mb-2">
                {WEEK_DAYS.map(d => (
                  <div key={d} className="text-center text-[10px] font-medium text-gray-400 py-1">{d}</div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {calDays.map(({ day, current }, i) => {
                  const hasAppt = current && DAYS_WITH_APPTS.has(day)
                  const isToday = current && day === 12
                  const isSelected = current && day === selectedDay
                  return (
                    <button
                      key={i}
                      onClick={() => current && setSelectedDay(day)}
                      className={`
                        aspect-square flex flex-col items-center justify-center rounded-lg text-xs transition-all relative
                        ${!current ? 'text-gray-200 cursor-default' : 'cursor-pointer hover:bg-kr-rose-light'}
                        ${isToday ? 'bg-kr-rose text-white font-medium hover:bg-kr-rose' : ''}
                        ${isSelected && !isToday ? 'bg-kr-rose-light text-kr-rose-dark ring-1 ring-kr-rose' : ''}
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

            {/* Legend */}
            <div className="flex items-center gap-4 mt-3 px-1">
              <span className="flex items-center gap-1.5 text-xs text-gray-400">
                <span className="w-2 h-2 rounded-full bg-kr-rose inline-block" /> Con citas
              </span>
              <span className="flex items-center gap-1.5 text-xs text-gray-400">
                <span className="w-3.5 h-3.5 rounded bg-kr-rose inline-block" /> Hoy
              </span>
            </div>
          </div>

          {/* Time slots */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">
              Horarios — {selectedDay === 12 ? 'hoy' : ''} {selectedDay} mayo
            </h3>
            <div className="space-y-2">
              {[
                { time: '10:00', appt: appointments[0] },
                { time: '11:30', appt: appointments[1] },
                { time: '12:30', appt: null },
                { time: '13:00', appt: null },
                { time: '14:00', appt: appointments[2] },
                { time: '15:30', appt: null },
                { time: '16:00', appt: appointments[3] },
                { time: '17:00', appt: appointments[4] },
              ].map(({ time, appt }) => (
                <div key={time} className="flex items-center gap-3">
                  <span className="text-[11px] text-gray-400 w-11 flex-shrink-0">{time}</span>
                  <div
                    className={`flex-1 h-8 rounded-lg flex items-center px-3 text-xs font-medium
                      ${appt
                        ? 'bg-kr-rose-light text-kr-rose-dark'
                        : 'bg-gray-50 text-gray-300 font-normal'
                      }`}
                  >
                    {appt ? `${appt.clientName} — ${appt.service}` : 'Disponible'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}