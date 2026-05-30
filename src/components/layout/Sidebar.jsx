import { NavLink } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { Home, BookHeart, History, CalendarDays, Calendar, User, LayoutDashboard, Leaf } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function Sidebar() {
  const { user } = useAuthStore()
  const isPatient = user?.role === 'patient'

  const patientLinks = [
    { to: '/patient/dashboard', icon: Home,         label: 'Inicio'    },
    { to: '/patient/journal',   icon: BookHeart,    label: 'Mi diario' },
    { to: '/patient/history',   icon: History,      label: 'Historial' },
    { to: '/patient/sessions',  icon: CalendarDays, label: 'Sesiones'  },
  ]

  const therapistLinks = [
    { to: '/therapist/dashboard', icon: LayoutDashboard, label: 'Pacientes' },
    { to: '/therapist/schedule',  icon: Calendar,        label: 'Agenda'    },
    { to: '/therapist/profile',   icon: User,            label: 'Mi perfil' },
  ]

  const links = isPatient ? patientLinks : therapistLinks

  return (
    <aside
      className="hidden lg:flex flex-col fixed left-0 top-0 h-screen w-[260px] z-40"
      style={{ background: 'linear-gradient(170deg, #060F09 0%, #0C1E10 45%, #0F2617 75%, #132C1B 100%)' }}
    >
      {/* Decorative glow orb */}
      <div className="absolute top-0 left-0 w-full h-48 pointer-events-none overflow-hidden">
        <div className="absolute -top-12 -left-12 w-48 h-48 rounded-full blur-3xl opacity-25"
          style={{ background: 'radial-gradient(circle, #4A967E, transparent)' }} />
      </div>

      {/* Logo */}
      <div className="relative z-10 px-6 pt-8 pb-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #1A4131, #2D6A4F)', boxShadow: '0 0 16px rgba(74,150,126,0.4)' }}>
            <Leaf size={17} className="text-primary-200" />
          </div>
          <span className="font-syne text-xl font-bold text-white tracking-tight">
            MindQueue
          </span>
        </div>
      </div>

      {/* Nav */}
      <nav className="relative z-10 flex-1 px-3 space-y-0.5">
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-4 py-2.5 rounded-[14px] text-sm font-medium transition-all duration-150 group relative',
                isActive
                  ? 'text-primary-300'
                  : 'text-white/40 hover:text-white/75 hover:bg-white/5'
              )
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <span className="absolute inset-0 rounded-[14px] ring-1 ring-primary-400/25"
                    style={{ background: 'rgba(74,150,126,0.12)' }} />
                )}
                <Icon
                  size={17}
                  className={cn(
                    'relative z-10 transition-colors',
                    isActive ? 'text-primary-400' : 'text-white/30 group-hover:text-white/60'
                  )}
                />
                <span className="relative z-10">{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Divider */}
      <div className="relative z-10 mx-4 border-t border-white/6 my-2" />

      {/* User card */}
      <div className="relative z-10 p-4">
        <div className="rounded-[16px] p-3"
          style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(74,150,126,0.25)', border: '1px solid rgba(74,150,126,0.3)' }}>
              <span className="text-xs font-bold text-primary-300">
                {user?.full_name?.charAt(0)?.toUpperCase()}
              </span>
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-white/75 truncate">{user?.full_name}</p>
              <p className="text-[10px] text-white/30">
                {user?.role === 'therapist' ? 'Psicólogo/a' : 'Paciente'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}
