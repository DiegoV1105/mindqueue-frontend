import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/axios'

export function useMySessions() {
  return useQuery({
    queryKey: ['sessions'],
    queryFn: () => api.get('/sessions/my-sessions').then(r => r.data),
  })
}

export function useMyPatients() {
  return useQuery({
    queryKey: ['therapist', 'patients'],
    queryFn: () => api.get('/sessions/patients').then(r => r.data),
  })
}

export function useCreateSession() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data) => api.post('/sessions', data).then(r => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['sessions'] }),
  })
}

export function useLinkPatient() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (email) => api.post('/sessions/link-patient', { patient_email: email }).then(r => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['therapist', 'patients'] }),
  })
}

export function usePatientSummaries(patientId) {
  return useQuery({
    queryKey: ['analytics', 'patient', patientId],
    queryFn: () => api.get(`/analytics/summary/patient/${patientId}`).then(r => r.data),
    enabled: !!patientId,
  })
}

export function useTrends(userId, weeks = 6) {
  return useQuery({
    queryKey: ['analytics', 'trends', userId, weeks],
    queryFn: () => api.get(`/analytics/trends/${userId}?weeks=${weeks}`).then(r => r.data),
    enabled: !!userId,
  })
}

export function useAvailableSlots(therapistId, weekStart) {
  return useQuery({
    queryKey: ['slots', therapistId, weekStart],
    queryFn: () => api.get(`/sessions/available-slots/${therapistId}`, {
      params: { week_start: weekStart }
    }).then(r => r.data),
    enabled: !!therapistId && !!weekStart,
  })
}

export function useTherapistInsight() {
  return useQuery({
    queryKey: ['therapist', 'insight'],
    queryFn: () => api.get('/analytics/therapist-insight').then(r => r.data),
    staleTime: 1000 * 60 * 60,
  })
}