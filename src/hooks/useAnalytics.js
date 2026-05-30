import { useQuery } from '@tanstack/react-query'
import api from '@/lib/axios'

export function useAnalytics() {
  return useQuery({
    queryKey: ['analytics'],
    queryFn: () => api.get('/analytics').then(r => r.data),
  })
}