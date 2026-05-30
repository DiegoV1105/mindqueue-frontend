import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user:         null,
      accessToken:  null,
      refreshToken: null,
      isLoading:    false,

      setAuth: (user, accessToken, refreshToken) => {
        localStorage.setItem('mq_access_token',  accessToken)
        localStorage.setItem('mq_refresh_token', refreshToken)
        set({ user, accessToken, refreshToken })
      },

      clearAuth: () => {
        localStorage.removeItem('mq_access_token')
        localStorage.removeItem('mq_refresh_token')
        set({ user: null, accessToken: null, refreshToken: null })
      },

      isAuthenticated: () => !!get().user,
      isTherapist:     () => get().user?.role === 'therapist',
      isPatient:       () => get().user?.role === 'patient',
    }),
    {
      name: 'mq_auth',
      partialize: (state) => ({
        user:         state.user,
        accessToken:  state.accessToken,
        refreshToken: state.refreshToken,
      }),
    }
  )
)