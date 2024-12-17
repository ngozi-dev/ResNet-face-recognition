import React, { useState, useRef, useCallback } from 'react';
import Webcam from 'react-webcam';
import { Camera, X, Download } from 'lucide-react';
import post from '@/utils/post';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';

interface User {
    student_id: number;
    firstname: string;
    lastname: string;
    course: string;
    level: string;
}

const FaceCaptureComponent: React.FC = () => {
  const webcamRef = useRef<Webcam>(null);
  const [capturing, setCapturing] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [user, setUser] = useState<User>();

  const startWebcam = useCallback(() => {
    setCapturing(true);
  }, []);

  const captureImage = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setCapturedImage(imageSrc);
      setCapturing(false);
    }
  }, [webcamRef]);

  const stopWebcam = useCallback(() => {
    setCapturing(false);
    setCapturedImage(null);
  }, []);

  const uploadImage = useCallback(async () => {
    if (capturedImage) {
        const formData = new FormData();
        const response: any = await fetch(capturedImage);
        const blob = await response.blob();
        formData.append('photo', blob, 'captured_image.jpg');
        const res: any = await post(`${import.meta.env.VITE_API_URL}/recognize`, formData);
        setUser(res.data);
    }
  }, [capturedImage]);

  const resetCapture = useCallback(() => {
    setCapturedImage(null);
    setCapturing(true);
  }, []);

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-xl text-center font-bold mb-4">Face Capture</h1>
      
      {!capturing && !capturedImage && (
        <button
          onClick={startWebcam}
          className="bg-blue-500 flex items-center justify-center space-x-4 w-full text-white p-2 rounded"
        >
          <Camera /> <span>Start Webcam</span>
        </button>
      )}

      {capturing && !capturedImage && (
        <div className="relative">
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            width={640}
            height={480}
            videoConstraints={{
              width: 640,
              height: 480,
              facingMode: "user"
            }}
            className="w-full rounded-lg"
          />
          <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-4">
            <button 
              onClick={captureImage}
              className="bg-green-500 p-2 rounded-full text-white"
            >
              <Camera />
            </button>
            <button 
              onClick={stopWebcam}
              className="bg-red-500 p-2 rounded-full text-white"
            >
              <X />
            </button>
          </div>
        </div>
      )}

      {capturedImage && (
        <div>
          <img 
            src={capturedImage} 
            alt="Captured" 
            className="w-full rounded-lg mb-4"
          />
          <div className="flex space-x-4">
            <button
              onClick={uploadImage}
              className="flex-1 bg-blue-500 text-white p-2 rounded flex items-center justify-center"
            >
              <Download className="mr-2" /> Verify face
            </button>
            <button
              onClick={resetCapture}
              className="flex-1 bg-gray-500 text-white p-2 rounded"
            >
              Retake
            </button>
          </div>
        </div>
      )}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Student ID</TableHead>
            <TableHead>Full Name</TableHead>
            <TableHead>Course</TableHead>
            <TableHead>Level</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {user && (
            <TableRow>
              <TableCell>{user.student_id}</TableCell>
              <TableCell>{`${user.firstname} ${user.lastname}` }</TableCell>
              <TableCell>{user.course}</TableCell>
              <TableCell>{user.level}</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default FaceCaptureComponent;