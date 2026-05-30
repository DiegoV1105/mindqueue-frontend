import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import Button from '@/components/ui/Button'

export default function JournalSuccess({ motivationalMessage, streak }) {
  const navigate = useNavigate()

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-primary-50 flex flex-col items-center justify-center p-8 text-center"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: [0, 1.15, 1] }}
        transition={{ duration: 0.5, times: [0, 0.7, 1] }}
        className="w-20 h-20 rounded-full bg-primary-500 flex items-center justify-center mb-8"
      >
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
          <motion.path
            d="M8 18L15 25L28 11"
            stroke="white"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          />
        </svg>
      </motion.div>

      {motivationalMessage && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="max-w-sm mb-8"
        >
          <p className="font-display text-xl text-primary-800 italic leading-relaxed">
            "{motivationalMessage}"
          </p>
        </motion.div>
      )}

      {streak > 1 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="bg-white rounded-full px-5 py-2 shadow-card mb-8"
        >
          <span className="text-sm font-semibold text-gray-700">
            🔥 {streak} días seguidos
          </span>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <Button
          variant="ghost-primary"
          onClick={() => navigate('/patient/dashboard')}
        >
          Volver al inicio
        </Button>
      </motion.div>
    </motion.div>
  )
}