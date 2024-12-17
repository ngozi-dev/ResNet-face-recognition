import { useState } from 'react'
import AdminSidebar from '@/components/admin-sidebar'
import { Button } from '@/components/ui/button'
import { Menu } from 'lucide-react'
import { Outlet, Navigate } from 'react-router-dom'
import { NotificationProvider } from '@/contexts/NotificationContext'
import { useUserStore } from '@/store'


export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const user = useUserStore((state) => state.user)

  return !user || !user.email || user.email.trim() === '' ? (<Navigate to='/auth/login' replace />) : (<div className="flex h-screen bg-gray-100">
      <div className={`fixed inset-y-0 left-0 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition duration-200 ease-in-out z-30`}>
        <AdminSidebar />
      </div>
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm z-10">
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu className="h-6 w-6" />
            </Button>
            <h1 className="text-lg font-semibold text-gray-900">Dashboard</h1>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <NotificationProvider>
            <Outlet />
          </NotificationProvider>
        </main>
      </div>
    </div>
  )
}

