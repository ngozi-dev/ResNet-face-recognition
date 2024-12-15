'use client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import FaceLandmarkDetection from '@/components/face-capture'

export default function VerificationPage() {

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Student Verification</h1>
      <Card>
        <CardHeader>
          <CardTitle>Face Verification</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FaceLandmarkDetection />
        </CardContent>
      </Card>
    </div>
  )
}

