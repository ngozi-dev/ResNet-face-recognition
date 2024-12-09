'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Pencil, Trash2 } from 'lucide-react'

interface Department {
  id: number
  name: string
}

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState<Department[]>([
    { id: 1, name: 'Computer Science' },
    { id: 2, name: 'Engineering' },
    { id: 3, name: 'Biology' },
  ])
  const [newDepartment, setNewDepartment] = useState('')
  const [editingId, setEditingId] = useState<number | null>(null)

  const addDepartment = () => {
    if (newDepartment.trim()) {
      setDepartments([...departments, { id: Date.now(), name: newDepartment }])
      setNewDepartment('')
    }
  }

  const startEditing = (id: number) => {
    setEditingId(id)
  }

  const saveDepartment = (id: number, newName: string) => {
    setDepartments(departments.map(dept => 
      dept.id === id ? { ...dept, name: newName } : dept
    ))
    setEditingId(null)
  }

  const deleteDepartment = (id: number) => {
    setDepartments(departments.filter(dept => dept.id !== id))
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Manage Departments</h1>
      <div className="flex mb-4">
        <Input
          value={newDepartment}
          onChange={(e) => setNewDepartment(e.target.value)}
          placeholder="New department name"
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
          {departments.map((dept) => (
            <TableRow key={dept.id}>
              <TableCell>
                {editingId === dept.id ? (
                  <Input
                    value={dept.name}
                    onChange={(e) => saveDepartment(dept.id, e.target.value)}
                    onBlur={() => setEditingId(null)}
                    autoFocus
                  />
                ) : (
                  dept.name
                )}
              </TableCell>
              <TableCell>
                <Button variant="ghost" size="icon" onClick={() => startEditing(dept.id)}>
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

