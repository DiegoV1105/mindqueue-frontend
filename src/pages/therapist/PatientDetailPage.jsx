import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { usePatientSummaries, useTrends, useMySessions } from '@/hooks/useSessions'
import api from '@/lib/axios'
import Avatar from '@/components/ui/Avatar'
import EmptyState from '@/components/ui/EmptyState'
import SessionCard from '@/components/therapist/SessionCard'
import { LineChart, Line, XAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { CalendarDays } from 'lucide-react'

const ALERT_CONFIG = {
  urgent:    { label: 'Urgente',  bg: 'bg-urgent-light',  text: 'text-urgent',      border: 'border-urgent/25'    },
  attention: { label: 'Atención', bg: 'bg-accent-light',  text: 'text-accent-dark', border: 'border-accent/25'    },
  normal:    { label: 'Estable',  bg: 'bg-primary-50',    text: 'text-primary-600', border: 'border-primary-100'  },
}

const PATTERN_LABELS = {
  stress_trend_increasing:  { label: 'Estrés en alza',   color: 'bg-red-100 text-red-700' },
  stress_trend_decreasing:  { label: 'Estrés bajando',   color: 'bg-green-100 text-green-700' },
  high_stress_frequency:    { label: 'Estrés frecuente', color: 'bg-orange-100 text-orange-700' },
  low_mood_persistent:      { label: 'Ánimo bajo',       color: 'bg-blue-100 text-blue-700' },
  sleep_energy_issue:       { label: 'Sueño-energía',    color: 'bg-purple-100 text-purple-700' },
  work_stress_pattern:      { label: 'Estrés laboral',   color: 'bg-amber-100 text-amber-700' },
}

export default function PatientDetailPage() {
  const { id: patientId } = useParams()
  const [activeTab, setActiveTab] = useState('week')

  const { data: profile } = useQuery({
    queryKey: ['patient-profile', patientId],
    queryFn: () => api.get(`/auth/profile/${patientId}`).then(r => r.data),
  })

  const { data: summaries } = usePatientSummaries(patientId)
  const { data: trends } = useTrends(patientId, 6)
  const { data: allSessions } = useMySessions()

  const patientSessions = allSessions?.filter(s => s.patient_id === patientId) || []
  const upcomingSessions = patientSessions.filter(s => s.status === 'scheduled')
  const pastSessions = patientSessions.filter(s => s.status !== 'scheduled')

  const currentSummary = summaries?.[0]
  const alert = ALERT_CONFIG[currentSummary?.alert_level || 'normal']

  const trendChartData = trends?.map(t => ({
    semana: format(new Date(t.week_start + 'T12:00:00'), "d MMM", { locale: es }),
    Estrés:  Number(t.avg_stress?.toFixed(1)),
    Ánimo:   Number(t.avg_mood?.toFixed(1)),
    Energía: Number(t.avg_energy?.toFixed(1)),
  })) || []

  const TABS = [
    { key: 'week',     label: 'Esta semana' },
    { key: 'history',  label: 'Historial' },
    { key: 'sessions', label: 'Sesiones' },
  ]

  return (
    <div className="max-w-5xl mx-auto pb-24 lg:pb-8">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

        <div className="lg:col-span-2 space-y-4">

          <div className="bg-white rounded-card shadow-card p-5">
            <div className="flex items-center gap-3 mb-4">
              <Avatar src={profile?.avatar_url} name={profile?.full_name} size="lg" />
              <div>
                <h2 className="font-semibold text-gray-900">{profile?.full_name}</h2>
                <p className="text-xs text-gray-500">{profile?.city}</p>
              </div>
            </div>

            {currentSummary && (
              <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold
                border ${alert.bg} ${alert.text} ${alert.border} mb-4`}>
                <span className={`w-1.5 h-1.5 rounded-full ${
                  currentSummary.alert_level === 'urgent' ? 'bg-urgent' :
                  currentSummary.alert_level === 'attention' ? 'bg-accent' : 'bg-primary-400'
                }`} />
                {alert.label} esta semana
              </div>
            )}

            {currentSummary && (
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Estrés',  val: currentSummary.avg_stress,  invert: true },
                  { label: 'Ánimo',   val: currentSummary.avg_mood,    invert: false },
                  { label: 'Energía', val: currentSummary.avg_energy,  invert: false },
                  { label: 'Sueño',   val: currentSummary.avg_sleep,   invert: false, max: 5 },
                ].map(({ label, val, invert, max = 10 }) => {
                  const pct = val / max
                  const isGood = invert ? pct < 0.5 : pct > 0.6
                  const isBad  = invert ? pct > 0.7 : pct < 0.4
                  return (
                    <div key={label} className="bg-gray-50 rounded-xl p-3">
                      <div className={`text-xl font-bold ${
                        isBad ? 'text-red-600' : isGood ? 'text-primary-600' : 'text-amber-600'
                      }`}>
                        {Number(val).toFixed(1)}
                        <span className="text-xs text-gray-400 font-normal">/{max}</span>
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5">{label}</div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {currentSummary && (
            <div className="bg-white rounded-card shadow-card p-4">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                Días registrados esta semana
              </p>
              <div className="flex gap-1.5">
                {['L','M','X','J','V','S','D'].map((d, i) => {
                  const recorded = currentSummary.recorded_days?.includes(i)
                    ?? (i < currentSummary.days_recorded) // fallback para resúmenes viejos
                  return (
                    <div
                      key={i}
                      className={`flex-1 h-9 rounded-xl flex items-center justify-center text-xs font-semibold transition-colors ${
                        recorded
                          ? 'bg-primary-500 text-white shadow-sm'
                          : 'bg-gray-100 text-gray-400'
                      }`}
                    >
                      {d}
                    </div>
                  )
                })}
              </div>
              <p className="text-xs text-gray-400 mt-2.5 text-center">
                {currentSummary.days_recorded} de 7 días con registro
              </p>
            </div>
          )}
        </div>

        <div className="lg:col-span-3">
          <div className="bg-white rounded-card shadow-card">

            <div className="flex border-b border-gray-100 px-4">
              {TABS.map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`py-4 px-4 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.key
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="p-5">

              {activeTab === 'week' && currentSummary && (
                <div className="space-y-5">

                  {currentSummary.ai_clinical_insight && (
                    <div className="border border-primary-100 rounded-xl p-4"
                      style={{ background: 'linear-gradient(135deg, #EFF6F2 0%, #F7F3EE 100%)' }}>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="bg-primary-100 text-primary-700 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                          Análisis IA
                        </span>
                        <span className="text-xs text-gray-400">orientativo, no diagnóstico</span>
                      </div>
                      <p className="text-sm text-gray-800 leading-relaxed">
                        {currentSummary.ai_clinical_insight}
                      </p>
                    </div>
                  )}

                  <div>
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                      Resumen de la semana
                    </h4>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {currentSummary.summary_text}
                    </p>
                  </div>

                  {currentSummary.critical_days?.length > 0 && (
                    <div>
                      <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                        Días críticos
                      </h4>
                      <div className="space-y-2">
                        {currentSummary.critical_days.map((day, i) => (
                          <div key={i} className="bg-red-50 border border-red-100 rounded-xl p-3">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-semibold text-red-700">
                                {format(new Date(day.date + 'T12:00:00'), "EEEE d 'de' MMMM", { locale: es })}
                              </span>
                              <span className="text-xs text-red-500">
                                Estrés: {day.stress}/10 · Ánimo: {day.mood}/10
                              </span>
                            </div>
                            {day.situation && (
                              <p className="text-xs text-red-600 italic">"{day.situation}"</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {Object.keys(currentSummary.patterns || {}).length > 0 && (
                    <div>
                      <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                        Patrones detectados
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {Object.entries(currentSummary.patterns).map(([key, val]) => {
                          if (!val) return null
                          const patternKey = val === true ? key : `${key}_${val}`
                          const config = PATTERN_LABELS[patternKey] || PATTERN_LABELS[key]
                          if (!config) return null
                          return (
                            <span key={key} className={`px-3 py-1 rounded-full text-xs font-medium ${config.color}`}>
                              {config.label}
                            </span>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  {Object.keys(currentSummary.emotions_freq || {}).length > 0 && (
                    <div>
                      <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                        Emociones de la semana
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {Object.entries(currentSummary.emotions_freq)
                          .sort((a, b) => b[1] - a[1])
                          .slice(0, 6)
                          .map(([emotion, count]) => (
                          <span key={emotion} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs">
                            {emotion} <span className="text-gray-400">({count})</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'history' && (
                <div>
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4">
                    Tendencias últimas 6 semanas
                  </h4>
                  {trendChartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={200}>
                      <LineChart data={trendChartData}>
                        <XAxis dataKey="semana" tick={{ fontSize: 11 }} />
                        <Tooltip
                          contentStyle={{ borderRadius: 8, border: '1px solid #E5E7EB', fontSize: 12 }}
                        />
                        <Legend wrapperStyle={{ fontSize: 11 }} />
                        <Line type="monotone" dataKey="Estrés"  stroke="#E76F51" strokeWidth={2} dot={{ r: 3 }} />
                        <Line type="monotone" dataKey="Ánimo"   stroke="#2D6A4F" strokeWidth={2} dot={{ r: 3 }} />
                        <Line type="monotone" dataKey="Energía" stroke="#F4A261" strokeWidth={2} dot={{ r: 3 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <p className="text-center text-gray-400 text-sm py-8">
                      No hay suficientes semanas de datos todavía
                    </p>
                  )}
                </div>
              )}

              {activeTab === 'sessions' && (
                <div className="space-y-5">
                  {patientSessions.length === 0 ? (
                    <EmptyState
                      icon={CalendarDays}
                      title="Sin sesiones registradas"
                      description="Las sesiones con este paciente aparecerán aquí."
                    />
                  ) : (
                    <>
                      {upcomingSessions.length > 0 && (
                        <div>
                          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                            Próximas
                          </h4>
                          <div className="space-y-2">
                            {upcomingSessions.map((session, i) => (
                              <motion.div
                                key={session.id}
                                initial={{ opacity: 0, y: 6 }}
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
                          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                            Historial de sesiones
                          </h4>
                          <div className="space-y-2">
                            {pastSessions.map((session, i) => (
                              <motion.div
                                key={session.id}
                                initial={{ opacity: 0, y: 6 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                              >
                                <SessionCard session={session} />
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}