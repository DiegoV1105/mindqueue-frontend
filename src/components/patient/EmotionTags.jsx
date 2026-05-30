const EMOTIONS = [
  { label: 'Calma',       color: 'bg-primary-100 text-primary-700 border-primary-200' },
  { label: 'Alegría',     color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
  { label: 'Gratitud',    color: 'bg-primary-100 text-primary-700 border-primary-200' },
  { label: 'Motivación',  color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
  { label: 'Ansiedad',    color: 'bg-orange-100 text-orange-700 border-orange-200' },
  { label: 'Tristeza',    color: 'bg-blue-100 text-blue-700 border-blue-200' },
  { label: 'Frustración', color: 'bg-red-100 text-red-700 border-red-200' },
  { label: 'Agotamiento', color: 'bg-amber-100 text-amber-700 border-amber-200' },
  { label: 'Soledad',     color: 'bg-blue-100 text-blue-700 border-blue-200' },
  { label: 'Abrumado',    color: 'bg-red-100 text-red-700 border-red-200' },
  { label: 'Confusión',   color: 'bg-gray-100 text-gray-600 border-gray-200' },
  { label: 'Nostalgia',   color: 'bg-purple-100 text-purple-700 border-purple-200' },
  { label: 'Reflexivo',   color: 'bg-gray-100 text-gray-600 border-gray-200' },
  { label: 'Enojo',       color: 'bg-red-100 text-red-700 border-red-200' },
  { label: 'Esperanza',   color: 'bg-green-100 text-green-700 border-green-200' },
  { label: 'Miedo',       color: 'bg-orange-100 text-orange-700 border-orange-200' },
]

export default function EmotionTags({ selected = [], onChange }) {
  const toggle = (label) => {
    if (selected.includes(label)) {
      onChange(selected.filter(e => e !== label))
    } else if (selected.length < 5) {
      onChange([...selected, label])
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {EMOTIONS.map(({ label, color }) => {
          const isSelected = selected.includes(label)
          return (
            <button
              key={label}
              type="button"
              onClick={() => toggle(label)}
              className={`
                px-4 py-2.5 rounded-full text-sm border transition-all duration-150
                ${isSelected
                  ? `${color} font-semibold shadow-sm scale-105`
                  : 'bg-white text-gray-500 border-gray-200 active:bg-gray-50 active:border-gray-300'
                }
              `}
            >
              {label}
            </button>
          )
        })}
      </div>
      <p className={`text-xs transition-opacity ${selected.length >= 5 ? 'text-accent-dark' : 'text-gray-400'}`}>
        {selected.length}/5 emociones seleccionadas
      </p>
    </div>
  )
}
