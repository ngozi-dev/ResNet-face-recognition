'use client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Link } from 'react-router-dom'
import unibuja from '@/assets/unibuja.jpeg'
import FaceRegistration from '@/components/face-capture'

export default function FaceCapturing() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
        <Link to='/'>
            <img src={unibuja} alt="Uniabuja Logo" className="w-20 h-20 mx-auto" />
            <CardTitle className='text-center text-lg'>Student Face Capturing</CardTitle>
          </Link>
        </CardHeader>
        <form>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <FaceRegistration />
            </div>
          </CardContent>
        </form>
      </Card>
    </div>
  )
}

