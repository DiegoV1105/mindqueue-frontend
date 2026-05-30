import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/axios'

export function useMyEntries(limit = 30) {
  return useQuery({
    queryKey: ['journal', 'entries', limit],
    queryFn: () => api.get(`/journal/entries?limit=${limit}`).then(r => r.data),
  })
}

export function useCreateEntry() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data) => api.post('/journal/entry', data).then(r => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['journal'] })
      qc.invalidateQueries({ queryKey: ['analytics'] })
    },
  })
}

export function useUpdateEntry() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ entry_date, data }) =>
      api.put(`/journal/entry/${entry_date}`, data).then(r => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['journal'] })
      qc.invalidateQueries({ queryKey: ['analytics'] })
    },
  })
}

export function useStreak() {
  return useQuery({
    queryKey: ['journal', 'streak'],
    queryFn: () => api.get('/journal/streak').then(r => r.data),
  })
}

export function useCurrentSummary() {
  return useQuery({
    queryKey: ['analytics', 'summary', 'current'],
    queryFn: () => api.get('/analytics/summary/current').then(r => r.data),
  })
}