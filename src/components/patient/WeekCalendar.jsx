import { startOfWeek, addDays, isToday, isSameDay, isBefore } from 'date-fns'
import { es } from 'date-fns/locale'
import { Check } from 'lucide-react'
import { format } from 'date-fns'

export default function WeekCalendar({ entries = [] }) {
  const today = new Date()
  const weekStart = startOfWeek(today, { weekStartsOn: 1 })

  const getEntryForDay = (day) => entries.find(e => isSameDay(new Date(e.entry_date + 'T12:00:00'), day))

  return (
    <div className="flex justify-between">
      {Array.from({ length: 7 }).map((_, i) => {
        const day = addDays(weekStart, i)
        const entry = getEntryForDay(day)
        const isTodayDay = isToday(day)
        const isPast = isBefore(day, today) && !isTodayDay
        const hasEntry = !!entry

        return (
          <div key={i} className="flex flex-col items-center gap-1.5">
            <span className="text-[10px] text-gray-400 uppercase">
              {format(day, 'EEE', { locale: es }).slice(0, 2)}
            </span>
            <div
              className={`
                w-9 h-9 rounded-full flex items-center justify-center
                ${hasEntry
                  ? 'bg-primary-500 text-white'
                  : isTodayDay
                    ? 'border-2 border-primary-500 border-dashed bg-white'
                    : isPast
                      ? 'bg-gray-100 text-gray-400'
                      : 'bg-gray-50 text-gray-300'
                }
              `}
            >
              {hasEntry && <Check size={16} />}
              {isTodayDay && !hasEntry && (
                <span className="w-2 h-2 rounded-full bg-primary-500" />
              )}
            </div>
            <span className="text-xs text-gray-500">
              {format(day, 'd')}
            </span>
          </div>
        )
      })}
    </div>
  )
}