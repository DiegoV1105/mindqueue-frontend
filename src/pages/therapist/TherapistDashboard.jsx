import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useMyPatients, useMySessions, useTherapistInsight, useLinkPatient } from '@/hooks/useSessions'
import { useAuthStore } from '@/store/authStore'
import { useNavigate } from 'react-router-dom'
import PatientCard from '@/components/therapist/PatientCard'
import Button from '@/components/ui/Button'
import { Users, FileText, AlertTriangle, CalendarDays, UserPlus, X } from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

const ALERT_ORDER = { urgent: 0, attention: 1, normal: 2 }

export default function TherapistDashboard() {
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const { data: patients, isLoading } = useMyPatients()
  const { data: allSessions } = useMySessions()
  const [filter, setFilter] = useState('all')

  const upcomingSessions = allSessions
    ?.filter(s => s.status === 'scheduled' && new Date(s.scheduled_at) > new Date())
    .sort((a, b) => new Date(a.scheduled_at) - new Date(b.scheduled_at)) || []

  const sortedPatients = [...(patients || [])].sort((a, b) => {
    const aLevel = a.last_summary?.alert_level || 'normal'
    const bLevel = b.last_summary?.alert_level || 'normal'
    return ALERT_ORDER[aLevel] - ALERT_ORDER[bLevel]
  })

  const filteredPatients = sortedPatients.filter(p => {
    if (filter === 'alerts') return ['urgent','attention'].includes(p.last_summary?.alert_level)
    if (filter === 'inactive') {
      if (!p.last_entry) return true
      const days = Math.floor((Date.now() - new Date(p.last_entry.entry_date + 'T12:00:00')) / 86400000)
      return days >= 5
    }
    return true
  })

  const urgentCount = patients?.filter(p => p.last_summary?.alert_level === 'urgent').length || 0
  const unreviewed = patients?.filter(p => p.last_summary && !p.last_summary.is_reviewed).length || 0

  const { data: aiInsight } = useTherapistInsight()
  const linkPatient = useLinkPatient()
  const [showLinkModal, setShowLinkModal] = useState(false)
  const [linkEmail, setLinkEmail] = useState('')
  const [linkSuccess, setLinkSuccess] = useState(null)

  const handleLink = async () => {
    try {
      const result = await linkPatient.mutateAsync(linkEmail)
      setLinkSuccess(result.patient.full_name)
      setLinkEmail('')
    } catch (err) {
      // error shown via linkPatient.error
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-24 lg:pb-8">
      <div>
        <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-1">
          {format(new Date(), "EEEE, d 'de' MMMM", { locale: es })}
        </p>
        <h1 className="text-[1.75rem] font-bold text-gray-900 leading-tight">
          Hola, <span className="text-gradient">{user?.full_name?.split(' ')[0]}</span>
        </h1>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white rounded-card p-3 lg:p-4 shadow-card text-center">
          <p className="text-2xl font-bold text-gray-900">{patients?.length || 0}</p>
          <p className="text-[11px] text-gray-500 mt-1 flex items-center justify-center gap-1">
            <Users size={11} /> Pacientes
          </p>
        </div>
        <div className={`rounded-card p-3 lg:p-4 shadow-card text-center ${unreviewed > 0 ? 'bg-primary-50 border border-primary-100' : 'bg-white'}`}>
          <p className={`text-2xl font-bold ${unreviewed > 0 ? 'text-primary-600' : 'text-gray-900'}`}>
            {unreviewed}
          </p>
          <p className="text-[11px] text-gray-500 mt-1 flex items-center justify-center gap-1">
            <FileText size={11} /> Sin revisar
          </p>
        </div>
        <div className={`rounded-card p-3 lg:p-4 shadow-card text-center ${urgentCount > 0 ? 'bg-urgent-light border border-urgent/20' : 'bg-white'}`}>
          <p className={`text-2xl font-bold ${urgentCount > 0 ? 'text-urgent' : 'text-gray-900'}`}>
            {urgentCount}
          </p>
          <p className="text-[11px] text-gray-500 mt-1 flex items-center justify-center gap-1">
            <AlertTriangle size={11} /> Urgentes
          </p>
        </div>
      </div>

      {aiInsight?.insight && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="border border-primary-100 rounded-card p-4"
          style={{ background: 'linear-gradient(135deg, #EFF6F2 0%, #F7F3EE 100%)' }}
        >
          <div className="flex items-center gap-2 mb-2.5">
            <span className="bg-primary-100 text-primary-700 text-xs font-semibold px-2.5 py-0.5 rounded-full">
              Análisis IA
            </span>
            <span className="text-xs font-semibold text-primary-600">
              Tu práctica esta semana
            </span>
          </div>
          <p className="text-sm text-gray-800 leading-relaxed">
            {aiInsight.insight}
          </p>
          <p className="text-xs text-gray-400 mt-2.5">
            Basado en {aiInsight.patients_analyzed} paciente{aiInsight.patients_analyzed !== 1 ? 's' : ''} analizados
          </p>
        </motion.div>
      )}

      <div className="flex items-center gap-2">
        <div className="flex gap-2 flex-1">
          {[
            { key: 'all',      label: 'Todos' },
            { key: 'alerts',   label: 'Con alertas' },
            { key: 'inactive', label: 'Sin actividad' },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`px-4 py-1.5 rounded-full text-sm transition-all ${
                filter === key
                  ? 'bg-primary-500 text-white font-medium'
                  : 'bg-white text-gray-500 border border-gray-200 hover:border-gray-300'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <button
          onClick={() => { setShowLinkModal(true); setLinkSuccess(null) }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium
                     bg-primary-500 text-white hover:bg-primary-600 transition-colors shrink-0"
        >
          <UserPlus size={14} />
          <span className="hidden sm:inline">Vincular paciente</span>
        </button>
      </div>

      <div className="space-y-3">
        {isLoading && (
          <div className="text-center py-12 text-gray-400">Cargando pacientes...</div>
        )}
        {!isLoading && filteredPatients.length === 0 && (
          <div className="text-center py-12 bg-white rounded-card shadow-card">
            <p className="text-gray-400 text-sm mb-3">No hay pacientes en esta categoría</p>
            {filter === 'all' && (
              <button
                onClick={() => { setShowLinkModal(true); setLinkSuccess(null) }}
                className="text-sm text-primary-500 font-medium hover:underline flex items-center gap-1 mx-auto"
              >
                <UserPlus size={14} /> Vincular tu primer paciente
              </button>
            )}
          </div>
        )}
        {filteredPatients.map((patient, i) => (
          <motion.div
            key={patient.profile.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <PatientCard
              patient={patient}
              onClick={() => navigate(`/therapist/patients/${patient.profile.id}`)}
            />
          </motion.div>
        ))}
      </div>

      {upcomingSessions.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <CalendarDays size={14} />
              Próximas sesiones
            </h3>
            <button
              onClick={() => navigate('/therapist/schedule')}
              className="text-xs text-primary-500 hover:underline"
            >
              Ver todas →
            </button>
          </div>
          <div className="space-y-2">
            {upcomingSessions.slice(0, 3).map(session => (
              <div key={session.id} className="bg-white rounded-xl p-4 shadow-card flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-800">
                    {session.profiles?.full_name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {format(new Date(session.scheduled_at), "EEEE d 'a las' HH:mm 'hs'", { locale: es })} · {session.duration_min} min
                  </p>
                </div>
                {session.meet_link && (
                  <a
                    href={session.meet_link}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs bg-primary-100 text-primary-700 px-3 py-1.5 rounded-full font-medium hover:bg-primary-200 transition-colors"
                  >
                    Unirse
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal: vincular paciente */}
      <AnimatePresence>
        {showLinkModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 flex items-end lg:items-center justify-center z-50 p-0 lg:p-4"
            onClick={(e) => e.target === e.currentTarget && setShowLinkModal(false)}
          >
            <motion.div
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="bg-white w-full lg:max-w-sm rounded-t-[24px] lg:rounded-card shadow-xl p-6 pb-8 lg:pb-6"
            >
              <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-5 lg:hidden" />
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900 text-lg">Vincular paciente</h3>
                <button onClick={() => setShowLinkModal(false)} className="text-gray-400 hover:text-gray-600 p-1">
                  <X size={20} />
                </button>
              </div>
              <p className="text-sm text-gray-500 mb-5">
                Ingresa el email con el que el paciente se registró en MindQueue.
              </p>

              {linkSuccess ? (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  className="bg-primary-50 border border-primary-100 rounded-xl p-4 text-center mb-4">
                  <p className="text-primary-700 font-medium text-sm">
                    ✓ {linkSuccess} vinculado correctamente
                  </p>
                  <p className="text-primary-500 text-xs mt-1">Ya aparece en tu lista de pacientes</p>
                </motion.div>
              ) : (
                <>
                  <div className="mb-4">
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">Email del paciente</label>
                    <input
                      type="email"
                      value={linkEmail}
                      onChange={(e) => setLinkEmail(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && linkEmail && handleLink()}
                      placeholder="paciente@email.com"
                      className="w-full px-3 py-3 border border-gray-200 rounded-input text-sm
                                 focus:outline-none focus:ring-2 focus:ring-primary-400 bg-white"
                    />
                  </div>
                  {linkPatient.isError && (
                    <div className="bg-red-50 border border-red-100 rounded-lg px-3 py-2 mb-4">
                      <p className="text-red-600 text-xs">
                        {linkPatient.error?.response?.data?.detail || 'Error al vincular paciente'}
                      </p>
                    </div>
                  )}
                  <Button
                    onClick={handleLink}
                    loading={linkPatient.isPending}
                    disabled={!linkEmail}
                    className="w-full"
                    size="lg"
                  >
                    Vincular paciente
                  </Button>
                </>
              )}

              {linkSuccess && (
                <Button variant="ghost" onClick={() => setShowLinkModal(false)} className="w-full mt-2" size="lg">
                  Cerrar
                </Button>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}