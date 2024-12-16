import React, { useState, useRef, useCallback } from "react";
import { Camera, X, Download } from 'lucide-react';
import { useNotification } from "@/contexts/NotificationContext";
import post from "@/utils/post";

const FaceLandmarkDetection: React.FC = () => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const {showNotification} = useNotification();

    const [webcamRunning, setWebcamRunning] = useState(false);
    const [capturedImage, setCapturedImage] = useState<string | null>(null);

    const startWebCam = async () => {
        try {
            // Request camera access
            const stream = await navigator.mediaDevices.getUserMedia({ 
                video: { 
                    width: { ideal: 640 },
                    height: { ideal: 480 } 
                } 
            });

            // Set video source and state
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                streamRef.current = stream;
                setWebcamRunning(true);
            }
        } catch (error) {
            showNotification({
                message: String(error),
                duration: 5000,
                variant: "error"
            });
            console.error("Webcam access error:", error);
        }
    };

    const captureImage = useCallback(() => {
        const video = videoRef.current;
        const canvas = canvasRef.current;

        if (video && canvas) {
            // Set canvas dimensions to match video
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            // Draw current video frame on canvas
            const context = canvas.getContext('2d');
            context?.drawImage(video, 0, 0, canvas.width, canvas.height);

            // Convert canvas to data URL
            const imageDataUrl = canvas.toDataURL('image/jpeg');
            setCapturedImage(imageDataUrl);

            // Stop video stream
            stopWebCam();
        }
    }, []);

    const stopWebCam = useCallback(() => {
        // Stop all video tracks
        streamRef.current?.getTracks().forEach(track => track.stop());
        
        // Reset references and state
        if (videoRef.current) {
            videoRef.current.srcObject = null;
        }
        setWebcamRunning(false);
    }, []);

    const uploadImage = async () => {
        if (!capturedImage) {
            showNotification({
                message: "No image captured",
                duration: 5000,
                variant: "error"
            })
            return;
        }

        try {
            // Convert data URL to Blob
            const res: any = await fetch(capturedImage);
            const blob = await res.blob();

            // Create FormData
            const formData = new FormData();
            formData.append('file', blob, 'captured_face.jpg');

            // Upload to backend
            const response: any = await post(`${import.meta.env.VITE_API_URL}/recognize`, formData);

            if (response.ok) {
                showNotification({
                    message: "Image uploaded successfully",
                    duration: 5000,
                    variant: "success"
                })
            } else {
                showNotification({
                    message: "Upload failed",
                    duration: 5000,
                    variant: "error"
                })
            }
        } catch (error) {
            showNotification({
                message: "Upload error",
                duration: 5000,
                variant: "error"
            })
            console.error("Upload error:", error);
        }
    };

    const resetCapture = () => {
        setCapturedImage(null);
        startWebCam();
    };

    return (
        <div className="p-4 max-w-md mx-auto">
            <h1 className="text-xl text-center font-bold mb-4">Face Capturing</h1>
            
            {!webcamRunning && !capturedImage && (
                <button
                    onClick={startWebCam}
                    className="bg-blue-500 items-center flex justify-center space-x-4 w-full text-white p-2 rounded"
                >
                    <Camera /> <span>Start Capturing</span>
                </button>
            )}

            {webcamRunning && !capturedImage && (
                <div style={{ position: 'relative' }}>
                    <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        style={{ width: '100%', borderRadius: '8px' }}
                    />
                    <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-4">
                        <button 
                            onClick={captureImage}
                            className="bg-green-500 p-2 rounded-full text-white"
                        >
                            <Camera />
                        </button>
                        <button 
                            onClick={stopWebCam}
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
                            <Download className="mr-2" /> Upload Image
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

            <canvas 
                ref={canvasRef} 
                style={{ display: 'none' }}
            />
        </div>
    );
};

export default FaceLandmarkDetection;