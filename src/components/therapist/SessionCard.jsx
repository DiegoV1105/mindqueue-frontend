import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { Video, Clock, MapPin } from 'lucide-react'
import { cn } from '@/lib/utils'
import Avatar from '@/components/ui/Avatar'
import Card from '@/components/ui/Card'

const STATUS_CONFIG = {
  scheduled: { label: 'Programada', color: 'text-primary-600', bg: 'bg-primary-50' },
  completed: { label: 'Completada', color: 'text-green-600',  bg: 'bg-green-50' },
  cancelled: { label: 'Cancelada',  color: 'text-gray-500',    bg: 'bg-gray-100' },
  no_show:   { label: 'No asistió', color: 'text-red-500',     bg: 'bg-red-50' },
}

export default function SessionCard({ session, showPatient = false }) {
  const status = STATUS_CONFIG[session.status] || STATUS_CONFIG.scheduled

  return (
    <Card className={cn('p-4', session.status === 'scheduled' && 'border-primary-100')}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          {showPatient && session.profiles && (
            <div className="flex items-center gap-2 mb-2">
              <Avatar
                src={session.profiles.avatar_url}
                name={session.profiles.full_name}
                size="sm"
              />
              <span className="font-medium text-gray-900 text-sm truncate">
                {session.profiles.full_name}
              </span>
            </div>
          )}
          <div className="flex items-center gap-2 mb-1">
            <Clock size={14} className="text-gray-400" />
            <span className="text-sm font-medium text-gray-900">
              {format(new Date(session.scheduled_at), "EEEE d 'de' MMMM", { locale: es })}
            </span>
          </div>
          <p className="text-sm text-gray-500 pl-6">
            {format(new Date(session.scheduled_at), 'HH:mm')} · {session.duration_min} minutos
          </p>
          {session.notes && (
            <p className="text-xs text-gray-400 mt-2 pl-6 line-clamp-2">
              {session.notes}
            </p>
          )}
        </div>
        <div className="flex flex-col items-end gap-2">
          <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium', status.bg, status.color)}>
            {status.label}
          </span>
          {session.meet_link && session.status === 'scheduled' && (
            <a
              href={session.meet_link}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-xs bg-primary-100 text-primary-700 px-3 py-1.5 rounded-full font-medium hover:bg-primary-200 transition-colors"
            >
              <Video size={12} />
              Unirse
            </a>
          )}
        </div>
      </div>
    </Card>
  )
}