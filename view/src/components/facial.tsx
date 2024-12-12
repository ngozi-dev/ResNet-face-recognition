import { Label } from './ui/label'
import FaceCaptureRegistration from './face-capture'


const Facial = () => {
    const handleRegistrationComplete = (imageData: string) => {
        // Process captured image
        console.log('Registration complete', imageData);
      };
    
    return (
        <div className="space-y-2">
            <Label>Face Capture</Label>
            <FaceCaptureRegistration onRegistrationComplete={handleRegistrationComplete} />
        </div>
    )
}

export default Facial