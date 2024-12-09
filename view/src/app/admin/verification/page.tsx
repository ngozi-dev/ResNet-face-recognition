'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import FaceCapture from '@/components/face-capture'

export default function VerificationPage() {
  const [verificationResult, setVerificationResult] = useState<{name: string, department: string} | null>(null)

  const handleVerification = async () => {
    // In a real application, you would send the image to your backend for verification
    // For this example, we'll simulate a successful verification
    await new Promise(resolve => setTimeout(resolve, 2000)) // Simulate API call
    setVerificationResult({
      name: "John Doe",
      department: "Computer Science"
    })
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Student Verification</h1>
      <Card>
        <CardHeader>
          <CardTitle>Face Verification</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FaceCapture onCapture={handleVerification} />
          {verificationResult && (
            <div className="mt-4 p-4 bg-green-100 rounded-md">
              <h2 className="text-xl font-semibold mb-2">Verification Successful</h2>
              <p><strong>Name:</strong> {verificationResult.name}</p>
              <p><strong>Department:</strong> {verificationResult.department}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

