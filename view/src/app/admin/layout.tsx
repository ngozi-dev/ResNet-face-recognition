import { Outlet } from 'react-router-dom'
import AdminSidebar from '@/components/admin-sidebar'

export default function AdminLayout() {
  return (
    <div className="flex font-manrope h-screen bg-gray-100">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto p-8">
        <Outlet />
      </main>
    </div>
  )
}

