import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useNavigate } from 'react-router-dom'
import unibuja from '@/assets/unibuja.jpeg'
import { Link } from 'react-router-dom'
import post from '@/utils/post'
import { useNotification } from '@/contexts/NotificationContext'
import get from '@/utils/get'

export default function StudentRegistration() {
  const navigate = useNavigate()
  const {showNotification} = useNotification();
  const [department, setDepartment] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    department: '',
    student_id: '',
    faculty: '',
    level: 100,
    programme: '',
    mode: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      const res: any = await get(`${import.meta.env.VITE_API_URL}/department`);
      setDepartment(res.data);
    }

    fetchData();
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response: any = await post(
      `${import.meta.env.VITE_API_URL}/signup`,
      formData);
      console.log(formData);
    if (response.message) {
      showNotification({
        message: `${response.message}`,
        variant: 'success',
        duration: 5000,
      })
      navigate("/facecapture")
    } else {
      showNotification({
        message: `${response.error}`,
        variant: 'error',
        duration: 5000,
      })
    }
  }


  return (
    <div className="flex font-manrope items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <Link to='/'>
            <img src={unibuja} alt="Uniabuja Logo" className="w-20 h-20 mx-auto" />
            <CardTitle className='text-center text-lg'>Student Registration</CardTitle>
          </Link>
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
              <Label htmlFor="programme">Mode</Label>
              <Select onValueChange={(value) => setFormData((prev) => ({...prev, mode: value }))} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select examination method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="online">Online</SelectItem>
                  <SelectItem value="offline">Offline</SelectItem>
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
                  {department.map(dept => <SelectItem key={dept.id} value={dept.department}>{dept.department}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="level">Level</Label>
              <Input
                id="level"
                type="number"
                min={100}
                max={900}
                step={100}
                value={formData.level}
                onChange={(e) => setFormData((prev) => ({...prev, level: Number(e.target.value)}))}
                required
              />
            </div>

            <div>
              <Label htmlFor="programme">Programme</Label>
              <Select onValueChange={(value) => setFormData((prev) => ({...prev, programme: value }))} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select programme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Bsc">B.sc - Degree</SelectItem>
                  <SelectItem value="Msc">M.sc - Masters</SelectItem>
                  <SelectItem value="Phd">Ph.D - Doctorate</SelectItem>
                </SelectContent>
              </Select>
            </div>
           
            
          </CardContent>
          <CardFooter className='flex items-center w-full flex-col'>
            <Button type="submit" className="w-full">
              Register
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

