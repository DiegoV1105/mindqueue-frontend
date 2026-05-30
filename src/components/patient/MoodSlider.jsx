const COLOR_MAP = {
  active: { primary: 'bg-primary-400', accent: 'bg-accent', urgent: 'bg-urgent' },
  text:   { primary: 'text-primary-500', accent: 'text-accent-dark', urgent: 'text-urgent' },
  ring:   { primary: 'ring-primary-300', accent: 'ring-accent/40', urgent: 'ring-urgent/30' },
}

export default function MoodSlider({
  label, emoji, value, onChange,
  min = 1, max = 10,
  minLabel, maxLabel,
  invertColor = false
}) {
  const steps = Array.from({ length: max - min + 1 }, (_, i) => i + min)

  const getColorKey = (step) => {
    const pct = (step - min) / (max - min)
    const score = invertColor ? 1 - pct : pct
    if (score >= 0.7) return 'primary'
    if (score >= 0.4) return 'accent'
    return 'urgent'
  }

  const valueColorKey = getColorKey(value)

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="text-2xl leading-none">{emoji}</span>
          <span className="text-sm font-medium text-gray-800">{label}</span>
        </div>
        <span className={`text-2xl font-bold tabular-nums ${COLOR_MAP.text[valueColorKey]}`}>
          {value}
        </span>
      </div>

      {/* h-12 fixed so layout never shifts when selection changes */}
      <div className="flex">
        {steps.map((step) => {
          const isSelected = step === value
          const key = getColorKey(step)
          return (
            <button
              key={step}
              type="button"
              onClick={() => onChange(step)}
              className="flex-1 h-12 flex items-center justify-center"
            >
              <span
                className={`
                  block w-full h-1.5 rounded-full origin-center
                  transition-transform duration-150
                  ${isSelected
                    ? `scale-y-[5] ${COLOR_MAP.active[key]}`
                    : 'scale-y-100 bg-gray-200'
                  }
                `}
              />
            </button>
          )
        })}
      </div>

      <div className="flex justify-between text-xs text-gray-400 px-0.5">
        <span>{minLabel}</span>
        <span>{maxLabel}</span>
      </div>
    </div>
  )
}
