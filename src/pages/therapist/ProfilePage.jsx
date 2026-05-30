import { useState } from 'react'
import { useAuthStore } from '@/store/authStore'
import { useForm } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import api from '@/lib/axios'
import Avatar from '@/components/ui/Avatar'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import { useLogout } from '@/hooks/useAuth'
import { CheckCircle } from 'lucide-react'

export default function ProfilePage() {
  const { user, setAuth, accessToken, refreshToken } = useAuthStore()
  const logout = useLogout()
  const [saved, setSaved] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      full_name: user?.full_name || '',
      bio: user?.bio || '',
      phone: user?.phone || '',
      city: user?.city || '',
    }
  })

  const updateProfile = useMutation({
    mutationFn: (data) => api.put('/auth/me', data).then(r => r.data),
    onSuccess: (updated) => {
      setAuth({ ...user, ...updated }, accessToken, refreshToken)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    },
  })

  return (
    <div className="max-w-lg mx-auto space-y-6 pb-24 lg:pb-8">
      <div>
        <h1 className="font-display text-2xl text-gray-900 font-medium mb-1">
          Mi perfil
        </h1>
        <p className="text-gray-500 text-sm">
          Gestiona tu información personal
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center"
      >
        <Avatar
          src={user?.avatar_url}
          name={user?.full_name}
          size="lg"
          className="w-20 h-20 text-2xl mb-4"
        />
        <p className="text-lg font-medium text-gray-900">{user?.full_name}</p>
        <p className="text-sm text-gray-500">{user?.email}</p>
        <span className="mt-2 px-3 py-1 rounded-full text-xs bg-primary-50 text-primary-600 font-medium">
          Psicólogo
        </span>
      </motion.div>

      <Card>
        <form onSubmit={handleSubmit((data) => updateProfile.mutate(data))} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Email
            </label>
            <input
              type="email"
              value={user?.email || ''}
              disabled
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-input
                         text-gray-400 text-sm cursor-not-allowed"
            />
            <p className="text-xs text-gray-400 mt-1">El email no se puede cambiar desde aquí</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Nombre completo
            </label>
            <input
              {...register('full_name', { required: true })}
              type="text"
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-input
                         text-gray-900 text-sm
                         focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Ciudad
            </label>
            <input
              {...register('city')}
              type="text"
              placeholder="Ej: Bogotá"
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-input
                         text-gray-900 text-sm
                         focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Teléfono
            </label>
            <input
              {...register('phone')}
              type="tel"
              placeholder="Ej: +57 300 000 0000"
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-input
                         text-gray-900 text-sm
                         focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Presentación <span className="text-gray-400 font-normal">(opcional)</span>
            </label>
            <textarea
              {...register('bio')}
              rows={3}
              placeholder="Cuéntales a tus pacientes sobre ti..."
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-card
                         text-gray-900 text-sm resize-none
                         focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent"
            />
          </div>

          {saved && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 text-sm text-green-700 bg-green-50 border border-green-100 rounded-xl px-4 py-3"
            >
              <CheckCircle size={16} className="shrink-0" />
              Cambios guardados correctamente
            </motion.div>
          )}

          <Button
            type="submit"
            loading={updateProfile.isPending}
            className="w-full"
          >
            Guardar cambios
          </Button>
        </form>
      </Card>

      <Card className="border-red-100">
        <h3 className="text-sm font-medium text-gray-900 mb-3">Zona de peligro</h3>
        <p className="text-xs text-gray-500 mb-4">
          Cerrar sesión te llevará a la página de login.
        </p>
        <Button variant="danger" onClick={logout} className="w-full">
          Cerrar sesión
        </Button>
      </Card>
    </div>
  )
}