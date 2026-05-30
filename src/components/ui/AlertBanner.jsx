import { motion } from 'framer-motion'
import { X, AlertCircle, CheckCircle, Info } from 'lucide-react'
import { cn } from '@/lib/utils'

const variants = {
  info:    { icon: Info,         bg: 'bg-blue-50',    border: 'border-blue-200',    text: 'text-blue-800'   },
  success: { icon: CheckCircle, bg: 'bg-green-50',   border: 'border-green-200',   text: 'text-green-800'   },
  warning: { icon: AlertCircle,  bg: 'bg-accent-light', border: 'border-accent/30',   text: 'text-accent-dark' },
  error:   { icon: AlertCircle,  bg: 'bg-urgent-light', border: 'border-urgent/30', text: 'text-urgent'     },
}

export default function AlertBanner({ variant = 'info', message, onDismiss, className }) {
  const { icon: Icon, bg, border, text } = variants[variant]

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className={cn(
        'flex items-center justify-between gap-3 px-4 py-3 rounded-lg border',
        bg, border, text,
        className
      )}
    >
      <div className="flex items-center gap-2">
        <Icon size={16} />
        <span className="text-sm font-medium">{message}</span>
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="p-1 rounded hover:bg-black/5 transition-colors"
        >
          <X size={14} />
        </button>
      )}
    </motion.div>
  )
}