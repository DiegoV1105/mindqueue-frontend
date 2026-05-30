import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCreateEntry, useUpdateEntry } from '@/hooks/useJournal'
import Button from '@/components/ui/Button'
import MoodSlider from './MoodSlider'
import EmotionTags from './EmotionTags'

const TOTAL_STEPS = 3

const DEFAULT_VALUES = {
  sleep_quality:  3,
  stress_level:   5,
  energy_level:   5,
  mood:           5,
  emotions_tags:  [],
  main_situation: '',
  free_text:      '',
}

export default function JournalForm({ onSuccess, onCancel, initialValues, editDate }) {
  const isEdit = !!editDate
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({ ...DEFAULT_VALUES, ...initialValues })

  const createEntry = useCreateEntry()
  const updateEntry = useUpdateEntry()

  const mutation = isEdit ? updateEntry : createEntry
  const errorDetail = mutation.error?.response?.data?.detail

  const updateField = (field, value) =>
    setFormData(prev => ({ ...prev, [field]: value }))

  const handleSubmit = () => {
    if (isEdit) {
      updateEntry.mutate({ entry_date: editDate, data: formData }, {
        onSuccess: (data) => onSuccess?.(data),
      })
    } else {
      createEntry.mutate(formData, {
        onSuccess: (data) => onSuccess?.(data),
      })
    }
  }

  return (
    <div className="max-w-lg mx-auto">
      {/* Step indicator */}
      <div className="flex items-center justify-center gap-2 mb-6">
        {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
          <div
            key={i}
            className={`h-2 rounded-full transition-all duration-300 ${
              i + 1 <= step ? 'w-8 bg-primary-500' : 'w-2 bg-gray-200'
            }`}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div>
              <h2 className="font-display text-2xl text-gray-900 mb-0.5">
                ¿Cómo fue hoy?
              </h2>
              <p className="text-gray-500 text-sm">Esto toma menos de 2 minutos</p>
            </div>

            <MoodSlider
              label="¿Cómo dormiste anoche?"
              emoji="😴"
              value={formData.sleep_quality}
              onChange={(v) => updateField('sleep_quality', v)}
              min={1} max={5}
              minLabel="Muy mal" maxLabel="Excelente"
            />
            <MoodSlider
              label="¿Cuánto estrés sentiste hoy?"
              emoji="🌊"
              value={formData.stress_level}
              onChange={(v) => updateField('stress_level', v)}
              min={1} max={10}
              minLabel="Sin estrés" maxLabel="Mucho estrés"
              invertColor
            />
            <MoodSlider
              label="¿Cómo estuvo tu energía?"
              emoji="⚡"
              value={formData.energy_level}
              onChange={(v) => updateField('energy_level', v)}
              min={1} max={10}
              minLabel="Sin energía" maxLabel="Lleno de energía"
            />
            <MoodSlider
              label="¿Cómo estuvo tu ánimo?"
              emoji="💚"
              value={formData.mood}
              onChange={(v) => updateField('mood', v)}
              min={1} max={10}
              minLabel="Muy bajo" maxLabel="Muy bien"
            />

            <div className="flex gap-3">
              {onCancel && (
                <Button type="button" variant="ghost" onClick={onCancel} size="lg" className="flex-1">
                  Cancelar
                </Button>
              )}
              <Button type="button" onClick={() => setStep(2)} size="lg" className={onCancel ? 'flex-[2]' : 'w-full'}>
                Continuar →
              </Button>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div>
              <h2 className="font-display text-2xl text-gray-900 mb-0.5">
                ¿Qué sentiste hoy?
              </h2>
              <p className="text-gray-500 text-sm">Selecciona todo lo que aplique</p>
            </div>

            <EmotionTags
              selected={formData.emotions_tags}
              onChange={(tags) => updateField('emotions_tags', tags)}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ¿Qué situación marcó más tu día?{' '}
                <span className="text-gray-400 font-normal">(opcional)</span>
              </label>
              <input
                type="text"
                placeholder="Ej: una conversación difícil, una buena noticia..."
                value={formData.main_situation}
                onChange={(e) => updateField('main_situation', e.target.value)}
                maxLength={300}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-input
                           text-sm text-gray-900 placeholder:text-gray-400
                           focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent"
              />
            </div>

            <div className="flex gap-3">
              <Button type="button" variant="ghost" onClick={() => setStep(1)} size="lg" className="flex-1">
                ← Atrás
              </Button>
              <Button type="button" onClick={() => setStep(3)} size="lg" className="flex-[2]">
                Continuar →
              </Button>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-5"
          >
            <div>
              <h2 className="font-display text-2xl text-gray-900 mb-0.5">
                ¿Algo más que quieras agregar?
              </h2>
              <p className="text-gray-500 text-sm">
                Este espacio es solo para ti. Puedes saltarlo si quieres.
              </p>
            </div>

            <textarea
              value={formData.free_text}
              onChange={(e) => updateField('free_text', e.target.value)}
              placeholder="Escribe lo que quieras... nadie más que tú y tu psicólogo podrán leerlo."
              rows={5}
              maxLength={2000}
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-card
                         text-sm text-gray-900 placeholder:text-gray-400 resize-none
                         focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent"
            />
            <p className="text-right text-xs text-gray-400 -mt-3">
              {formData.free_text.length}/2000
            </p>

            {mutation.isError && (
              <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                <p className="text-red-600 text-sm font-medium">
                  {errorDetail === 'Ya existe una entrada para este día. Usa PUT para actualizar.'
                    ? 'Ya tienes un registro para hoy. Usa "Editar mi registro de hoy" si deseas cambiarlo.'
                    : (typeof errorDetail === 'string' ? errorDetail : 'Algo salió mal. Intenta de nuevo.')}
                </p>
              </div>
            )}

            <div className="flex gap-3">
              <Button type="button" variant="ghost" onClick={() => setStep(2)} size="lg" className="flex-1">
                ← Atrás
              </Button>
              <Button
                type="button"
                onClick={handleSubmit}
                loading={mutation.isPending}
                size="lg"
                className="flex-[2]"
              >
                {isEdit ? 'Guardar cambios ✓' : 'Registrar mi día ✓'}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
