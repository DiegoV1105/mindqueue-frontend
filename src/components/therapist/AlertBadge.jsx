import { cn } from '@/lib/utils'

const ALERT_CONFIG = {
  urgent:    { label: 'Urgente',   bg: 'bg-urgent-light',    text: 'text-urgent',       border: 'border-urgent/20',  dot: 'bg-urgent'      },
  attention: { label: 'Atención',  bg: 'bg-accent-light',    text: 'text-accent-dark',   border: 'border-accent/20',   dot: 'bg-accent'      },
  normal:    { label: 'Normal',    bg: 'bg-primary-50',     text: 'text-primary-600',  border: 'border-primary-100', dot: 'bg-primary-400' },
}

export default function AlertBadge({ level = 'normal', showDot = false }) {
  const config = ALERT_CONFIG[level]

  return (
    <span className={cn(
      'inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium border',
      config.bg, config.text, config.border
    )}>
      {showDot && (
        <span className={cn('w-1.5 h-1.5 rounded-full', config.dot)} />
      )}
      {config.label}
    </span>
  )
}