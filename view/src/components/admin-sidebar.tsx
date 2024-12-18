'use client'
import { NavLink, useNavigate } from 'react-router-dom'
import { Home, Users, BookOpen, LogOut, Camera } from 'lucide-react'
import { useUserStore } from '@/store'


const navItems = [
  { name: 'Dashboard', href: '/app', icon: Home },
  { name: 'Verification', href: '/app/verification', icon: Camera },
  { name: 'Departments', href: '/app/departments', icon: BookOpen },
  { name: 'Staff', href: '/app/staff', icon: Users },
]

export default function AdminSidebar() {
  const logout = useUserStore.getState().logout;
  const navigate = useNavigate();


  const handleLogout = () => {
    console.log('Logging out: ', useUserStore.getState().user);
    logout();
    console.log('Logged out: ', useUserStore.getState().user);
    navigate('/auth/login');
  };

  return (
    <div className="w-64 bg-white shadow-md h-full">
      <div className="p-4">
        <h2 className="text-2xl font-bold">Control Panel</h2>
      </div>
      <nav className="mt-8">
        <ul>
          {navItems.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.href}
                className={({isActive}) => `flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 ${
                  isActive ? 'bg-gray-200' : ''
                }`}
              >
                <item.icon className="w-5 h-5 mr-2" />
                {item.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <div className="absolute bottom-0 w-64 p-4">
        <button
          onClick={handleLogout}
          className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
        >
          <LogOut className="w-5 h-5 mr-2" />
          Sign Out
        </button>
      </div>
    </div>
  )
}