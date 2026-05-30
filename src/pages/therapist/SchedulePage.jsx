import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useMyPatients, useCreateSession, useMySessions } from '@/hooks/useSessions'
import { useAuthStore } from '@/store/authStore'
import Button from '@/components/ui/Button'
import { format, addWeeks, startOfWeek, addDays, isSameDay, isToday, isBefore } from 'date-fns'
import { es } from 'date-fns/locale'
import { ChevronLeft, ChevronRight, X, Video, Clock } from 'lucide-react'

const HOURS = [8, 9, 10, 11, 14, 15, 16, 17]
const DAYS  = [0, 1, 2, 3, 4]

export default function SchedulePage() {
  const { user } = useAuthStore()
  const [weekOffset, setWeekOffset]     = useState(0)
  const [selectedDayIdx, setSelectedDayIdx] = useState(() => {
    const d = new Date().getDay()  // 0=Dom, 1=Lun...
    return d >= 1 && d <= 5 ? d - 1 : 0
  })
  const [selectedSlot, setSelectedSlot] = useState(null)
  const [showModal, setShowModal]       = useState(false)
  const [formData, setFormData]         = useState({ patient_id: '', meet_link: '' })
  const [conflictSlots, setConflictSlots] = useState([])

  const { data: patients } = useMyPatients()
  const { data: sessions } = useMySessions()
  const createSession = useCreateSession()

  const baseMonday = startOfWeek(new Date(), { weekStartsOn: 1 })
  const weekStart  = addWeeks(baseMonday, weekOffset)
  const weekDays   = DAYS.map(d => addDays(weekStart, d))

  const getSlotStatus = (day, hour) => {
    if (!sessions) return 'available'
    const slotDt = new Date(day)
    slotDt.setHours(hour, 0, 0, 0)
    const found = sessions.find(s => {
      const d = new Date(s.scheduled_at)
      return isSameDay(d, slotDt) && d.getHours() === hour && s.status === 'scheduled'
    })
    return found ? 'booked' : 'available'
  }

  const getPatientName = (day, hour) => {
    if (!sessions || !patients) return null
    const slotDt = new Date(day)
    slotDt.setHours(hour, 0, 0, 0)
    const found = sessions.find(s => {
      const d = new Date(s.scheduled_at)
      return isSameDay(d, slotDt) && d.getHours() === hour && s.status === 'scheduled'
    })
    if (!found?.patient_id) return null
    const p = patients.find(pt => pt.profile.id === found.patient_id)
    return p?.profile.full_name?.split(' ')[0] || 'Paciente'
  }

  const openModal = (day, hour) => {
    const slotDt = new Date(day)
    slotDt.setHours(hour, 0, 0, 0)
    setSelectedSlot(slotDt)
    setConflictSlots([])
    setFormData({ patient_id: '', meet_link: '' })
    setShowModal(true)
  }

  const handleBook = async () => {
    if (!selectedSlot || !formData.patient_id) return
    try {
      await createSession.mutateAsync({
        patient_id:   formData.patient_id,
        scheduled_at: selectedSlot.toISOString(),
        meet_link:    formData.meet_link,
      })
      setShowModal(false)
      setSelectedSlot(null)
      setConflictSlots([])
    } catch (err) {
      if (err.response?.status === 409) {
        setConflictSlots(err.response.data?.detail?.next_available || [])
      }
    }
  }

  const slotStyles = {
    available: 'bg-primary-50 border-primary-200 border-dashed',
    booked:    'bg-primary-500 border-primary-600',
    blocked:   'bg-gray-100 border-gray-200',
    pending:   'bg-orange-50 border-orange-200',
  }

  const weekLabel = `${format(weekStart, "d MMM", { locale: es })} — ${format(addDays(weekStart, 4), "d MMM yyyy", { locale: es })}`

  /* ── Modal de agendar (compartido desktop + móvil) ────────────────── */
  const BookingModal = (
    <AnimatePresence>
      {showModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/40 flex items-end lg:items-center justify-center z-50 p-0 lg:p-4"
          onClick={(e) => e.target === e.currentTarget && setShowModal(false)}
        >
          <motion.div
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="bg-white w-full lg:max-w-sm rounded-t-[24px] lg:rounded-card shadow-xl p-6 pb-8 lg:pb-6"
          >
            {/* Handle para arrastrar en móvil */}
            <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-5 lg:hidden" />

            <div className="flex items-center justify-between mb-5">
              <h3 className="font-semibold text-gray-900 text-lg">Agendar sesión</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 p-1">
                <X size={20} />
              </button>
            </div>

            {selectedSlot && (
              <div className="bg-primary-50 rounded-xl p-3 mb-5 text-sm text-primary-700 font-medium flex items-center gap-2">
                <Clock size={15} />
                {format(selectedSlot, "EEEE d 'de' MMMM 'a las' HH:mm", { locale: es })}
              </div>
            )}

            <div className="mb-4">
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Paciente</label>
              <select
                value={formData.patient_id}
                onChange={(e) => setFormData(p => ({ ...p, patient_id: e.target.value }))}
                className="w-full px-3 py-3 border border-gray-200 rounded-input text-sm
                           focus:outline-none focus:ring-2 focus:ring-primary-400 bg-white"
              >
                <option value="">Seleccionar paciente...</option>
                {patients?.map(p => (
                  <option key={p.profile.id} value={p.profile.id}>
                    {p.profile.full_name}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-5">
              <label className="block text-xs font-medium text-gray-600 mb-1.5">
                Link de videollamada <span className="text-gray-400 font-normal">(opcional)</span>
              </label>
              <div className="flex items-center gap-2 border border-gray-200 rounded-input px-3">
                <Video size={14} className="text-gray-400 shrink-0" />
                <input
                  type="url"
                  value={formData.meet_link}
                  onChange={(e) => setFormData(p => ({ ...p, meet_link: e.target.value }))}
                  placeholder="https://meet.google.com/..."
                  className="flex-1 py-3 text-sm bg-transparent focus:outline-none"
                />
              </div>
            </div>

            {conflictSlots.length > 0 && (
              <div className="bg-orange-50 border border-orange-100 rounded-xl p-3 mb-4">
                <p className="text-xs font-semibold text-orange-700 mb-2">
                  Conflicto de horario. Próximos disponibles:
                </p>
                {conflictSlots.map((slot, i) => (
                  <button
                    key={i}
                    onClick={() => { setSelectedSlot(new Date(slot)); setConflictSlots([]) }}
                    className="block w-full text-left text-xs text-orange-600 hover:text-orange-800 py-1 hover:underline"
                  >
                    → {format(new Date(slot), "EEEE d 'a las' HH:mm", { locale: es })}
                  </button>
                ))}
              </div>
            )}

            <Button
              onClick={handleBook}
              loading={createSession.isPending}
              disabled={!formData.patient_id}
              className="w-full"
              size="lg"
            >
              Confirmar sesión
            </Button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )

  return (
    <div className="max-w-5xl mx-auto pb-24 lg:pb-8">
      {/* Cabecera con navegación de semana */}
      <div className="flex items-center justify-between mb-5">
        <h1 className="font-display text-2xl text-gray-900 font-medium">Agenda</h1>
        <div className="flex items-center gap-2">
          <button onClick={() => setWeekOffset(w => w - 1)} className="p-2 rounded-lg hover:bg-gray-100">
            <ChevronLeft size={18} />
          </button>
          <span className="text-xs font-medium text-gray-600 min-w-[130px] text-center hidden sm:block">
            {weekLabel}
          </span>
          <button onClick={() => setWeekOffset(w => w + 1)} className="p-2 rounded-lg hover:bg-gray-100">
            <ChevronRight size={18} />
          </button>
          <button onClick={() => setWeekOffset(0)} className="text-xs text-primary-600 font-medium hover:underline ml-1">
            Hoy
          </button>
        </div>
      </div>

      {/* ── VISTA MÓVIL: selector de día + lista vertical ─────────────── */}
      <div className="lg:hidden">
        {/* Semana actual en texto pequeño */}
        <p className="text-xs text-gray-400 text-center mb-3">{weekLabel}</p>

        {/* Chips de día */}
        <div className="flex gap-2 overflow-x-auto pb-1 mb-4 scrollbar-hide">
          {weekDays.map((day, i) => {
            const isTodayDay = isToday(day)
            const isPast     = isBefore(day, new Date()) && !isTodayDay
            return (
              <button
                key={i}
                onClick={() => setSelectedDayIdx(i)}
                className={`flex-shrink-0 flex flex-col items-center px-4 py-2.5 rounded-2xl transition-all ${
                  selectedDayIdx === i
                    ? 'bg-primary-500 text-white shadow-sm'
                    : isTodayDay
                      ? 'bg-primary-50 text-primary-600 border border-primary-200'
                      : 'bg-white text-gray-600 border border-gray-200'
                }`}
              >
                <span className="text-[10px] font-medium uppercase tracking-wide">
                  {format(day, 'EEE', { locale: es })}
                </span>
                <span className="text-lg font-bold leading-tight">{format(day, 'd')}</span>
              </button>
            )
          })}
        </div>

        {/* Lista de slots del día seleccionado */}
        <div className="space-y-2">
          {HOURS.map(hour => {
            const day    = weekDays[selectedDayIdx]
            const status = getSlotStatus(day, hour)
            const name   = getPatientName(day, hour)
            const isPast = isBefore(new Date(day).setHours(hour + 1), new Date())

            return (
              <button
                key={hour}
                disabled={status === 'booked' || status === 'blocked' || isPast}
                onClick={() => status === 'available' && !isPast && openModal(day, hour)}
                className={`w-full flex items-center gap-4 p-4 rounded-2xl border transition-all text-left ${
                  status === 'booked'
                    ? 'bg-primary-500 border-primary-600 cursor-default'
                    : status === 'blocked'
                      ? 'bg-gray-100 border-gray-200 cursor-not-allowed'
                      : isPast
                        ? 'bg-gray-50 border-gray-100 opacity-50 cursor-not-allowed'
                        : 'bg-white border-dashed border-primary-200 active:bg-primary-50'
                }`}
              >
                <span className={`text-sm font-semibold w-12 shrink-0 ${status === 'booked' ? 'text-white' : 'text-gray-500'}`}>
                  {hour}:00
                </span>
                <span className={`text-sm font-medium flex-1 ${
                  status === 'booked'   ? 'text-white' :
                  status === 'blocked'  ? 'text-gray-400' :
                  isPast                ? 'text-gray-400' :
                                          'text-primary-600'
                }`}>
                  {status === 'booked'  ? name || 'Sesión'  :
                   status === 'blocked' ? 'Bloqueado'        :
                   isPast               ? '—'                :
                                          'Disponible'}
                </span>
                {status === 'available' && !isPast && (
                  <span className="text-xs text-primary-400 shrink-0">+ Agendar</span>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* ── VISTA DESKTOP: grilla semanal completa ──────────────────────── */}
      <div className="hidden lg:block">
        <div className="bg-white rounded-card shadow-card overflow-hidden">
          <div className="grid gap-px" style={{ gridTemplateColumns: '56px repeat(5, 1fr)' }}>
            <div className="p-3 bg-gray-50" />
            {weekDays.map((day, i) => (
              <div key={i} className="p-3 bg-gray-50 text-center border-l border-gray-100">
                <div className="text-xs text-gray-500 uppercase tracking-wide">
                  {format(day, 'EEE', { locale: es })}
                </div>
                <div className={`text-base font-semibold mt-0.5 mx-auto w-8 h-8 flex items-center justify-center rounded-full
                  ${isToday(day) ? 'bg-primary-500 text-white' : 'text-gray-800'}`}>
                  {format(day, 'd')}
                </div>
              </div>
            ))}
          </div>

          {HOURS.map(hour => (
            <div key={hour} className="grid gap-px border-t border-gray-100"
              style={{ gridTemplateColumns: '56px repeat(5, 1fr)' }}>
              <div className="p-2 text-right text-xs text-gray-400 pt-3">{hour}:00</div>
              {weekDays.map((day, di) => {
                const status      = getSlotStatus(day, hour)
                const patientName = getPatientName(day, hour)
                return (
                  <div
                    key={di}
                    onClick={() => status === 'available' && openModal(day, hour)}
                    className={`h-12 border-l border-gray-100 m-1 rounded-lg border transition-all
                      flex items-center justify-center text-xs font-medium
                      ${status === 'available' ? 'cursor-pointer hover:bg-primary-100' : ''}
                      ${slotStyles[status] || slotStyles.available}`}
                  >
                    {status === 'booked'  && <span className="text-white text-xs truncate px-2">{patientName}</span>}
                    {status === 'blocked' && <span className="text-gray-400 text-xs">—</span>}
                    {status === 'pending' && <span className="text-orange-700 text-xs">Solicitud</span>}
                  </div>
                )
              })}
            </div>
          ))}
        </div>

        {/* Leyenda */}
        <div className="flex gap-4 mt-4 flex-wrap">
          {[
            { label: 'Sesión confirmada', color: 'bg-primary-500' },
            { label: 'Disponible',        color: 'bg-primary-50 border border-dashed border-primary-300' },
            { label: 'Solicitud',         color: 'bg-orange-100 border border-orange-200' },
            { label: 'Bloqueado',         color: 'bg-gray-100 border border-gray-200' },
          ].map(({ label, color }) => (
            <div key={label} className="flex items-center gap-2 text-xs text-gray-500">
              <div className={`w-4 h-4 rounded ${color}`} />
              {label}
            </div>
          ))}
        </div>
      </div>

      {BookingModal}
    </div>
  )
}
