import { useState } from 'react'
import { motion } from 'framer-motion'
import { isToday } from 'date-fns'
import { useNavigate } from 'react-router-dom'
import { useMyEntries } from '@/hooks/useJournal'
import JournalForm from '@/components/patient/JournalForm'
import JournalSuccess from '@/components/patient/JournalSuccess'
import Button from '@/components/ui/Button'
import { CheckCircle2, Pencil } from 'lucide-react'

function MetricRow({ emoji, label, value, max }) {
  const pct = (value - 1) / (max - 1)
  const color = pct >= 0.6 ? 'bg-primary-500' : pct >= 0.3 ? 'bg-accent' : 'bg-urgent'
  return (
    <div className="flex items-center gap-3">
      <span className="text-lg w-6 text-center leading-none">{emoji}</span>
      <div className="flex-1">
        <div className="flex justify-between mb-1">
          <span className="text-xs text-gray-500">{label}</span>
          <span className="text-xs font-semibold text-gray-700">{value}/{max}</span>
        </div>
        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div className={`h-full rounded-full ${color}`} style={{ width: `${pct * 100}%` }} />
        </div>
      </div>
    </div>
  )
}

export default function JournalPage() {
  const navigate = useNavigate()
  const { data: entries, isLoading } = useMyEntries(7)
  const [completed, setCompleted] = useState(false)
  const [result, setResult] = useState(null)
  const [editMode, setEditMode] = useState(false)

  const todayEntry = entries?.find(e => isToday(new Date(e.entry_date + 'T12:00:00')))

  if (completed && result) {
    return (
      <JournalSuccess
        motivationalMessage={result.motivational_message}
        streak={result.streak}
      />
    )
  }

  // Already registered today — show summary + edit option
  if (!isLoading && todayEntry && !editMode) {
    return (
      <div className="max-w-lg mx-auto pt-4 pb-24 px-4 lg:pt-8 lg:pb-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="w-20 h-20 rounded-full bg-primary-500 flex items-center justify-center mx-auto mb-5">
            <CheckCircle2 size={36} className="text-white" />
          </div>
          <h2 className="font-display text-2xl text-gray-900 font-medium mb-1">
            ¡Ya registraste tu día!
          </h2>
          <p className="text-gray-500 text-sm mb-8">
            Enviaste tu registro de hoy. Vuelve mañana para mantener tu racha.
          </p>

          <div className="bg-white rounded-card p-5 shadow-card text-left mb-6 space-y-4">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Tu resumen de hoy
            </p>
            <MetricRow emoji="😴" label="Sueño"   value={todayEntry.sleep_quality} max={5}  />
            <MetricRow emoji="💚" label="Ánimo"   value={todayEntry.mood}          max={10} />
            <MetricRow emoji="⚡" label="Energía" value={todayEntry.energy_level}  max={10} />
            <MetricRow emoji="🌊" label="Estrés"  value={todayEntry.stress_level}  max={10} />
            {todayEntry.emotions_tags?.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {todayEntry.emotions_tags.map(tag => (
                  <span key={tag}
                    className="px-2.5 py-1 bg-primary-50 text-primary-700 rounded-full text-xs font-medium">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-3">
            <Button className="w-full" onClick={() => navigate('/patient/dashboard')} size="lg">
              Volver al inicio
            </Button>
            <button
              onClick={() => setEditMode(true)}
              className="flex items-center gap-1.5 justify-center w-full py-2.5 text-sm text-gray-400 hover:text-gray-600 transition-colors"
            >
              <Pencil size={13} />
              Editar mi registro de hoy
            </button>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto pt-4 pb-24 px-4 lg:pt-8 lg:pb-8">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center mb-8"
      >
        <h1 className="font-display text-2xl text-gray-900 mb-2">
          {editMode ? 'Editar registro de hoy' : 'Tu día de hoy'}
        </h1>
        <p className="text-gray-500">
          {editMode ? 'Actualiza cómo te sentiste hoy' : 'Hoy es un buen día para reflexionar'}
        </p>
      </motion.div>

      <JournalForm
        initialValues={editMode ? {
          sleep_quality:  todayEntry.sleep_quality,
          stress_level:   todayEntry.stress_level,
          energy_level:   todayEntry.energy_level,
          mood:           todayEntry.mood,
          emotions_tags:  todayEntry.emotions_tags || [],
          main_situation: todayEntry.main_situation || '',
          free_text:      todayEntry.free_text || '',
        } : undefined}
        editDate={editMode ? todayEntry.entry_date : undefined}
        onSuccess={(data) => {
          if (editMode) {
            navigate('/patient/dashboard')
          } else {
            setResult(data)
            setCompleted(true)
          }
        }}
        onCancel={editMode ? () => setEditMode(false) : undefined}
      />
    </div>
  )
}
