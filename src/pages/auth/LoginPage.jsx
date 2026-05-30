import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useLogin } from '@/hooks/useAuth'
import Button from '@/components/ui/Button'
import { Leaf } from 'lucide-react'

const schema = z.object({
  email:    z.string().email('Email inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
})

const inputCls = `w-full px-4 py-3.5 border border-white/20 rounded-input
  text-gray-900 placeholder:text-gray-400 text-sm bg-white/70
  focus:outline-none focus:ring-2 focus:ring-primary-400/50 focus:border-primary-400/50 focus:bg-white
  transition-all`

export default function LoginPage() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  })
  const login = useLogin()

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* ── Full-canvas dark forest background ── */}
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(145deg, #050D08 0%, #0C1E10 35%, #112A17 60%, #0F2617 100%)' }}
      />

      {/* Glow orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-[15%] left-[10%] w-[600px] h-[600px] rounded-full blur-3xl"
          style={{ background: 'radial-gradient(circle, rgba(74,150,126,0.18) 0%, transparent 65%)' }}
        />
        <div
          className="absolute bottom-[10%] right-[5%] w-[500px] h-[500px] rounded-full blur-3xl"
          style={{ background: 'radial-gradient(circle, rgba(196,120,58,0.12) 0%, transparent 65%)' }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full blur-3xl"
          style={{ background: 'radial-gradient(circle, rgba(45,106,79,0.08) 0%, transparent 60%)' }}
        />
        {/* Dot grid */}
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.9) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      {/* Decorative rings */}
      <div className="absolute top-[12%] right-[8%] opacity-10 pointer-events-none">
        <div className="w-48 h-48 rounded-full border border-primary-400" />
        <div className="absolute inset-4 rounded-full border border-primary-400" />
        <div className="absolute inset-8 rounded-full border border-primary-400" />
      </div>

      {/* ── Floating card ── */}
      <motion.div
        initial={{ opacity: 0, y: 32, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-[400px] mx-4"
      >
        <div
          className="rounded-[28px] p-8 shadow-auth"
          style={{
            background: 'rgba(247, 243, 238, 0.96)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
          }}
        >
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-sm"
              style={{ background: 'linear-gradient(135deg, #1A4131, #2D6A4F)' }}
            >
              <Leaf size={18} className="text-primary-200" />
            </div>
            <span className="font-syne text-xl text-primary-900 font-bold tracking-tight">
              MindQueue
            </span>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 leading-tight mb-1">
            Bienvenido de vuelta
          </h2>
          <p className="text-gray-400 text-sm mb-7">Ingresa a tu cuenta para continuar</p>

          <form onSubmit={handleSubmit(d => login.mutate(d))} className="space-y-4">
            <div>
              <label className="block text-[11px] font-semibold text-gray-500 mb-2 uppercase tracking-widest">
                Email
              </label>
              <input {...register('email')} type="email" placeholder="tu@email.com" className={inputCls} />
              {errors.email && <p className="text-urgent text-xs mt-1.5">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-gray-500 mb-2 uppercase tracking-widest">
                Contraseña
              </label>
              <input {...register('password')} type="password" placeholder="••••••••" className={inputCls} />
              {errors.password && <p className="text-urgent text-xs mt-1.5">{errors.password.message}</p>}
            </div>

            {login.isError && (
              <div className="bg-urgent-light border border-urgent/20 rounded-xl px-4 py-3">
                <p className="text-urgent text-sm">Credenciales incorrectas. Verifica tu email y contraseña.</p>
              </div>
            )}

            <Button type="submit" loading={login.isPending} className="w-full mt-1" size="lg">
              Ingresar
            </Button>
          </form>

          <p className="text-center text-sm text-gray-400 mt-5">
            ¿No tienes cuenta?{' '}
            <Link to="/register" className="text-primary-500 font-semibold hover:underline">
              Regístrate aquí
            </Link>
          </p>
        </div>

        {/* Below-card quote */}
        <p className="text-center text-white/25 text-xs mt-5 font-display italic px-4">
          "El espacio entre sesiones es donde más importa el acompañamiento."
        </p>
      </motion.div>
    </div>
  )
}
