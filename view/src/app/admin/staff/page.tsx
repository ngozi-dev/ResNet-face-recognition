'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Pencil, Trash2 } from 'lucide-react'

interface Staff {
  id: number
  name: string
  role: string
  department: string
}

export default function StaffPage() {
  const [staff, setStaff] = useState<Staff[]>([
    { id: 1, name: 'John Doe', role: 'Lecturer', department: 'Computer Science' },
    { id: 2, name: 'Jane Smith', role: 'Professor', department: 'Engineering' },
  ])
  const [newStaff, setNewStaff] = useState({ name: '', role: '', department: '' })
  const [editingId, setEditingId] = useState<number | null>(null)

  const addStaff = () => {
    if (newStaff.name && newStaff.role && newStaff.department) {
      setStaff([...staff, { id: Date.now(), ...newStaff }])
      setNewStaff({ name: '', role: '', department: '' })
    }
  }

  const startEditing = (id: number) => {
    setEditingId(id)
  }

  const saveStaff = (id: number, updatedStaff: Partial<Staff>) => {
    setStaff(staff.map(s => 
      s.id === id ? { ...s, ...updatedStaff } : s
    ))
    setEditingId(null)
  }

  const deleteStaff = (id: number) => {
    setStaff(staff.filter(s => s.id !== id))
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Manage Staff</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <Input
          value={newStaff.name}
          onChange={(e) => setNewStaff({...newStaff, name: e.target.value})}
          placeholder="Name"
        />
        <Input
          value={newStaff.role}
          onChange={(e) => setNewStaff({...newStaff, role: e.target.value})}
          placeholder="Role"
        />
        <Select onValueChange={(value) => setNewStaff({...newStaff, department: value})}>
          <SelectTrigger>
            <SelectValue placeholder="Department" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Computer Science">Computer Science</SelectItem>
            <SelectItem value="Engineering">Engineering</SelectItem>
            <SelectItem value="Biology">Biology</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={addStaff}>Add Staff</Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Department</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {staff.map((s) => (
            <TableRow key={s.id}>
              <TableCell>
                {editingId === s.id ? (
                  <Input
                    value={s.name}
                    onChange={(e) => saveStaff(s.id, { name: e.target.value })}
                    onBlur={() => setEditingId(null)}
                    autoFocus
                  />
                ) : (
                  s.name
                )}
              </TableCell>
              <TableCell>
                {editingId === s.id ? (
                  <Input
                    value={s.role}
                    onChange={(e) => saveStaff(s.id, { role: e.target.value })}
                    onBlur={() => setEditingId(null)}
                  />
                ) : (
                  s.role
                )}
              </TableCell>
              <TableCell>
                {editingId === s.id ? (
                  <Select 
                    defaultValue={s.department}
                    onValueChange={(value) => saveStaff(s.id, { department: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Computer Science">Computer Science</SelectItem>
                      <SelectItem value="Engineering">Engineering</SelectItem>
                      <SelectItem value="Biology">Biology</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  s.department
                )}
              </TableCell>
              <TableCell>
                <Button variant="ghost" size="icon" onClick={() => startEditing(s.id)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => deleteStaff(s.id)}>
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

