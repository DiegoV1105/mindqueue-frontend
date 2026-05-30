import { motion } from 'framer-motion'
import { useMyEntries } from '@/hooks/useJournal'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import EmptyState from '@/components/ui/EmptyState'
import Spinner from '@/components/ui/Spinner'
import { BookOpen } from 'lucide-react'

export default function HistoryPage() {
  const { data: entries, isLoading } = useMyEntries(60)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner size="lg" />
      </div>
    )
  }

  if (!entries || entries.length === 0) {
    return (
      <div className="max-w-lg mx-auto">
        <EmptyState
          icon={BookOpen}
          title="Sin entradas aún"
          description="Tu historial de diario aparecerá aquí cuando empieces a registrar tus días."
        />
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-20 lg:pb-8">
      <div>
        <h1 className="font-display text-2xl text-gray-900 font-medium mb-1">
          Mi historial
        </h1>
        <p className="text-gray-500 text-sm">
          {entries.length} entradas registradas
        </p>
      </div>

      <div className="space-y-3">
        {entries.map((entry, i) => (
          <motion.div
            key={entry.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
            className="bg-white rounded-card p-5 shadow-card"
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium text-gray-900">
                {format(new Date(entry.entry_date + 'T12:00:00'), "EEEE d 'de' MMMM", { locale: es })}
              </p>
              <span className="text-xs text-gray-400 capitalize">
                {format(new Date(entry.entry_date + 'T12:00:00'), 'yyyy', { locale: es })}
              </span>
            </div>

            <div className="grid grid-cols-4 gap-3 mb-3">
              <div className="text-center">
                <p className="text-lg font-bold text-primary-500">{entry.mood}</p>
                <p className="text-[10px] text-gray-400">ánimo</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-gray-900">{entry.stress_level}</p>
                <p className="text-[10px] text-gray-400">estrés</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-gray-900">{entry.energy_level}</p>
                <p className="text-[10px] text-gray-400">energía</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-gray-900">{entry.sleep_quality}</p>
                <p className="text-[10px] text-gray-400">sueño</p>
              </div>
            </div>

            {entry.emotions_tags && entry.emotions_tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {entry.emotions_tags.map(tag => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-600"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {entry.free_text && (
              <p className="mt-3 text-xs text-gray-500 line-clamp-3">
                {entry.free_text}
              </p>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  )
}