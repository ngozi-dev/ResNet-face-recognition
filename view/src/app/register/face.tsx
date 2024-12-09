'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import FaceCapture from '@/components/face-capture'
import { Link } from 'react-router-dom'
import unibuja from '@/assets/unibuja.jpeg'

export default function FaceCapturing() {
  const [_, setFaceImage] = useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the registration data to your backend
    // For this example, we'll just show an alert and redirect
    alert('Registration successful!')
    window.location.href = '/app'
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
        <Link to='/'>
            <img src={unibuja} alt="Uniabuja Logo" className="w-20 h-20 mx-auto" />
            <CardTitle className='text-center text-lg'>Student Registration</CardTitle>
          </Link>
          <CardTitle className="text-center">Face Capturing</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <FaceCapture onCapture={setFaceImage} />
            </div>
          </CardContent>
        </form>
      </Card>
    </div>
  )
}

