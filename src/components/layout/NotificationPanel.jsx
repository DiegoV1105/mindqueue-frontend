import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'
import { Bell, CalendarDays, BookOpen, AlertTriangle, X, CheckCheck } from 'lucide-react'
import { useNotificationStore } from '@/store/notificationStore'
import api from '@/lib/axios'

const TYPE_CONFIG = {
  session_scheduled: { icon: CalendarDays, color: 'text-primary-500', bg: 'bg-primary-50' },
  session_reminder:  { icon: CalendarDays, color: 'text-primary-500', bg: 'bg-primary-50' },
  new_summary:       { icon: BookOpen,     color: 'text-accent',      bg: 'bg-accent-light' },
  alert_urgent:      { icon: AlertTriangle, color: 'text-urgent',     bg: 'bg-urgent-light' },
}

function getTypeConfig(type) {
  return TYPE_CONFIG[type] || { icon: Bell, color: 'text-gray-500', bg: 'bg-gray-100' }
}

export default function NotificationPanel({ open, onClose }) {
  const { notifications, markAllRead } = useNotificationStore()
  const panelRef = useRef(null)

  // Close on outside click
  useEffect(() => {
    if (!open) return
    function handle(e) {
      if (panelRef.current && !panelRef.current.contains(e.target)) onClose()
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [open, onClose])

  // Mark all read when panel opens
  useEffect(() => {
    if (!open || notifications.every(n => n.is_read)) return
    api.patch('/notifications/read-all').catch(() => {})
    markAllRead()
  }, [open])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={panelRef}
          initial={{ opacity: 0, y: -8, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.97 }}
          transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
          className="absolute right-0 top-full mt-2 w-[340px] bg-surface rounded-card shadow-auth border border-gray-100 z-50 overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <span className="text-sm font-semibold text-gray-900">Notificaciones</span>
            <button onClick={onClose} className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
              <X size={15} />
            </button>
          </div>

          {/* List */}
          <div className="max-h-[380px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 px-5">
                <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center mb-3">
                  <Bell size={20} className="text-gray-400" />
                </div>
                <p className="text-sm text-gray-500 font-medium">Sin notificaciones</p>
                <p className="text-xs text-gray-400 mt-1 text-center">Las notificaciones de sesiones y resúmenes aparecerán aquí</p>
              </div>
            ) : (
              notifications.map(n => {
                const { icon: Icon, color, bg } = getTypeConfig(n.type)
                return (
                  <div
                    key={n.id}
                    className={`flex gap-3 px-5 py-4 border-b border-gray-50 last:border-0 transition-colors ${
                      !n.is_read ? 'bg-primary-50/40' : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                      <Icon size={15} className={color} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-xs font-semibold text-gray-900 leading-snug">{n.title}</p>
                        {!n.is_read && (
                          <span className="w-2 h-2 rounded-full bg-primary-500 flex-shrink-0 mt-1" />
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5 leading-relaxed line-clamp-2">{n.message}</p>
                      {n.created_at && (
                        <p className="text-[10px] text-gray-400 mt-1.5">
                          {formatDistanceToNow(new Date(n.created_at), { addSuffix: true, locale: es })}
                        </p>
                      )}
                    </div>
                  </div>
                )
              })
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="px-5 py-3 border-t border-gray-100 flex items-center gap-1.5 text-xs text-gray-400">
              <CheckCheck size={12} />
              {notifications.filter(n => !n.is_read).length === 0
                ? 'Todo al día'
                : `${notifications.filter(n => !n.is_read).length} sin leer`}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
