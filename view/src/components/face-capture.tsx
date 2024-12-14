import { useState, useRef, useEffect, useCallback } from "react";
import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";
import { Camera } from 'lucide-react';

const FaceLandmarkDetection = () => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const [webcamRunning, setWebcamRunning] = useState(false);
    const [faceLandmarker, setFaceLandmarker] = useState<FaceLandmarker | null>(null);
    const [registrationStage, setRegistrationStage] = useState<
        'initial' | 'frown' | 'smile' | 'blink' | 'complete'
    >('initial');
    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const createFaceLandmarker = async () => {
        try {
            const filesetResolver = await FilesetResolver.forVisionTasks(
                "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm"
            );
            const landmarker = await FaceLandmarker.createFromOptions(filesetResolver, {
                baseOptions: {
                    modelAssetPath: `https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task`,
                    delegate: "CPU"
                },
                outputFaceBlendshapes: true,
                runningMode: "VIDEO",
                numFaces: 1
            });
            setFaceLandmarker(landmarker);
        } catch (error) {
            console.error("Failed to create face landmarker:", error);
            setErrorMessage("Failed to initialize face detection. Please check your browser compatibility.");
        }
    }

    useEffect(() => {
        createFaceLandmarker();
    }, [])

    const startCamera = async () => {
        try {
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                setErrorMessage('Webcam not accessible on this browser');
                return;
            }
            const stream = await navigator.mediaDevices.getUserMedia({ 
                video: { 
                    width: { ideal: 640 },
                    height: { ideal: 480 }
                } 
            });
            
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                streamRef.current = stream;
                
                videoRef.current.onloadedmetadata = () => {
                    setWebcamRunning(true);
                }
            }
        } catch (error) {
            console.error('Could not access webcam:', error);
            setErrorMessage('Could not access webcam. Please check permissions.');
        }
    }

    const stopWebcam = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            setWebcamRunning(false);
        }
    }

    const checkForUnwantedAccessories = (landmarks: any): boolean => {
        // Simplified detection
        const hasHat = landmarks.some((landmark: any) => 
            landmark.y < landmarks[10].y // Top of head landmarks
        );
        
        const hasGlasses = landmarks.some(() => 
            Math.abs(landmarks[468].x - landmarks[473].x) > 0.05 // Distance between eye landmarks
        );

        if (hasHat) {
            setErrorMessage('Please remove your hat or cap');
            return true;
        }

        if (hasGlasses) {
            setErrorMessage('Please remove your glasses');
            return true;
        }

        return false;
    };

    const checkFacialExpression = (blendShapes: any) => {
        if (!blendShapes || !blendShapes.length) return false;

        const expressions = blendShapes[0].categories.reduce((acc: any, shape: any) => {
            acc[shape.categoryName] = shape.score;
            return acc;
        }, {});

        // Specific expressions detection
        switch (registrationStage) {
            case 'frown':
                return expressions['browDownLeft'] > 0.7 && expressions['browDownRight'] > 0.7;
            case 'smile':
                return expressions['mouthSmileLeft'] > 0.7 && expressions['mouthSmileRight'] > 0.7;
            case 'blink':
                return expressions['eyeBlinkLeft'] > 0.7 && expressions['eyeBlinkRight'] > 0.7;
            default:
                return false;
        }
    };

    const processFrame = useCallback(() => {
        if (!videoRef.current || !canvasRef.current || !faceLandmarker) return;
        
        const canvasCtx = canvasRef.current.getContext("2d");
        if (!canvasCtx) return;

        if (videoRef.current.videoWidth === 0 || videoRef.current.videoHeight === 0) {
            console.warn('Video not ready or has zero dimensions');
            return;
        }

        canvasCtx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        canvasCtx.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);

        try {
            const results = faceLandmarker.detectForVideo(videoRef.current, performance.now());
            
            if (!results.faceLandmarks || results.faceLandmarks.length === 0) {
                setErrorMessage('No face detected. Please ensure you are in frame.');
                return;
            }

            const landmarks = results.faceLandmarks[0];
            const blendshapes = results.faceBlendshapes;

            // Check for unwanted accessories
            if (checkForUnwantedAccessories(landmarks)) return;

            // Check for specific facial expressions
            if (checkFacialExpression(blendshapes)) {
                switch (registrationStage) {
                    case 'initial':
                        setRegistrationStage('frown');
                        break;
                    case 'frown':
                        setRegistrationStage('smile');
                        break;
                    case 'smile':
                        setRegistrationStage('blink');
                        break;
                    case 'blink':
                        // Capture image
                        const imageDataUrl = canvasRef.current.toDataURL('image/jpeg');
                        setCapturedImage(imageDataUrl);
                        stopWebcam();
                        setRegistrationStage('complete');
                        break;
                }
            }
        } catch (error) {
            console.error('Error in face detection:', error);
            setErrorMessage('Failed to process video frame. Please try again.');
        }
    }, [faceLandmarker, registrationStage]);

    useEffect(() => {
        let animationFrameId: number;
        if (webcamRunning && faceLandmarker) {
            const runDetection = () => {
                processFrame();
                animationFrameId = requestAnimationFrame(runDetection);
            };
            animationFrameId = requestAnimationFrame(runDetection);
        }
        return () => {
            if (animationFrameId) cancelAnimationFrame(animationFrameId);
        };
    }, [webcamRunning, faceLandmarker, processFrame]);

    const renderContent = () => {
        if (capturedImage) {
            return (
                <div>
                    <img 
                        src={capturedImage} 
                        alt="Captured Face" 
                        style={{ maxWidth: '100%', borderRadius: '8px' }} 
                    />
                </div>
            );
        }

        return (
            <div>
                {errorMessage && (
                    <div style={{ color: 'red', marginBottom: '10px' }}>
                        {errorMessage}
                    </div>
                )}
                {!webcamRunning ? (
                    <button
                        onClick={startCamera}
                        className="bg-blue-500 items-center flex justify-center space-x-4 w-full text-white p-2 rounded"
                    >
                        <Camera /> <span>Start Registration</span>
                    </button>
                ) : (
                    <div style={{ position: 'relative' }}>
                        <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            style={{ width: '100%', borderRadius: '8px' }}
                        />
                        <canvas 
                            ref={canvasRef} 
                            style={{ 
                                position: 'absolute', 
                                top: 0, 
                                left: 0, 
                                width: '100%', 
                                height: '100%', 
                                borderRadius: '8px' 
                            }} 
                            width={640} 
                            height={480} 
                        />
                        <div style={{ marginTop: '10px', fontWeight: 'bold', textAlign: 'center' }}>
                            {registrationStage === 'initial' && 'Prepare to Frown'}
                            {registrationStage === 'frown' && 'Now Smile'}
                            {registrationStage === 'smile' && 'Now Blink'}
                            {registrationStage === 'blink' && 'Almost Done!'}
                        </div>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="p-4 max-w-md mx-auto">
            <h1 className="text-xl text-center font-bold mb-4">Face Registration</h1>
            {renderContent()}
        </div>
    )
}

export default FaceLandmarkDetection;