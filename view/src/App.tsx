import './App.css'
import {
  createBrowserRouter,
  Route,
  createRoutesFromElements,
  RouterProvider } from 'react-router-dom'
import StudentRegistration from './app/register/page'
import SignIn from './app/auth/login/page'
import Home from './app/page'
import AdminLayout from './app/admin/layout'
import AdminDashboard from './app/admin/dashboard/page'
import { NotificationProvider } from './contexts/NotificationContext'
import StaffPage from './app/admin/staff/page'
import DepartmentsPage from './app/admin/departments/page'
import VerificationPage from './app/admin/verification/page'


const routes = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/'>
      <Route path="/" element={<Home />} />,
      <Route path='auth/login' element={
      <NotificationProvider>
        <SignIn />
      </NotificationProvider> } />
      <Route path="register" element={
        <NotificationProvider>
          <StudentRegistration />
        </NotificationProvider>} />
      <Route path='app' element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path='staff' element={<StaffPage />} />
        <Route path='departments' element={<DepartmentsPage />} />
        <Route path='students' element={<div>Students</div>} />
        <Route path='verification' element={<VerificationPage />} />
      </Route>
      <Route path='*' element={<div>404</div>} />
    </Route>
  )
)
function App() {


  return (
    <RouterProvider router={routes} />
  )
}

export default App
