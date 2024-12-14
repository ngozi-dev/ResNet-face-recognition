import { Label } from './ui/label'
import FaceCaptureRegistration from './face-capture'


const Facial = () => {
    return (
        <div className="space-y-2">
            <Label>Face Capture</Label>
            <FaceCaptureRegistration  />
        </div>
    )
}

export default Facial