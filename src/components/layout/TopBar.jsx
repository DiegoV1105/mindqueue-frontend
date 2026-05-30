import { useState } from 'react'
import { Bell, Leaf } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { useNotificationStore } from '@/store/notificationStore'
import { useLogout } from '@/hooks/useAuth'
import Avatar from '@/components/ui/Avatar'
import Button from '@/components/ui/Button'
import NotificationPanel from './NotificationPanel'

export default function TopBar() {
  const { user } = useAuthStore()
  const { unreadCount } = useNotificationStore()
  const logout = useLogout()
  const [notifOpen, setNotifOpen] = useState(false)

  return (
    <header className="sticky top-0 z-30 glass border-b border-gray-100/80">
      <div className="flex items-center justify-between px-4 lg:px-6 h-14">
        {/* Mobile logo */}
        <div className="flex items-center gap-2.5 lg:hidden">
          <div className="w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #1A4131, #2D6A4F)' }}>
            <Leaf size={13} className="text-primary-200" />
          </div>
          <span className="font-syne font-bold text-[15px] text-gray-900 tracking-tight">MindQueue</span>
        </div>
        <div className="hidden lg:block" />

        <div className="flex items-center gap-1.5">
          {/* Bell with panel */}
          <div className="relative">
            <button
              onClick={() => setNotifOpen(v => !v)}
              className="relative p-2 rounded-xl text-gray-500 hover:bg-gray-100 transition-colors"
            >
              <Bell size={17} />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-urgent rounded-full text-[10px] text-white font-semibold flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>
            <NotificationPanel open={notifOpen} onClose={() => setNotifOpen(false)} />
          </div>

          <Avatar src={user?.avatar_url} name={user?.full_name} size="sm" />
          <Button variant="ghost" size="sm" onClick={logout}>Salir</Button>
        </div>
      </div>
    </header>
  )
}
