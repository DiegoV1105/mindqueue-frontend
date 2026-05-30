import { NavLink } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { Home, BookHeart, History, CalendarDays, Calendar, User, LayoutDashboard } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function MobileNav() {
  const { user } = useAuthStore()
  const isPatient = user?.role === 'patient'

  const patientLinks = [
    { to: '/patient/dashboard', icon: Home,         label: 'Inicio'    },
    { to: '/patient/journal',   icon: BookHeart,    label: 'Diario'    },
    { to: '/patient/history',   icon: History,      label: 'Historial' },
    { to: '/patient/sessions',  icon: CalendarDays, label: 'Sesiones'  },
  ]

  const therapistLinks = [
    { to: '/therapist/dashboard', icon: LayoutDashboard, label: 'Pacientes' },
    { to: '/therapist/schedule',  icon: Calendar,        label: 'Agenda'    },
    { to: '/therapist/profile',   icon: User,            label: 'Perfil'    },
  ]

  const links = isPatient ? patientLinks : therapistLinks

  return (
    <nav className="lg:hidden fixed bottom-5 left-1/2 -translate-x-1/2 z-50">
      <div
        className="flex items-center gap-1 px-3 py-2.5 rounded-island shadow-float"
        style={{
          background: 'rgba(9, 20, 8, 0.90)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                'flex flex-col items-center gap-1 px-3.5 py-2 rounded-[18px] text-[10px] font-medium transition-all duration-150',
                isActive
                  ? 'text-primary-300'
                  : 'text-white/40 hover:text-white/70'
              )
            }
          >
            {({ isActive }) => (
              <>
                {isActive ? (
                  <span className="relative">
                    <span className="absolute -inset-2 rounded-[12px] opacity-100"
                      style={{ background: 'rgba(74,150,126,0.15)' }} />
                    <Icon size={19} className="relative z-10 text-primary-400" />
                  </span>
                ) : (
                  <Icon size={19} />
                )}
                {label}
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
