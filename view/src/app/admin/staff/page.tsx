'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Pencil, Trash2 } from 'lucide-react'
import { useNotification } from '@/contexts/NotificationContext'
import post from '@/utils/post'
import del from '@/utils/delete'
import put from '@/utils/put'
import get from '@/utils/get'

interface Staff {
  id: number
  fullname: string
  role: string
  email: string
  department: string
}


type EditingState = {
  id: number | null;
  fields: Partial<Staff>;
};


export default function StaffPage() {
  const [staff, setStaff] = useState<Staff[]>([])
  const {showNotification} = useNotification();
  const [newStaff, setNewStaff] = useState({ fullname: '', role: '', email: '', department: '' })
  const [editingState, setEditingState] = useState<EditingState>({
    id: null,
    fields: {}
  });
  const [department, setDepartment] = useState<any[]>([])

  const addStaff = async () => {
    if (newStaff.fullname && newStaff.role && newStaff.department) {
      const res: any = await post(`${import.meta.env.VITE_API_URL}/staff`, newStaff);
      if (res.message) {
        showNotification({
          message: res.message || 'Staff Added Successfully',
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
      setStaff([...staff, {...res.data }])
      setNewStaff({ fullname: '', role: '', email: '', department: '' })
    }
  }

  const startEditing = (staffMember: Staff) => {
    setEditingState({
      id: staffMember.id,
      fields: { ...staffMember }
    });
  };

  // Handle input changes during editing
  const handleEditChange = (field: keyof Staff, value: string) => {
    setEditingState(prev => ({
      ...prev,
      fields: {
        ...prev.fields,
        [field]: value
      }
    }));
  };

  // Save staff changes
  const saveStaff = async () => {
    try {
      if (!editingState.id) return;

      // Prepare update payload
      const updatePayload = { ...editingState.fields };

      // API call to update staff
      const res: any = await put(
        `${import.meta.env.VITE_API_URL}/staff/${editingState.id}`, 
        updatePayload
      );

      if (res.message) {
        // Update local state
        setStaff(prevStaff => 
          prevStaff.map(s => 
            s.id === editingState.id 
              ? { ...s, ...updatePayload } 
              : s
          )
        );

        // Show success notification
        showNotification({
          message: 'Staff updated successfully',
          variant: 'success',
          duration: 3000
        });

        // Reset editing state
        setEditingState({ id: null, fields: {} });
      } else {
        // Handle update failure
        showNotification({
          message: res.error || 'Failed to update staff',
          variant: 'error',
          duration: 3000
        });
      }
    } catch (error) {
      console.error('Error updating staff:', error);
      showNotification({
        message: 'An unexpected error occurred',
        variant: 'error',
        duration: 3000
      });
    }
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingState({ id: null, fields: {} });
  };

  const deleteStaff = async (id: number) => {
    const res: any = await del(`${import.meta.env.VITE_API_URL}/staff/${id}`,);
    if (res.message) {
      showNotification({
        message: res.message || 'Staff deleted successfully',
        variant: 'success',
        duration: 5000,
      })
      setStaff(staff.filter(s => s.id !== id))
    } else {
      showNotification({
        message: `${res.error}`,
        variant: 'error',
        duration: 5000,
      })
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      const res: any = await get(`${import.meta.env.VITE_API_URL}/staff`);
      setStaff(res.data)
      const response: any = await get(`${import.meta.env.VITE_API_URL}/department`);
      setDepartment(response.data);
    }
    fetchData()
  }, [])


  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Manage Staff</h1>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
        <Input
          value={newStaff.fullname}
          onChange={(e) => setNewStaff({...newStaff, fullname: e.target.value})}
          placeholder="Name"
        />
        <Input
          value={newStaff.role}
          onChange={(e) => setNewStaff({...newStaff, role: e.target.value})}
          placeholder="Role"
        />
        <Input
          value={newStaff.email}
          onChange={(e) => setNewStaff({...newStaff, email: e.target.value})}
          placeholder="Email"
        />
        <Select onValueChange={(value) => setNewStaff({...newStaff, email: '', department: value})}>
          <SelectTrigger>
            <SelectValue placeholder="Department" />
          </SelectTrigger>
          <SelectContent>
            {department?.map((dept) => <SelectItem key={dept.id} value={dept.department}>{dept.department}</SelectItem>)}
          </SelectContent>
        </Select>
        <Button onClick={addStaff}>Add Staff</Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Department</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {staff.map((s) => (
            <TableRow key={s.id}>
              <TableCell>
              {editingState.id === s.id ? (
                  <Input
                    value={editingState.fields.fullname || s.fullname}
                    onChange={(e) => handleEditChange('fullname', e.target.value)}
                  />
                ) : (
                  s.fullname
                )}
              </TableCell>
              <TableCell>
              {editingState.id === s.id ? (
                  <Input
                    value={editingState.fields.role || s.role}
                    onChange={(e) => handleEditChange('role', e.target.value)}
                  />
                ) : (
                  s.role
                )}
              </TableCell>
              <TableCell>
              {editingState.id === s.id ? (
                  <Input
                    value={editingState.fields.email || s.email}
                    onChange={(e) => handleEditChange('email', e.target.value)}
                  />
                ) : (
                  s.email
                )}
              </TableCell>
              <TableCell>
                {editingState.id === s.id ? (
                  <Select
                    value={editingState.fields.department || s.department}
                    onValueChange={(value) => handleEditChange('department', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Department" />
                    </SelectTrigger>
                    <SelectContent>
                      {department?.map(dept => (
                        <SelectItem key={dept.id} value={dept.department}>
                          {dept.department}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  s.department
                )}
              </TableCell>
              <TableCell>
              {editingState.id === s.id ? (
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      onClick={saveStaff}
                    >
                      Save
                    </Button>
                    <Button 
                      variant="destructive" 
                      onClick={cancelEditing}
                    >
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <div className="flex space-x-2">
                    <Button 
                      variant="ghost" 
                      onClick={() => startEditing(s)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      onClick={() => deleteStaff(s.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

