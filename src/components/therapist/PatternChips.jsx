const PATTERN_CONFIG = {
  improving:    { label: 'Mejorando',     color: 'bg-green-100 text-green-700 border-green-200'   },
  declining:    { label: 'En declive',    color: 'bg-red-100 text-red-700 border-red-200'        },
  stable:       { label: 'Estable',       color: 'bg-blue-100 text-blue-700 border-blue-200'     },
  inconsistent: { label: 'Inconsistente', color: 'bg-orange-100 text-orange-700 border-orange-200' },
  high_stress:   { label: 'Estrés alto',   color: 'bg-red-100 text-red-700 border-red-200'        },
  low_mood:     { label: 'Ánimo bajo',   color: 'bg-blue-100 text-blue-700 border-blue-200'     },
  sleep_issue:   { label: 'Problemas de sueño', color: 'bg-purple-100 text-purple-700 border-purple-200' },
  anxiety:      { label: 'Ansiedad',     color: 'bg-orange-100 text-orange-700 border-orange-200' },
}

export default function PatternChips({ patterns = [] }) {
  if (patterns.length === 0) return null

  return (
    <div className="flex flex-wrap gap-2">
      {patterns.map((pattern) => {
        const config = PATTERN_CONFIG[pattern.type] || { label: pattern.type, color: 'bg-gray-100 text-gray-600 border-gray-200' }
        return (
          <span
            key={pattern.type}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border ${config.color}`}
          >
            {config.label}
            {pattern.severity && (
              <span className="ml-1 opacity-60">({pattern.severity})</span>
            )}
          </span>
        )
      })}
    </div>
  )
}