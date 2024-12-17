'use client'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import FaceCaptureComponent from '@/components/face-capture'

export default function VerificationPage() {

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Student Verification</h1>
      <Card>
        <CardHeader>
        </CardHeader>
        <CardContent className="space-y-4">
          <FaceCaptureComponent />
        </CardContent>
      </Card>
    </div>
  )
}

