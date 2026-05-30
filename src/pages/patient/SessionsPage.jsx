import { useMySessions } from '@/hooks/useSessions'
import { motion } from 'framer-motion'
import SessionCard from '@/components/therapist/SessionCard'
import EmptyState from '@/components/ui/EmptyState'
import Spinner from '@/components/ui/Spinner'
import { CalendarDays } from 'lucide-react'

export default function SessionsPage() {
  const { data: sessions, isLoading } = useMySessions()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner size="lg" />
      </div>
    )
  }

  const upcomingSessions = sessions?.filter(s => s.status === 'scheduled') || []
  const pastSessions = sessions?.filter(s => s.status !== 'scheduled') || []

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-20 lg:pb-8">
      <div>
        <h1 className="font-display text-2xl text-gray-900 font-medium mb-1">
          Mis sesiones
        </h1>
        <p className="text-gray-500 text-sm">
          Tu agenda con tu psicólogo
        </p>
      </div>

      {upcomingSessions.length === 0 && pastSessions.length === 0 && (
        <EmptyState
          icon={CalendarDays}
          title="Sin sesiones programadas"
          description="Cuando tu psicólogo programe una sesión, aparecerá aquí."
        />
      )}

      {upcomingSessions.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-gray-700 mb-3">Próximas</h2>
          <div className="space-y-3">
            {upcomingSessions.map((session, i) => (
              <motion.div
                key={session.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <SessionCard session={session} />
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {pastSessions.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-gray-700 mb-3">Pasadas</h2>
          <div className="space-y-3">
            {pastSessions.map((session, i) => (
              <motion.div
                key={session.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <SessionCard session={session} />
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}