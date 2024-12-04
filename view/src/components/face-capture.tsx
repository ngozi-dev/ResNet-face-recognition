'use client'

import { useRef, useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import * as faceapi from 'face-api.js'

interface FaceCaptureProps {
  onCapture: (image: string) => void
}

export default function FaceCapture({ onCapture }: FaceCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isCapturing, setIsCapturing] = useState(false)

  useEffect(() => {
    const loadModels = async () => {
      await faceapi.nets.tinyFaceDetector.loadFromUri('/models')
      await faceapi.nets.faceLandmark68Net.loadFromUri('/models')
    }
    loadModels()
  }, [])

  const startCapture = async () => {
    setIsCapturing(true)
    const stream = await navigator.mediaDevices.getUserMedia({ video: {} })
    if (videoRef.current) {
      videoRef.current.srcObject = stream
    }
  }

  const captureImage = async () => {
    if (videoRef.current && canvasRef.current) {
      const detections = await faceapi.detectSingleFace(
        videoRef.current,
        new faceapi.TinyFaceDetectorOptions()
      ).withFaceLandmarks()

      if (detections) {
        const canvas = canvasRef.current
        const displaySize = { width: videoRef.current.width, height: videoRef.current.height }
        faceapi.matchDimensions(canvas, displaySize)
        canvas.getContext('2d')?.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height)
        const image = canvas.toDataURL('image/jpeg')
        onCapture(image)
        setIsCapturing(false)
        if (videoRef.current.srcObject instanceof MediaStream) {
          videoRef.current.srcObject.getTracks().forEach(track => track.stop())
        }
      } else {
        alert('No face detected. Please try again.')
      }
    }
  }

  return (
    <div className="space-y-4">
      {!isCapturing ? (
        <Button onClick={startCapture}>Start Face Capture</Button>
      ) : (
        <>
          <video ref={videoRef} autoPlay muted width={640} height={480} />
          <canvas ref={canvasRef} style={{ display: 'none' }} width={640} height={480} />
          <Button onClick={captureImage}>Capture</Button>
        </>
      )}
    </div>
  )
}

