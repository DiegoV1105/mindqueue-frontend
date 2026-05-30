import { motion } from 'framer-motion'
import { Flame } from 'lucide-react'

export default function StreakCard({ streak = 0, total = 0 }) {
  if (streak === 0) return null

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="rounded-card p-5 border border-accent/20"
      style={{ background: 'linear-gradient(135deg, #F9E8D0 0%, #FDF4EC 100%)' }}
    >
      <div className="flex items-center gap-4">
        <motion.div
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          className="w-12 h-12 rounded-2xl bg-accent/15 flex items-center justify-center flex-shrink-0"
        >
          <Flame size={22} className="text-accent" />
        </motion.div>
        <div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-bold text-accent-dark">{streak}</span>
            <span className="text-sm text-accent font-medium">días seguidos</span>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">{total} entradas en total · ¡Sigue así!</p>
        </div>
      </div>
    </motion.div>
  )
}
