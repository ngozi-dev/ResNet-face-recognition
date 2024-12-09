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


const routes = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/'>
      <Route path="/" element={<Home />} />,
      <Route path='auth/login' element={<SignIn />} />
      <Route path="register" element={<StudentRegistration />} />
      <Route path='app' element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path='staff' element={<div>Staff</div>} />
        <Route path='students' element={<div>Students</div>} />
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
