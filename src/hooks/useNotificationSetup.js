import { useEffect } from 'react'
import { useAuthStore } from '@/store/authStore'
import { useNotificationStore } from '@/store/notificationStore'
import { subscribeToNotifications } from '@/lib/supabase'
import api from '@/lib/axios'
import { toast } from 'sonner'

export function useNotificationSetup() {
  const { user } = useAuthStore()
  const { setNotifications, addNotification } = useNotificationStore()

  useEffect(() => {
    if (!user?.id) return

    api.get('/notifications')
      .then(r => setNotifications(r.data))
      .catch(() => {})

    const channel = subscribeToNotifications(user.id, (notification) => {
      addNotification(notification)
      toast(notification.title, {
        description: notification.message,
        duration: 6000,
        style: {
          background: '#FFFFFE',
          border: '1px solid #D4EAE0',
          borderRadius: '16px',
        },
      })
    })

    return () => { channel.unsubscribe() }
  }, [user?.id])
}
