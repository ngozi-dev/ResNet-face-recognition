'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Pencil, Trash2 } from 'lucide-react'
import post from '@/utils/post'
import { useNotification } from '@/contexts/NotificationContext'
import del from '@/utils/delete'
import get from '@/utils/get'
import put from '@/utils/put'

interface Department {
  id: number
  department: string
  faculty: string
}

export default function DepartmentsPage() {
  const { showNotification } = useNotification()
  const [departments, setDepartments] = useState<Department[]>([]);
  const [newDepartment, setNewDepartment] = useState({
    department: '',
    faculty: ''
  })
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editingName, setEditingName] = useState<string>('');


  const addDepartment = async () => {
    const res: any = await post(`${import.meta.env.VITE_API_URL}/department`, newDepartment);
    if (res.message) {
      showNotification({
        message: res.message || 'Department Added Successfully',
        variant: 'success',
        duration: 5000,
      })

    } else {
      showNotification({
        message: `${res.error}`,
        variant: 'error',
        duration: 5000,
      })
    }
    setDepartments([...departments, {...res.data }])
    setNewDepartment({ department: '', faculty: '' })
  }

  const handleBlur = async () => {
    if (!editingId) return;

    // Validation
    if (editingName.trim().length < 2) {
      showNotification({
        message: 'Department name must be at least 2 characters long',
        variant: 'error',
        duration: 5000,
      });
      setEditingId(null);
      return;
    }

    try {
      const res: any = await put(`${import.meta.env.VITE_API_URL}/department/${editingId}`, { 
        department: editingName 
      });

      if (res.message) {
        // Optimistically update the local state
        const updatedDepartments = departments.map(dept => 
          dept.id === editingId 
            ? { ...dept, department: editingName } 
            : dept
        );
        
        setDepartments(updatedDepartments);
        
        showNotification({
          message: res.message || 'Department updated successfully',
          variant: 'success',
          duration: 5000,
        });
      } else {
        showNotification({
          message: res.error || 'Failed to update department',
          variant: 'error',
          duration: 5000,
        });
      }
    } catch (error) {
      console.error('Error updating department:', error);
      showNotification({
        message: 'An unexpected error occurred',
        variant: 'error',
        duration: 5000,
      });
    } finally {
      setEditingId(null);
    }
  };

  const deleteDepartment = async (id: number) => {
    const res: any = await del(`${import.meta.env.VITE_API_URL}/department/${id}`,);
    if (res.message) {
      showNotification({
        message: res.message || 'Department deleted successfully',
        variant: 'success',
        duration: 5000,
      })
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      const res: any = await get(`${import.meta.env.VITE_API_URL}/department`);
      setDepartments(res.data)
    }
    fetchData()
  }, [])

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Manage Departments</h1>
      <div className="flex mb-4">
        <Input
          value={newDepartment.department}
          onChange={(e) => setNewDepartment(prev => ({...prev, department: e.target.value}))}
          placeholder="New department name"
          className="mr-2"
        />
        <Input
          value={newDepartment.faculty}
          onChange={(e) => setNewDepartment(prev => ({...prev, faculty: e.target.value}))}
          placeholder="New Faculty name"
          className="mr-2"
        />
        <Button onClick={addDepartment}>Add Department</Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Department Name</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {departments?.map((dept) => (
            <TableRow key={dept.id}>
            <TableCell>
              {editingId === dept.id ? (
                <Input
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  onBlur={handleBlur}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleBlur();
                    if (e.key === 'Escape') setEditingId(null);
                  }}
                  autoFocus
                />
              ) : (
                <div 
                  onClick={() => {
                    setEditingId(dept.id);
                    setEditingName(dept.department);
                  }}
                  className="cursor-pointer hover:bg-gray-100 p-2 rounded"
                >
                  {dept.department}
                </div>
              )}
            </TableCell>
              <TableCell>
                <Button variant="ghost" size="icon"
                  onClick={() => {
                    setEditingId(dept.id);
                    setEditingName(dept.department);
                  }
                }>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => deleteDepartment(dept.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

