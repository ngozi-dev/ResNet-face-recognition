import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Navigate } from 'react-router-dom'
import unibuja from '@/assets/unibuja.jpeg'
import post from '@/utils/post'

export default function StudentRegistration() {
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    department: '',
    student_id: '',
    faculty: '',
    level: 100,
    academic_session: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response: any = await post(
      `${import.meta.env.VITE_API_DEV_URL}/students`,
      formData);
    if (response.ok) {
      return <Navigate to="/success" />
    } 
  }

  return (
    <div className="flex font-manrope items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <img src={unibuja} alt="Uniabuja Logo" className="w-20 h-20 mx-auto" />
          <CardTitle className='text-center text-lg'>Student Registration</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="firstname">First Name</Label>
              <Input
                id="name"
                value={formData.firstname}
                onChange={(e) => setFormData((prev) => ({ ...prev, firstname: e.target.value }))}
                required
              />
            </div>
            <div>
              <Label htmlFor="lastname">Last Name</Label>
              <Input
                id="lastname"
                value={formData.lastname}
                onChange={(e) => setFormData((prev) => ({...prev, lastname: e.target.value }))}
                required
              />
            </div>
            <div>
              <Label htmlFor="student_id">Student ID</Label>
              <Input
                id="lastname"
                value={formData.student_id}
                onChange={(e) => setFormData((prev) => ({...prev, student_id: e.target.value }))}
                required
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData((prev) => ({...prev, email: e.target.value}))}
                required
              />
            </div>
            <div>
              <Label htmlFor="faculty">Faculty</Label>
              <Select onValueChange={(value) => setFormData((prev) => ({...prev, faculty: value }))} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select Faculty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="formData.cs">Computer Science</SelectItem>
                  <SelectItem value="formData.eng">Engineering</SelectItem>
                  <SelectItem value="formData.bio">Biology</SelectItem>
                  {/* Add more departments as needed */}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="department">Department</Label>
              <Select onValueChange={(value) => setFormData((prev) => ({...prev, department: value }))} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select a department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="formData.cs">Computer Science</SelectItem>
                  <SelectItem value="formData.eng">Engineering</SelectItem>
                  <SelectItem value="formData.bio">Biology</SelectItem>
                  {/* Add more departments as needed */}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="level">Level</Label>
              <Input
                id="level"
                type="number"
                min={100}
                max={500}
                step={100}
                value={formData.level}
                onChange={(e) => setFormData((prev) => ({...prev, level: Number(e.target.value)}))}
                required
              />
            </div>

            <div>
              <Label htmlFor="level">Academic Session</Label>
              <Input
                id="academic_session"
                type="month"
                min={'2024-12'}
                max={'2025-12'}
                value={formData.academic_session}
                onChange={(e) => setFormData((prev) => ({...prev, academic_session: e.target.value}))}
                required
              />
            </div>
            
          </CardContent>
          <CardFooter className='flex items-center w-full flex-col'>
            <Button type="submit" className="w-full">
              Register
            </Button>
            <p className='text-slate-500 text-sm'>Already submitted form, verify registration <a href="" className='text-blue-500 underline'>here</a></p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

