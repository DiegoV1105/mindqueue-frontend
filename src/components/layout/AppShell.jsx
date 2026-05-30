import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import TopBar from './TopBar'
import MobileNav from './MobileNav'
import { useNotificationSetup } from '@/hooks/useNotificationSetup'

export default function AppShell() {
  useNotificationSetup()

  return (
    <div className="min-h-screen bg-bg">
      <Sidebar />
      <div className="lg:pl-[260px] overflow-x-hidden">
        <TopBar />
        <main className="p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
      <MobileNav />
    </div>
  )
}
