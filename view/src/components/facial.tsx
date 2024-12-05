import FaceCapture from '@/components/face-capture'
import { useState } from 'react'
import { Label } from './ui/label'


const Facial = () => {
    const [faceImage, setFaceImage] = useState<string | null>(null)
    return (
        <div className="space-y-2">
            <Label>Face Capture</Label>
            <FaceCapture onCapture={setFaceImage} />
        </div>
    )
}

export default Facial