import { motion } from 'framer-motion'
import { useAuthStore } from '@/store/authStore'
import { useMyEntries, useStreak, useCurrentSummary } from '@/hooks/useJournal'
import { useMySessions } from '@/hooks/useSessions'
import { format, isToday } from 'date-fns'
import { es } from 'date-fns/locale'
import { useNavigate } from 'react-router-dom'
import Button from '@/components/ui/Button'
import StreakCard from '@/components/patient/StreakCard'
import WeekCalendar from '@/components/patient/WeekCalendar'
import { LineChart, Line, ResponsiveContainer, Tooltip } from 'recharts'
import { CalendarDays, Video, PenLine, TrendingUp } from 'lucide-react'

const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }
const container = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } }

export default function PatientDashboard() {
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const { data: entries } = useMyEntries(14)
  const { data: streak } = useStreak()
  const { data: sessions } = useMySessions()

  const todayEntry = entries?.find(e => isToday(new Date(e.entry_date + 'T12:00:00')))
  const upcomingSessions = sessions
    ?.filter(s => s.status === 'scheduled' && new Date(s.scheduled_at) > new Date())
    .sort((a, b) => new Date(a.scheduled_at) - new Date(b.scheduled_at)) || []
  const nextSession = upcomingSessions[0]

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Buenos días' : hour < 18 ? 'Buenas tardes' : 'Buenas noches'

  const moodData = entries?.slice(0, 7).reverse().map(e => ({
    date: format(new Date(e.entry_date + 'T12:00:00'), 'EEE', { locale: es }),
    mood: e.mood,
    estres: e.stress_level,
  })) || []

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="max-w-2xl mx-auto space-y-5 pb-28 lg:pb-8"
    >
      {/* Greeting */}
      <motion.div variants={item}>
        <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-1.5">
          {format(new Date(), "EEEE, d 'de' MMMM", { locale: es })}
        </p>
        <h1 className="text-[1.75rem] font-bold leading-tight text-gray-900">
          <span className="text-gradient">{greeting},</span>{' '}
          {user?.full_name?.split(' ')[0]} 👋
        </h1>
      </motion.div>

      {/* CTA register or "ya registraste" */}
      {!todayEntry ? (
        <motion.div
          variants={item}
          className="rounded-card p-6 text-white relative overflow-hidden cursor-pointer group"
          style={{ background: 'linear-gradient(140deg, #091408 0%, #132C1B 50%, #1B3624 100%)' }}
          onClick={() => navigate('/patient/journal')}
        >
          {/* Glow */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -right-12 -top-12 w-48 h-48 rounded-full blur-2xl opacity-30"
              style={{ background: 'radial-gradient(circle, #4A967E, transparent)' }} />
            <div className="absolute -left-8 bottom-0 w-36 h-36 rounded-full blur-2xl opacity-20"
              style={{ background: 'radial-gradient(circle, #C4783A, transparent)' }} />
            <div className="absolute inset-0 opacity-[0.05]"
              style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.9) 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
          </div>

          <div className="relative z-10 flex items-start justify-between gap-4">
            <div>
              <p className="text-primary-300/70 text-[11px] font-semibold uppercase tracking-widest mb-2">Hoy</p>
              <h3 className="text-xl font-bold text-white mb-2">
                ¿Cómo va tu día?
              </h3>
              <p className="text-white/50 text-sm mb-5">Registra cómo te sientes en 2 minutos</p>
              <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[14px] bg-white text-primary-700 text-sm font-semibold
                group-hover:bg-primary-50 transition-colors shadow-sm">
                <PenLine size={14} />
                Registrar ahora
              </span>
            </div>
            <div className="text-5xl opacity-15 flex-shrink-0 mt-1">🌿</div>
          </div>
        </motion.div>
      ) : (
        <motion.div variants={item}
          className="rounded-card p-4 border border-primary-100 flex items-center gap-3"
          style={{ background: 'linear-gradient(135deg, #EFF6F2, #F7F3EE)' }}>
          <div className="w-10 h-10 rounded-2xl bg-primary-500 flex items-center justify-center flex-shrink-0">
            <span className="text-white text-lg">✓</span>
          </div>
          <div>
            <p className="text-sm font-semibold text-primary-800">¡Bien hecho! Ya registraste hoy.</p>
            <button onClick={() => navigate('/patient/journal')}
              className="text-xs text-primary-500 hover:underline mt-0.5">
              Ver o editar mi registro →
            </button>
          </div>
        </motion.div>
      )}

      {/* Week calendar */}
      <motion.div variants={item} className="bg-surface rounded-card p-5 shadow-card">
        <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-4">Esta semana</p>
        <WeekCalendar entries={entries || []} />
      </motion.div>

      {/* Streak */}
      {streak && (
        <motion.div variants={item}>
          <StreakCard streak={streak.streak} total={streak.total_entries} />
        </motion.div>
      )}

      {/* Next session */}
      {nextSession && (
        <motion.div variants={item}
          className="bg-surface rounded-card p-5 shadow-card border border-primary-100">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-8 h-8 rounded-xl bg-primary-50 flex items-center justify-center">
              <CalendarDays size={15} className="text-primary-500" />
            </div>
            <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-widest">Próxima sesión</p>
          </div>
          <p className="text-base font-semibold text-gray-900 capitalize">
            {format(new Date(nextSession.scheduled_at), "EEEE d 'de' MMMM 'a las' HH:mm", { locale: es })}
          </p>
          {nextSession.meet_link && (
            <a href={nextSession.meet_link} target="_blank" rel="noreferrer"
              className="inline-flex items-center gap-2 mt-3 text-sm text-primary-500 font-semibold hover:underline">
              <Video size={13} />
              Unirse a la sesión
            </a>
          )}
        </motion.div>
      )}

      {/* Mood chart */}
      {moodData.length > 2 && (
        <motion.div variants={item} className="bg-surface rounded-card p-5 shadow-card">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={14} className="text-gray-400" />
            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest">Ánimo — últimos días</p>
          </div>
          <ResponsiveContainer width="100%" height={80}>
            <LineChart data={moodData}>
              <Line type="monotone" dataKey="mood" stroke="#2D6A4F" strokeWidth={2.5}
                dot={{ fill: '#2D6A4F', r: 3.5, strokeWidth: 0 }}
                activeDot={{ r: 5.5, strokeWidth: 0, fill: '#4A967E' }} />
              <Tooltip
                formatter={(v) => [`${v}/10`, 'Ánimo']}
                labelStyle={{ color: '#4E4840', fontSize: 11 }}
                contentStyle={{ borderRadius: 12, border: '1px solid #E4DDD3', fontSize: 12, background: '#FFFFFE', padding: '6px 12px' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      )}
    </motion.div>
  )
}
