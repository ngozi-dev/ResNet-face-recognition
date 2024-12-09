'use client'

import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import post from '@/utils/post'
import { useNotification } from '@/contexts/NotificationContext'

export default function SignInForm() {
  const { showNotification } = useNotification()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const response: any = await post(`${import.meta.env.VITE_API_URL}/login`, formData);
    if (response.status === 200) {
      showNotification({
        message: 'Sign in successful',
        variant: 'success',
        duration: 5000,
      })
      return <Navigate to="/app" />
    } else {
      showNotification({
        message: `${response.error}`,
        variant: 'error',
        duration: 5000,
      })
    }
  }

  return (
    <Card className='font-manrope'>
      <CardHeader>
        <CardTitle className='text-center text-lg'>Sign In</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="admin@example.com"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({...prev, email: e.target.value}))}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              placeholder='********'
              type="password"
              value={formData.password}
              onChange={(e) => setFormData(prev => ({...prev, password: e.target.value}))}
              required
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full">Sign In</Button>
        </CardFooter>
      </form>
    </Card>
  )
}

