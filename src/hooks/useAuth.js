import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import api from '@/lib/axios'
import { useAuthStore } from '@/store/authStore'

export function useLogin() {
  const { setAuth } = useAuthStore()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (credentials) => api.post('/auth/login', credentials),
    onSuccess: ({ data }) => {
      setAuth(data.user, data.access_token, data.refresh_token)
      if (data.user.role === 'therapist') {
        navigate('/therapist/dashboard')
      } else {
        navigate('/patient/dashboard')
      }
    },
  })
}

export function useRegister() {
  const { setAuth } = useAuthStore()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (data) => api.post('/auth/register', data).then(() =>
      api.post('/auth/login', { email: data.email, password: data.password })
    ),
    onSuccess: ({ data }) => {
      setAuth(data.user, data.access_token, data.refresh_token)
      navigate(data.user.role === 'therapist' ? '/therapist/dashboard' : '/patient/dashboard')
    },
  })
}

export function useLogout() {
  const { clearAuth } = useAuthStore()
  const navigate = useNavigate()

  return () => {
    clearAuth()
    navigate('/login')
  }
}