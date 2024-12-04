import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function AdminDashboard() {
  // In a real application, you would fetch this data from your backend
  const stats = {
    studentsRegistered: 1234,
    departmentsRegistered: 15,
    staffRegistered: 50,
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Students Registered</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{stats.studentsRegistered}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Departments Registered</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{stats.departmentsRegistered}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Staff Registered</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{stats.staffRegistered}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

