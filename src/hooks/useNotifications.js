import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import api from '@/lib/axios'

export function useNotifications() {
  return useQuery({
    queryKey: ['notifications'],
    queryFn: () => api.get('/notifications').then(r => r.data),
  })
}