import React, { useState, useRef, useEffect, useCallback } from 'react';
import {FaceLandmarker, FilesetResolver} from '@mediapipe/tasks-vision'
import { Camera } from 'lucide-react';


interface FaceRegistrationProps {
  onRegistrationComplete?: (imageData: string) => void;
}

const FaceRegistration: React.FC<FaceRegistrationProps> = ({ onRegistrationComplete }) => {
  const [faceLandmarker, setFaceLandmarker] = useState<any>(null);
  const [webcamRunning, setWebcamRunning] = useState(false);
  const [registrationStage, setRegistrationStage] = useState<
    'initial' | 'frown' | 'smile' | 'blink' | 'complete'
  >('initial');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const createFaceLandmarker = useCallback(async () => {
    const filesetResolver = await FilesetResolver.forVisionTasks(
      "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm"
    );
    const landmarker = await FaceLandmarker.createFromOptions(filesetResolver, {
      baseOptions: {
        modelAssetPath: `https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task`,
        delegate: "GPU"
      },
      outputFaceBlendshapes: true,
      runningMode: "VIDEO",
      numFaces: 1
    });
    setFaceLandmarker(landmarker);
  }, []);

  useEffect(() => {
    createFaceLandmarker();
    setLoading(true);
    console.log('Face Landmarker created');
  }, [createFaceLandmarker]);

  const startWebcam = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setWebcamRunning(true);
      }
    } catch (error) {
      setErrorMessage('Could not access webcam. Please check permissions.');
    }
  }, []);

  const stopWebcam = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      setWebcamRunning(false);
    }
  }, []);

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

  const checkForUnwantedAccessories = (landmarks: any): boolean => {
    // Simplified detection - you might want to enhance this with more sophisticated logic
    const hasHat = landmarks.some((landmark: any) => 
      landmark.y < landmarks[10].y // Assume top of head landmarks
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

  const processFrame = useCallback(() => {
    if (!videoRef.current || !canvasRef.current || !faceLandmarker) return;

    const results = faceLandmarker.detectForVideo(videoRef.current, performance.now());

    if (results.faceLandmarks.length === 0) {
      setErrorMessage('No face detected. Please ensure you are in frame.');
      return;
    }

    if (checkForUnwantedAccessories(results.faceLandmarks[0])) return;

    if (checkFacialExpression(results.faceBlendshapes)) {
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
          const canvas = canvasRef.current;
          const context = canvas.getContext('2d');
          if (context) {
            context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
          } else {
            setErrorMessage('Failed to capture image. Please try again.');
          }
          const imageDataUrl = canvas.toDataURL('image/jpeg');
          setCapturedImage(imageDataUrl);
          stopWebcam();
          setRegistrationStage('complete');
          onRegistrationComplete?.(imageDataUrl);
          break;
      }
    }
  }, [faceLandmarker, registrationStage, stopWebcam, onRegistrationComplete]);

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
            onClick={startWebcam}
            className="bg-blue-500 items-center flex justify-center space-x-4 w-full  text-white p-2 rounded"
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
              style={{ display: 'none' }} 
              width={640} 
              height={480} 
            />
            <div style={{ marginTop: '10px', fontWeight: 'bold' }}>
              {registrationStage === 'initial' && 'Prepare to Frown'}
              {registrationStage === 'frown' && 'Now Smile'}
              {registrationStage === 'smile' && 'Now Blink'}
              {registrationStage === 'blink' && 'Almost Done!'}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl text-center font-bold mb-4">Face Registration</h2>
      {loading ? 'Model Loading...' : null}
      {renderContent()}
    </div>
  );
};

export default FaceRegistration;