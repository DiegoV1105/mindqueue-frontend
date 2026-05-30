import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'
import Avatar from '@/components/ui/Avatar'
import { cn } from '@/lib/utils'

const ALERT_CONFIG = {
  urgent:    { label: 'Urgente',   bg: 'bg-urgent-light',   text: 'text-urgent',        border: 'border-urgent/25',    dot: 'bg-urgent'       },
  attention: { label: 'Atención',  bg: 'bg-accent-light',   text: 'text-accent-dark',   border: 'border-accent/25',    dot: 'bg-accent'       },
  normal:    { label: 'Estable',   bg: 'bg-primary-50',     text: 'text-primary-600',   border: 'border-primary-100',  dot: 'bg-primary-400'  },
}

export default function PatientCard({ patient, onClick }) {
  const { profile, last_summary, last_entry } = patient
  const alertLevel = last_summary?.alert_level || 'normal'
  const alert = ALERT_CONFIG[alertLevel]
  const hasUnreviewed = last_summary && !last_summary.is_reviewed

  const lastActivityText = last_entry
    ? `Última entrada ${formatDistanceToNow(new Date(last_entry.entry_date + 'T12:00:00'), { addSuffix: true, locale: es })}`
    : 'Sin entradas aún'

  return (
    <div
      onClick={onClick}
      className={cn(
        'bg-surface rounded-card p-4 shadow-card cursor-pointer',
        'border transition-all duration-200 hover:shadow-card-hover hover:-translate-y-0.5',
        alertLevel === 'urgent' ? 'border-urgent/30' : 'border-transparent'
      )}
    >
      <div className="flex items-center gap-4">
        <div className="relative flex-shrink-0">
          <Avatar src={profile.avatar_url} name={profile.full_name} size="md" />
          {hasUnreviewed && (
            <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-primary-500 rounded-full border-2 border-white animate-pulse-soft" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-gray-900 text-sm truncate">{profile.full_name}</span>
            <span className={cn(
              'px-2 py-0.5 rounded-full text-xs font-medium border flex-shrink-0',
              alert.bg, alert.text, alert.border
            )}>
              {alert.label}
            </span>
          </div>
          <p className="text-xs text-gray-400">{lastActivityText}</p>
        </div>

        {(last_summary || last_entry) && (() => {
          const stress = last_summary ? Number(last_summary.avg_stress) : last_entry?.stress_level
          const mood   = last_summary ? Number(last_summary.avg_mood)   : last_entry?.mood
          const isLive = !last_summary
          return (
            <div className="flex gap-4 flex-shrink-0 text-center">
              <div>
                <p className={cn(
                  'text-base font-bold',
                  stress >= 7 ? 'text-urgent' : stress >= 5 ? 'text-accent-dark' : 'text-primary-500'
                )}>
                  {isLive ? stress : stress.toFixed(1)}
                </p>
                <p className="text-xs text-gray-400">estrés</p>
              </div>
              <div>
                <p className={cn(
                  'text-base font-bold',
                  mood <= 4 ? 'text-urgent' : mood <= 6 ? 'text-accent-dark' : 'text-primary-500'
                )}>
                  {isLive ? mood : mood.toFixed(1)}
                </p>
                <p className="text-xs text-gray-400">ánimo</p>
              </div>
            </div>
          )
        })()}

        <span className="text-gray-300 flex-shrink-0">›</span>
      </div>

      {hasUnreviewed && (
        <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-primary-500 animate-pulse-soft" />
          <span className="text-xs text-primary-600 font-medium">Nuevo resumen semanal disponible</span>
        </div>
      )}
    </div>
  )
}
