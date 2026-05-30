import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'sonner'
import { useAuthStore } from '@/store/authStore'

import LoginPage from '@/pages/auth/LoginPage'
import RegisterPage from '@/pages/auth/RegisterPage'

import PatientDashboard from '@/pages/patient/PatientDashboard'
import JournalPage from '@/pages/patient/JournalPage'
import HistoryPage from '@/pages/patient/HistoryPage'
import SessionsPage from '@/pages/patient/SessionsPage'

import TherapistDashboard from '@/pages/therapist/TherapistDashboard'
import PatientDetailPage from '@/pages/therapist/PatientDetailPage'
import SchedulePage from '@/pages/therapist/SchedulePage'
import ProfilePage from '@/pages/therapist/ProfilePage'

import AppShell from '@/components/layout/AppShell'

function PrivateRoute({ children, role }) {
  const { user } = useAuthStore()
  if (!user) return <Navigate to="/login" replace />
  if (role && user.role !== role) return <Navigate to="/" replace />
  return children
}

function RoleRedirect() {
  const { user } = useAuthStore()
  if (!user) return <Navigate to="/login" replace />
  return user.role === 'therapist'
    ? <Navigate to="/therapist/dashboard" replace />
    : <Navigate to="/patient/dashboard" replace />
}

export default function App() {
  return (
    <>
    <Toaster
      position="top-right"
      toastOptions={{
        style: {
          fontFamily: "'DM Sans', system-ui, sans-serif",
          fontSize: '14px',
        },
      }}
    />
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/" element={<RoleRedirect />} />

      <Route path="/patient" element={
        <PrivateRoute role="patient">
          <AppShell />
        </PrivateRoute>
      }>
        <Route path="dashboard" element={<PatientDashboard />} />
        <Route path="journal" element={<JournalPage />} />
        <Route path="history" element={<HistoryPage />} />
        <Route path="sessions" element={<SessionsPage />} />
      </Route>

      <Route path="/therapist" element={
        <PrivateRoute role="therapist">
          <AppShell />
        </PrivateRoute>
      }>
        <Route path="dashboard" element={<TherapistDashboard />} />
        <Route path="patients/:id" element={<PatientDetailPage />} />
        <Route path="schedule" element={<SchedulePage />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>
    </Routes>
    </>
  )
}