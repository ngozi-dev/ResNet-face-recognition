import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useEffect, useState } from 'react'
import get from '@/utils/get'

interface Stats {
  students: number
  departments: number
  staffs: number
}
export default function AdminDashboard() {
  // In a real application, you would fetch this data from your backend
  const [stats, setStats] = useState<Stats>()

  useEffect(() => {
    const fetchStats = async () => {
      const res: any = await get(`${import.meta.env.VITE_API_URL}/stats`)
      setStats(res.data)
    }
    fetchStats()
  }, [])

  return (
    <div>
      <h1 className="text-3xl font-manrope font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Students Registered</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{stats?.students}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Departments Registered</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{stats?.departments}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Staff Registered</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{stats?.staffs}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

