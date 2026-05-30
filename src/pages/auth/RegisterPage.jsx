import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useRegister } from '@/hooks/useAuth'
import Button from '@/components/ui/Button'
import { Leaf, Stethoscope, Heart } from 'lucide-react'

const schema = z.object({
  full_name: z.string().min(2, 'Mínimo 2 caracteres'),
  email:     z.string().email('Email inválido'),
  password:  z.string().min(6, 'Mínimo 6 caracteres'),
  phone:     z.string().optional(),
  city:      z.string().optional(),
  role:      z.enum(['patient', 'therapist']),
})

const inputCls = `w-full px-4 py-3 border border-white/20 rounded-input
  text-gray-900 placeholder:text-gray-400 text-sm bg-white/70
  focus:outline-none focus:ring-2 focus:ring-primary-400/50 focus:border-primary-400/50 focus:bg-white
  transition-all`

export default function RegisterPage() {
  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { role: 'patient' },
  })
  const registerUser = useRegister()
  const selectedRole = watch('role')

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden py-8">
      {/* ── Full-canvas dark forest background ── */}
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(145deg, #050D08 0%, #0C1E10 35%, #112A17 60%, #0F2617 100%)' }}
      />

      {/* Glow orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-[10%] right-[15%] w-[500px] h-[500px] rounded-full blur-3xl"
          style={{ background: 'radial-gradient(circle, rgba(74,150,126,0.16) 0%, transparent 65%)' }}
        />
        <div
          className="absolute bottom-[15%] left-[10%] w-[400px] h-[400px] rounded-full blur-3xl"
          style={{ background: 'radial-gradient(circle, rgba(196,120,58,0.10) 0%, transparent 65%)' }}
        />
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.9) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      {/* Decorative rings */}
      <div className="absolute bottom-[8%] right-[5%] opacity-10 pointer-events-none">
        <div className="w-36 h-36 rounded-full border border-primary-400" />
        <div className="absolute inset-4 rounded-full border border-primary-400" />
      </div>

      {/* ── Floating card ── */}
      <motion.div
        initial={{ opacity: 0, y: 32, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-[420px] mx-4"
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
          <div className="flex items-center gap-3 mb-7">
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
            Crear cuenta
          </h2>
          <p className="text-gray-400 text-sm mb-6">Completa tus datos para empezar</p>

          <form onSubmit={handleSubmit(d => registerUser.mutate(d))} className="space-y-4">
            {/* Role cards */}
            <div>
              <label className="block text-[11px] font-semibold text-gray-500 mb-2 uppercase tracking-widest">Soy</label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: 'patient',   label: 'Paciente',    Icon: Heart,        desc: 'Busco apoyo' },
                  { value: 'therapist', label: 'Psicólogo/a', Icon: Stethoscope,  desc: 'Acompaño pacientes' },
                ].map(({ value, label, Icon, desc }) => (
                  <label key={value} className="cursor-pointer">
                    <input type="radio" value={value} {...register('role')} className="sr-only" />
                    <div className={`p-3.5 rounded-[16px] border-2 transition-all text-center ${
                      selectedRole === value
                        ? 'border-primary-400 bg-primary-50 shadow-glow'
                        : 'border-gray-200 bg-white/60 hover:border-gray-300'
                    }`}>
                      <Icon size={18} className={`mx-auto mb-1 ${selectedRole === value ? 'text-primary-500' : 'text-gray-400'}`} />
                      <p className={`text-xs font-semibold ${selectedRole === value ? 'text-primary-700' : 'text-gray-700'}`}>{label}</p>
                      <p className="text-[10px] text-gray-400 mt-0.5">{desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-gray-500 mb-2 uppercase tracking-widest">Nombre completo</label>
              <input {...register('full_name')} type="text" placeholder="Ana García" className={inputCls} />
              {errors.full_name && <p className="text-urgent text-xs mt-1.5">{errors.full_name.message}</p>}
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-gray-500 mb-2 uppercase tracking-widest">Email</label>
              <input {...register('email')} type="email" placeholder="tu@email.com" className={inputCls} />
              {errors.email && <p className="text-urgent text-xs mt-1.5">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-gray-500 mb-2 uppercase tracking-widest">Contraseña</label>
              <input {...register('password')} type="password" placeholder="Mínimo 6 caracteres" className={inputCls} />
              {errors.password && <p className="text-urgent text-xs mt-1.5">{errors.password.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-gray-500 mb-2 uppercase tracking-widest">Teléfono</label>
                <input {...register('phone')} type="tel" placeholder="311 234 5678" className={inputCls} />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-gray-500 mb-2 uppercase tracking-widest">Ciudad</label>
                <input {...register('city')} type="text" placeholder="Bogotá" className={inputCls} />
              </div>
            </div>

            {registerUser.isError && (
              <div className="bg-urgent-light border border-urgent/20 rounded-xl px-4 py-3">
                <p className="text-urgent text-sm">No se pudo crear la cuenta. Intenta de nuevo.</p>
              </div>
            )}

            <Button type="submit" loading={registerUser.isPending} className="w-full mt-1" size="lg">
              Crear cuenta
            </Button>
          </form>

          <p className="text-center text-sm text-gray-400 mt-5">
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" className="text-primary-500 font-semibold hover:underline">
              Ingresa aquí
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
