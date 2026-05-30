import { format, subDays } from 'date-fns'
import { es } from 'date-fns/locale'
import Card from '@/components/ui/Card'
import AlertBadge from './AlertBadge'
import PatternChips from './PatternChips'
import MoodChart from '@/components/patient/MoodChart'

export default function WeeklySummaryView({ summary, entries }) {
  if (!summary) return null

  const chartData = entries?.slice(0, 7).reverse().map(e => ({
    date: e.entry_date,
    mood: e.mood,
    stress: e.stress_level,
    energy: e.energy_level,
  })) || []

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wide">Resumen semanal</p>
          <h3 className="font-display text-xl text-gray-900">
            {format(subDays(new Date(), 7), "d 'de' MMM", { locale: es })} — {format(new Date(), "d 'de' MMM", { locale: es })}
          </h3>
        </div>
        <AlertBadge level={summary.alert_level} showDot />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card className="text-center p-3">
          <p className="text-2xl font-bold text-gray-900">
            {Number(summary.avg_mood).toFixed(1)}
          </p>
          <p className="text-xs text-gray-500">ánimo promedio</p>
        </Card>
        <Card className="text-center p-3">
          <p className="text-2xl font-bold text-gray-900">
            {Number(summary.avg_stress).toFixed(1)}
          </p>
          <p className="text-xs text-gray-500">estrés promedio</p>
        </Card>
        <Card className="text-center p-3">
          <p className="text-2xl font-bold text-primary-500">
            {summary.total_entries}
          </p>
          <p className="text-xs text-gray-500">entradas</p>
        </Card>
      </div>

      {chartData.length > 2 && (
        <Card className="p-4">
          <h4 className="text-sm font-semibold text-gray-700 mb-4">Tendencia semanal</h4>
          <MoodChart data={chartData} height={120} />
        </Card>
      )}

      {summary.patterns && summary.patterns.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-3">Patrones detectados</h4>
          <PatternChips patterns={summary.patterns} />
        </div>
      )}

      {summary.notes && (
        <div className="bg-gray-50 rounded-card p-4">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Observaciones</h4>
          <p className="text-sm text-gray-600">{summary.notes}</p>
        </div>
      )}
    </div>
  )
}